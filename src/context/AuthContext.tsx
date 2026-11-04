// მომხმარებლის დემო შესვლას, რეგისტრაციას, პროფილის განახლებასა და გამოსვლას მართავს.
import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthUser, RegisteredUser } from "../types/user";

type LoginResult = "success" | "invalid";
type RegisterResult = "success" | "exists" | "storage-error";

interface AuthContextValue {
  user: AuthUser;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  register: (fullName: string, email: string, password: string) => Promise<RegisterResult>;
  updateProfile: (details: Pick<AuthUser, "fullName" | "email" | "address">) => void;
  logout: () => void;
}

const USERS_KEY = "10x-shop-users";
const CURRENT_USER_KEY = "10x-shop-current-user";
const guestUser: AuthUser = { username: "", fullName: "", email: "", address: "", isLoggedIn: false };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isRegisteredUser(value: unknown): value is RegisteredUser {
  if (typeof value !== "object" || value === null) return false;
  return "fullName" in value && typeof value.fullName === "string" &&
    "email" in value && typeof value.email === "string" &&
    "passwordHash" in value && typeof value.passwordHash === "string" &&
    "passwordSalt" in value && typeof value.passwordSalt === "string" &&
    "address" in value && typeof value.address === "string";
}

function readRegisteredUsers(): RegisteredUser[] {
  // ადგილობრივ მონაცემებს ვამოწმებთ და ძველ, უბრალო ტექსტად შენახულ პაროლებს ვშლით.
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    if (!Array.isArray(stored)) return [];
    const users = stored.filter(isRegisteredUser);
    if (users.length !== stored.length) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  } catch {
    return [];
  }
}

function readCurrentUser(): AuthUser {
  // აღდგენისას მომხმარებლის ყველა ტექსტურ ველს ცალ-ცალკე ვამოწმებთ.
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) ?? "null");
    if (
      typeof value === "object" && value !== null &&
      "username" in value && typeof value.username === "string" &&
      "fullName" in value && typeof value.fullName === "string" &&
      "email" in value && typeof value.email === "string" &&
      "address" in value && typeof value.address === "string"
    ) {
      return { username: value.username, fullName: value.fullName, email: value.email, address: value.address, isLoggedIn: true };
    }
  } catch {
    // დაზიანებულ სესიას ქვემოთ guest მდგომარეობით ვანაცვლებთ.
  }
  return guestUser;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password: string, salt: string): Promise<string> {
  // რეგისტრირებული პაროლი PBKDF2-ით იჰეშება; თავდაპირველი ტექსტი საცავში არ იწერება.
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const result = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: Uint8Array.from(salt.match(/.{2}/g) ?? [], (part) => parseInt(part, 16)), iterations: 120_000 },
    passwordKey,
    256,
  );
  return bytesToHex(new Uint8Array(result));
}

function persistUser(user: AuthUser): void {
  // საცავის მიუწვდომლობის შემთხვევაშიც მიმდინარე React სესია მუშაობს.
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch {
    // სესია მიმდინარე გვერდზე რჩება, თუმცა refresh-ზე აღარ აღდგება.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(readCurrentUser);

  const login = async (identifier: string, password: string): Promise<LoginResult> => {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    if (!normalizedIdentifier || password.trim().length < 6) return "invalid";

    const registered = readRegisteredUsers().find(
      (entry) => entry.email.toLowerCase() === normalizedIdentifier,
    );
    if (registered && await hashPassword(password, registered.passwordSalt) !== registered.passwordHash) {
      return "invalid";
    }

    // CORE Login არის ლოკალური სასწავლო ფორმა; რეგისტრირებული ანგარიში კი პაროლის ჰეშით მოწმდება.
    const nextUser: AuthUser = {
      username: normalizedIdentifier,
      fullName: registered?.fullName ?? normalizedIdentifier,
      email: registered?.email ?? (normalizedIdentifier.includes("@") ? normalizedIdentifier : ""),
      address: registered?.address ?? "",
      isLoggedIn: true,
    };
    persistUser(nextUser);
    setUser(nextUser);
    return "success";
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ): Promise<RegisterResult> => {
    const users = readRegisteredUsers();
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((entry) => entry.email.toLowerCase() === normalizedEmail)) return "exists";

    const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
    const registered: RegisteredUser = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordSalt: salt,
      passwordHash: await hashPassword(password, salt),
      address: "",
    };
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, registered]));
    } catch {
      return "storage-error";
    }

    const nextUser: AuthUser = {
      username: normalizedEmail,
      fullName: registered.fullName,
      email: normalizedEmail,
      address: "",
      isLoggedIn: true,
    };
    persistUser(nextUser);
    setUser(nextUser);
    return "success";
  };

  const updateProfile: AuthContextValue["updateProfile"] = (details) => {
    setUser((current) => {
      if (!current.isLoggedIn) return current;
      const nextUser = { ...current, ...details, username: details.email || current.username };
      persistUser(nextUser);
      const users = readRegisteredUsers();
      try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users.map((entry) =>
          entry.email.toLowerCase() === current.email.toLowerCase()
            ? { ...entry, fullName: details.fullName, email: details.email, address: details.address }
            : entry,
        )));
      } catch {
        // პროფილი მიმდინარე state-ში განახლდება, თუნდაც საცავში ჩაწერა ვერ მოხერხდეს.
      }
      return nextUser;
    });
  };

  const logout = (): void => {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch {
      // გვერდის მიმდინარე მდგომარეობას მაინც guest-ად ვცვლით.
    }
    setUser(guestUser);
  };

  return <AuthContext.Provider value={{ user, login, register, updateProfile, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}
