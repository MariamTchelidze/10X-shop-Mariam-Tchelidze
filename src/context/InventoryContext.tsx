import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { CartItem } from "../types/cart";

const INVENTORY_KEY = "middle-market-inventory";
type StockByProductId = Record<string, number>;

interface InventoryContextValue {
  getStock: (productId: number, fallbackStock: number) => number;
  decrementStock: (items: readonly CartItem[]) => void;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

function readSavedInventory(): StockByProductId {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(INVENTORY_KEY) ?? "{}");
    if (typeof saved !== "object" || saved === null || Array.isArray(saved)) return {};

    return Object.fromEntries(
      Object.entries(saved).filter(
        ([, stock]) => typeof stock === "number" && Number.isInteger(stock) && stock >= 0,
      ),
    ) as StockByProductId;
  } catch {
    return {};
  }
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [stockByProductId, setStockByProductId] = useState<StockByProductId>(readSavedInventory);

  const getStock = useCallback(
    (productId: number, fallbackStock: number): number =>
      stockByProductId[String(productId)] ?? fallbackStock,
    [stockByProductId],
  );

  const decrementStock = useCallback((items: readonly CartItem[]) => {
    if (items.length === 0) return;

    const purchases = new Map<number, { quantity: number; originalStock: number }>();
    for (const item of items) {
      const current = purchases.get(item.productId);
      purchases.set(item.productId, {
        quantity: (current?.quantity ?? 0) + item.quantity,
        originalStock: current?.originalStock ?? item.stock,
      });
    }

    setStockByProductId((current) => {
      const next = { ...current };
      for (const [productId, purchase] of purchases) {
        const key = String(productId);
        const availableStock = current[key] ?? purchase.originalStock;
        next[key] = Math.max(0, availableStock - purchase.quantity);
      }
      try {
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(next));
      } catch {
        // The in-memory inventory still updates if browser storage is unavailable.
      }
      return next;
    });
  }, []);

  return (
    <InventoryContext.Provider value={{ getStock, decrementStock }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): InventoryContextValue {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider.");
  }
  return context;
}
