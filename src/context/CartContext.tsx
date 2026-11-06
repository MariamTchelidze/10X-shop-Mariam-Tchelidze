// კალათის პროდუქტებს, რაოდენობებსა და ჯამურ ფასს მართავს.
import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { Product } from "../types/product";
import type { CartItem, CartState, CartVariants } from "../types/cart";
import { useToast } from "./ToastContext";
import { useInventory } from "./InventoryContext";
import { readCartState, saveCartState } from "../utils/cartStorage";
import { CartManager } from "../utils/CartManager";
import { assertNever } from "../utils/assertNever";

// კალათის reducer-ში დასაშვებ ყველა ცვლილებას discriminated union-ით აღვწერთ.
export type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity: number; stock: number; variants: CartVariants }
  | { type: "REMOVE_ITEM"; productId: number; variants: CartVariants }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number; stock: number; variants: CartVariants }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_PROMO"; code: string }
  | { type: "REMOVE_PROMO" };

// ახალი CartManager-ის გამოყენებით reducer-ის ძველ state-ს უცვლელად ვინარჩუნებთ.
export function cartReducer(state: CartState, action: CartAction): CartState {
  const manager = new CartManager(state);

  switch (action.type) {
    case "ADD_ITEM":
      return manager.addItem(action.product, action.quantity, action.stock, action.variants).success
        ? manager.state
        : state;
    case "REMOVE_ITEM":
      return manager.removeItem(action.productId, action.variants) ? manager.state : state;
    case "UPDATE_QUANTITY":
      return manager.updateQuantity(action.productId, action.quantity, action.stock, action.variants).success
        ? manager.state
        : state;
    case "CLEAR_CART":
      return manager.clearCart() ? manager.state : state;
    case "APPLY_PROMO":
      return manager.applyPromoCode(action.code) ? manager.state : state;
    case "REMOVE_PROMO":
      return manager.removePromoCode() ? manager.state : state;
    default:
      return assertNever(action);
  }
}

interface CartContextValue {
  items: CartItem[];
  promoCode: string | null;
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  addItem: (product: Product, quantity: number, variants?: CartVariants) => boolean;
  removeItem: (productId: number, variants?: CartVariants) => void;
  updateQuantity: (productId: number, quantity: number, variants?: CartVariants) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { addToast } = useToast();
  const { getStock } = useInventory();
  const [cart, dispatch] = useReducer(cartReducer, getStock, readCartState);
  const cartManager = useMemo(() => new CartManager(cart), [cart]);
  const { items, promoCode } = cart;

  useEffect(() => {
    // კალათის ყოველი ცვლილება localStorage-თან სინქრონდება.
    saveCartState(cart);
  }, [cart]);

  const addItem = (product: Product, quantity: number, variants: CartVariants = {}): boolean => {
    // დანართის flow-ში სტუმარსაც შეუძლია კალათის შევსება; Login საჭიროა Checkout-ზე.
    const stock = getStock(product.id, product.stock);
    const manager = new CartManager(cart);
    const result = manager.addItem(product, quantity, stock, variants);
    if (!result.success) {
      if (result.reason === "stock-limit") {
        if (import.meta.env.DEV) console.log("[DEBUG 10X SHOP]: Cart add blocked by available stock.");
        addToast("Cannot add more than available stock.", "error");
      }
      return false;
    }
    dispatch({ type: "ADD_ITEM", product, quantity, stock, variants });
    if (import.meta.env.DEV) console.log("[DEBUG 10X SHOP]: Item added to cart.", { productId: product.id, quantity });
    if (result.limited) addToast("Cannot add more than available stock.", "error");
    addToast("Added to cart.", "success");

    return true;
  };

  const removeItem = (productId: number, variants: CartVariants = {}): void => {
    const manager = new CartManager(cart);
    if (!manager.removeItem(productId, variants)) return;
    dispatch({ type: "REMOVE_ITEM", productId, variants });
    if (import.meta.env.DEV) console.log("[DEBUG 10X SHOP]: Item removed from cart.", { productId });
    addToast("ITEM REMOVED", "info");
  };

  const updateQuantity = (productId: number, quantity: number, variants: CartVariants = {}): void => {
    const currentItem = items.find((item) =>
      item.productId === productId && item.size === variants.size && item.color === variants.color,
    );
    if (!currentItem) return;
    const stock = getStock(productId, currentItem.stock);
    const manager = new CartManager(cart);
    const result = manager.updateQuantity(productId, quantity, stock, variants);
    if (!result.success) {
      if (result.reason === "stock-limit") {
        addToast("Cannot add more than available stock.", "error");
      }
      return;
    }
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity, stock, variants });
    if (import.meta.env.DEV) console.log("[DEBUG 10X SHOP]: Cart quantity updated.", { productId, quantity });
    if (result.limited) addToast("Cannot add more than available stock.", "error");
  };

  const applyPromoCode = (code: string): boolean => {
    const manager = new CartManager(cart);
    if (!manager.applyPromoCode(code)) return false;
    dispatch({ type: "APPLY_PROMO", code });
    if (import.meta.env.DEV) console.log("[DEBUG 10X SHOP]: Promo code accepted.");
    return true;
  };

  const removePromoCode = (): void => {
    const manager = new CartManager(cart);
    if (manager.removePromoCode()) dispatch({ type: "REMOVE_PROMO" });
  };

  const clearCart = (): void => {
    const hadItems = items.length > 0;
    const manager = new CartManager(cart);
    if (!manager.clearCart()) return;
    dispatch({ type: "CLEAR_CART" });
    if (import.meta.env.DEV) console.log("[DEBUG 10X SHOP]: Cart cleared.");
    if (hadItems) addToast("CART CLEARED", "info");
  };

  // Header-ის badge და შეჯამება კალათის მიმდინარე მონაცემებიდან გამოითვლება.
  const itemCount = cartManager.itemCount;
  const { subtotal, discount, total } = cartManager.totals;
  const value: CartContextValue = {
    items,
    promoCode,
    itemCount,
    subtotal,
    discount,
    total,
    addItem,
    removeItem,
    updateQuantity,
    applyPromoCode,
    removePromoCode,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
