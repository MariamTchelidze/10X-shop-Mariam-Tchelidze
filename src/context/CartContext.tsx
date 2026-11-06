// კალათის პროდუქტებს, რაოდენობებსა და ჯამურ ფასს მართავს.
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Product } from "../types/product";
import type { CartItem, CartState, CartVariants } from "../types/cart";
import { useToast } from "./ToastContext";
import { useInventory } from "./InventoryContext";
import { readCartState, saveCartState } from "../utils/cartStorage";
import { CartManager } from "../utils/CartManager";

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
  const [cart, setCart] = useState<CartState>(() => readCartState(getStock));
  const cartManagerRef = useRef<CartManager | null>(null);
  if (cartManagerRef.current === null) {
    cartManagerRef.current = new CartManager(cart);
  }
  const cartManager = cartManagerRef.current;
  const { items, promoCode } = cart;

  useEffect(() => {
    // კალათის ყოველი ცვლილება localStorage-თან სინქრონდება.
    saveCartState(cart);
  }, [cart]);

  const addItem = (product: Product, quantity: number, variants: CartVariants = {}): boolean => {
    // დანართის flow-ში სტუმარსაც შეუძლია კალათის შევსება; Login საჭიროა Checkout-ზე.
    const stock = getStock(product.id, product.stock);
    const result = cartManager.addItem(product, quantity, stock, variants);
    if (!result.success) {
      if (result.reason === "stock-limit") {
        addToast("Cannot add more than available stock.", "error");
      }
      return false;
    }
    setCart(cartManager.state);
    if (result.limited) addToast("Cannot add more than available stock.", "error");
    addToast("Added to cart.", "success");

    return true;
  };

  const removeItem = (productId: number, variants: CartVariants = {}): void => {
    if (!cartManager.removeItem(productId, variants)) return;
    setCart(cartManager.state);
    addToast("ITEM REMOVED", "info");
  };

  const updateQuantity = (productId: number, quantity: number, variants: CartVariants = {}): void => {
    const currentItem = items.find((item) =>
      item.productId === productId && item.size === variants.size && item.color === variants.color,
    );
    if (!currentItem) return;
    const stock = getStock(productId, currentItem.stock);
    const result = cartManager.updateQuantity(productId, quantity, stock, variants);
    if (!result.success) {
      if (result.reason === "stock-limit") {
        addToast("Cannot add more than available stock.", "error");
      }
      return;
    }
    setCart(cartManager.state);
    if (result.limited) addToast("Cannot add more than available stock.", "error");
  };

  const applyPromoCode = (code: string): boolean => {
    if (!cartManager.applyPromoCode(code)) return false;
    setCart(cartManager.state);
    return true;
  };

  const removePromoCode = (): void => {
    if (cartManager.removePromoCode()) setCart(cartManager.state);
  };

  const clearCart = (): void => {
    const hadItems = items.length > 0;
    if (!cartManager.clearCart()) return;
    setCart(cartManager.state);
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
