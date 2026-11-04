// სურვილების სიას ინახავს და მის ცვლილებებზე შეტყობინებებს აჩვენებს.
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Product } from "../types/product";
import { useToast } from "./ToastContext";

const WISHLIST_KEY = "middle-market-wishlist";

interface WishlistContextValue {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === "number" && typeof record.title === "string" &&
    typeof record.price === "number" && typeof record.category === "string" &&
    typeof record.thumbnail === "string";
}

function readWishlist(): Product[] {
  // შენახული მონაცემებიდან მხოლოდ ვალიდურ პროდუქტის ჩანაწერებს ვტოვებთ.
  try {
    const value: unknown = JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter(isProduct) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(readWishlist);
  const { addToast } = useToast();

  // ერთსა და იმავე პროდუქტს მეორედ არ ვამატებთ და ცვლილებას საცავში ვინახავთ.
  const addToWishlist = useCallback((product: Product) => {
    if (items.some((item) => item.id === product.id)) return;
    const next = [...items, product];
    setItems(next);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    addToast("ADDED TO WISHLIST", "success");
  }, [addToast, items]);

  const removeFromWishlist = useCallback((productId: number) => {
    const next = items.filter((product) => product.id !== productId);
    if (next.length === items.length) return;
    setItems(next);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    addToast("REMOVED FROM WISHLIST", "info");
  }, [addToast, items]);

  const isInWishlist = useCallback((productId: number) => items.some((item) => item.id === productId), [items]);

  const toggleWishlist = useCallback((product: Product) => {
    if (items.some((item) => item.id === product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  }, [addToWishlist, items, removeFromWishlist]);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (context === undefined) throw new Error("useWishlist must be used within a WishlistProvider.");
  return context;
}
