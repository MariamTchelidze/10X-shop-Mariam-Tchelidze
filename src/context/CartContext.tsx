// კალათის პროდუქტებს, რაოდენობებსა და ჯამურ ფასს მართავს.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "../types/product";
import type { CartItem, CartState, CartVariants } from "../types/cart";
import { useToast } from "./ToastContext";
import { useInventory } from "./InventoryContext";
import { readCartState, saveCartState } from "../utils/cartStorage";
import { calculateCartTotals, normalizePromoCode } from "../utils/cart";

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
  const { items, promoCode } = cart;

  useEffect(() => {
    // კალათის ყოველი ცვლილება localStorage-თან სინქრონდება.
    saveCartState(cart);
  }, [cart]);

  const addItem = (product: Product, quantity: number, variants: CartVariants = {}): boolean => {
    // დანართის flow-ში სტუმარსაც შეუძლია კალათის შევსება; Login საჭიროა Checkout-ზე.
    const stock = getStock(product.id, product.stock);
    if (!Number.isInteger(quantity) || quantity < 1 || stock < 1) {
      return false;
    }

    const currentItem = items.find((item) => item.productId === product.id && item.size === variants.size && item.color === variants.color);
    const quantityAlreadyInCart = items
      .filter((item) => item.productId === product.id)
      .reduce((total, item) => total + item.quantity, 0);
    const availableStock = Math.max(0, stock - quantityAlreadyInCart);
    if (quantity > availableStock) {
      addToast(availableStock > 0 ? `Only ${availableStock} left!` : "No more stock is available.", "info");
      return false;
    }
    const nextQuantity = (currentItem?.quantity ?? 0) + quantity;

    const cartItem: CartItem = {
      productId: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock,
      quantity: nextQuantity,
      ...(variants.size ? { size: variants.size } : {}),
      ...(variants.color ? { color: variants.color } : {}),
    };

    setCart((currentCart) => {
      const currentItems = currentCart.items;
      if (currentItem) {
        return { ...currentCart, items: currentItems.map((item) =>
          item.productId === product.id && item.size === variants.size && item.color === variants.color ? cartItem : item,
        ) };
      }

      return { ...currentCart, items: [...currentItems, cartItem] };
    });

    addToast("ADDED TO BAG", "success");

    return true;
  };

  const removeItem = (productId: number, variants: CartVariants = {}): void => {
    if (!items.some((item) => item.productId === productId && item.size === variants.size && item.color === variants.color)) {
      return;
    }
    setCart((current) => ({
      ...current,
      items: current.items.filter((item) => !(item.productId === productId && item.size === variants.size && item.color === variants.color)),
    }));
    addToast("ITEM REMOVED", "info");
  };

  const updateQuantity = (productId: number, quantity: number, variants: CartVariants = {}): void => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }

    const currentItem = items.find((item) =>
      item.productId === productId && item.size === variants.size && item.color === variants.color,
    );
    if (!currentItem) return;
    const stock = getStock(productId, currentItem.stock);
    const quantityInOtherVariants = items
      .filter((item) => item.productId === productId && !(item.size === variants.size && item.color === variants.color))
      .reduce((total, item) => total + item.quantity, 0);
    // სხვა ზომისა თუ ფერის რაოდენობაც იმავე პროდუქტის საერთო მარაგში ითვლება.
    const maxQuantity = Math.max(0, stock - quantityInOtherVariants);
    if (quantity > maxQuantity) {
      addToast(maxQuantity > 0 ? `Only ${maxQuantity} left!` : "No more stock is available.", "info");
      return;
    }

    setCart((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.productId === productId && item.size === variants.size && item.color === variants.color
          ? { ...item, stock, quantity }
          : item,
      ),
    }));
  };

  const applyPromoCode = (code: string): boolean => {
    const normalizedCode = normalizePromoCode(code);
    if (!normalizedCode) return false;
    setCart((current) => ({ ...current, promoCode: normalizedCode }));
    return true;
  };

  const removePromoCode = (): void => {
    setCart((current) => ({ ...current, promoCode: null }));
  };

  const clearCart = (): void => {
    if (items.length === 0 && promoCode === null) return;
    const hadItems = items.length > 0;
    setCart({ items: [], promoCode: null });
    if (hadItems) addToast("CART CLEARED", "info");
  };

  // Header-ის badge და შეჯამება კალათის მიმდინარე მონაცემებიდან გამოითვლება.
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const { subtotal, discount, total } = calculateCartTotals(items, promoCode);
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
