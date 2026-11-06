import type { AuthUser } from "./user";

export type LoginResult =
  | { status: "success"; user: AuthUser }
  | {
      status: "error";
      errorType: "INVALID_CREDENTIALS" | "GENERAL";
      message: string;
    };

export type RegisterResult =
  | { status: "success"; user: AuthUser }
  | {
      status: "error";
      errorType: "EMAIL_EXISTS" | "STORAGE_ERROR" | "GENERAL";
      message: string;
    };
