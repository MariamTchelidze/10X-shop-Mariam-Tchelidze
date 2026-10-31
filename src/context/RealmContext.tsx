import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export interface Realm {
  id: string;
  name: string;
  region: string;
  currencyName: string;
  currencySymbol: string;
  multiplier: number;
  marker: string;
}

export const REALMS: Realm[] = [
  { id: "shire", name: "The Shire", region: "The Shire", currencyName: "Copper Pennies", currencySymbol: "§", multiplier: 1, marker: "🟢" },
  { id: "rivendell", name: "Rivendell", region: "Imladris", currencyName: "Elven Silver", currencySymbol: "₥", multiplier: 1.2, marker: "⚪" },
  { id: "gondor", name: "Gondor", region: "Minas Tirith", currencyName: "Castellar Gold", currencySymbol: "🪙", multiplier: 1.5, marker: "👑" },
  { id: "rohan", name: "Rohan", region: "Edoras", currencyName: "Mark Silver", currencySymbol: "₠", multiplier: 1.1, marker: "🐎" },
  { id: "mordor", name: "Mordor", region: "Barad-dûr", currencyName: "Obsidian Shards", currencySymbol: "♦", multiplier: 2, marker: "🔥" },
];

interface RealmContextValue {
  realm: Realm;
  setRealm: (realmId: string) => void;
  formatCurrency: (amount: number) => string;
}

const REALM_KEY = "middle-market-realm";
const DEFAULT_REALM = REALMS[0];
const RealmContext = createContext<RealmContextValue | undefined>(undefined);

function getInitialRealm(): Realm {
  try {
    const storedValue: unknown = JSON.parse(localStorage.getItem(REALM_KEY) ?? "null");
    if (typeof storedValue === "object" && storedValue !== null && "id" in storedValue) {
      const realmId = (storedValue as { id: unknown }).id;
      return REALMS.find((entry) => entry.id === realmId) ?? DEFAULT_REALM;
    }
    return DEFAULT_REALM;
  } catch {
    return DEFAULT_REALM;
  }
}

export function RealmProvider({ children }: { children: ReactNode }) {
  const [realm, setCurrentRealm] = useState<Realm>(getInitialRealm);

  const setRealm = useCallback((realmId: string) => {
    const nextRealm = REALMS.find((entry) => entry.id === realmId);
    if (!nextRealm) return;
    setCurrentRealm(nextRealm);
    try {
      localStorage.setItem(REALM_KEY, JSON.stringify({ id: nextRealm.id, multiplier: nextRealm.multiplier }));
    } catch {
      // Changing the realm still works for the current session without browser storage.
    }
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    const convertedAmount = amount * realm.multiplier;
    const formattedAmount = new Intl.NumberFormat("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount);
    return `${realm.currencySymbol} ${formattedAmount}`;
  }, [realm]);

  return <RealmContext.Provider value={{ realm, setRealm, formatCurrency }}>{children}</RealmContext.Provider>;
}

export function useRealm(): RealmContextValue {
  const context = useContext(RealmContext);
  if (context === undefined) throw new Error("useRealm must be used within a RealmProvider.");
  return context;
}
