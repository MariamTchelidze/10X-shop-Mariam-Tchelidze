import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "../types/product";
import type { CartItem, CartVariants } from "../types/cart";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";
import { useInventory } from "./InventoryContext";
import { readCartItems, saveCartItems } from "../utils/cartStorage";
import { lineTotal } from "../utils/product";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity: number, variants?: CartVariants) => boolean;
  removeItem: (productId: number, variants?: CartVariants) => void;
  updateQuantity: (productId: number, quantity: number, variants?: CartVariants) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { addToast } = useToast();
  const { user } = useAuth();
  const { getStock } = useInventory();
  const [items, setItems] = useState<CartItem[]>(() => readCartItems(getStock));

  useEffect(() => {
    saveCartItems(items);
  }, [items]);

  const addItem = (product: Product, quantity: number, variants: CartVariants = {}): boolean => {
    if (!user.isLoggedIn) {
      addToast("for adding the product to the cart please log in first", "info");
      return false;
    }
    const stock = getStock(product.id, product.stock);
    if (!Number.isInteger(quantity) || quantity < 1 || stock < 1) {
      return false;
    }

    const currentItem = items.find((item) => item.productId === product.id && item.size === variants.size && item.color === variants.color);
    const quantityAlreadyInCart = items
      .filter((item) => item.productId === product.id)
      .reduce((total, item) => total + item.quantity, 0);
    const quantityToAdd = Math.min(quantity, stock - quantityAlreadyInCart);
    const nextQuantity = (currentItem?.quantity ?? 0) + quantityToAdd;

    if (quantityToAdd < 1) {
      return false;
    }

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

    setItems((currentItems) => {
      if (currentItem) {
        return currentItems.map((item) =>
          item.productId === product.id && item.size === variants.size && item.color === variants.color ? cartItem : item,
        );
      }

      return [...currentItems, cartItem];
    });

    addToast("ADDED TO BAG", "success");

    return true;
  };

  const removeItem = (productId: number, variants: CartVariants = {}): void => {
    if (!items.some((item) => item.productId === productId && item.size === variants.size && item.color === variants.color)) {
      return;
    }
    setItems((currentItems) =>
      currentItems.filter((item) => !(item.productId === productId && item.size === variants.size && item.color === variants.color)),
    );
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
    const maxQuantity = Math.max(1, stock - quantityInOtherVariants);

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId && item.size === variants.size && item.color === variants.color
          ? { ...item, stock, quantity: Math.min(quantity, maxQuantity) }
          : item,
      ),
    );
  };

  const clearCart = (): void => {
    if (items.length === 0) {
      return;
    }
    setItems([]);
    addToast("CART CLEARED", "info");
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + lineTotal(item.price, item.discountPercentage, item.quantity),
    0,
  );
  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
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
