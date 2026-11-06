import type { CartItem, CartState, CartVariants } from "../types/cart";
import type { Product } from "../types/product";
import { calculateCartTotals, normalizePromoCode, type CartTotals } from "./cart";

export type AddCartItemResult =
  | { success: true; limited: boolean; availableStock: number }
  | { success: false; reason: "invalid-quantity" | "stock-limit"; availableStock: number };

export type UpdateCartQuantityResult =
  | { success: true; limited: boolean; maxQuantity: number }
  | {
      success: false;
      reason: "invalid-quantity" | "item-not-found" | "stock-limit";
      maxQuantity: number;
    };

/** კალათის ცვლილებებს და მათთან დაკავშირებულ გამოთვლებს ერთ ობიექტში აერთიანებს. */
export class CartManager {
  private cartState: CartState;

  constructor(initialState: CartState) {
    this.cartState = {
      items: [...initialState.items],
      promoCode: initialState.promoCode,
    };
  }

  get state(): CartState {
    return this.cartState;
  }

  get itemCount(): number {
    return this.cartState.items.reduce((count, item) => count + item.quantity, 0);
  }

  get totals(): CartTotals {
    return calculateCartTotals(this.cartState.items, this.cartState.promoCode);
  }

  addItem(
    product: Product,
    quantity: number,
    stock: number,
    variants: CartVariants = {},
  ): AddCartItemResult {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return { success: false, reason: "invalid-quantity", availableStock: 0 };
    }

    const quantityAlreadyInCart = this.cartState.items
      .filter((item) => item.productId === product.id)
      .reduce((total, item) => total + item.quantity, 0);
    const availableStock = Math.max(0, stock - quantityAlreadyInCart);
    if (availableStock === 0) {
      return { success: false, reason: "stock-limit", availableStock };
    }
    const acceptedQuantity = Math.min(quantity, availableStock);

    const matchingItem = this.cartState.items.find((item) =>
      item.productId === product.id && item.size === variants.size && item.color === variants.color,
    );
    const nextItem: CartItem = {
      productId: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock,
      quantity: (matchingItem?.quantity ?? 0) + acceptedQuantity,
      ...(variants.size ? { size: variants.size } : {}),
      ...(variants.color ? { color: variants.color } : {}),
    };

    this.cartState = {
      ...this.cartState,
      items: matchingItem
        ? this.cartState.items.map((item) =>
            item.productId === product.id && item.size === variants.size && item.color === variants.color
              ? nextItem
              : item,
          )
        : [...this.cartState.items, nextItem],
    };

    return { success: true, limited: quantity > availableStock, availableStock };
  }

  removeItem(productId: number, variants: CartVariants = {}): boolean {
    const hasItem = this.cartState.items.some((item) =>
      item.productId === productId && item.size === variants.size && item.color === variants.color,
    );
    if (!hasItem) return false;

    this.cartState = {
      ...this.cartState,
      items: this.cartState.items.filter((item) =>
        !(item.productId === productId && item.size === variants.size && item.color === variants.color),
      ),
    };
    return true;
  }

  updateQuantity(
    productId: number,
    quantity: number,
    stock: number,
    variants: CartVariants = {},
  ): UpdateCartQuantityResult {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return { success: false, reason: "invalid-quantity", maxQuantity: 0 };
    }

    const matchesVariants = (item: CartItem): boolean =>
      item.productId === productId && item.size === variants.size && item.color === variants.color;
    const currentItem = this.cartState.items.find(matchesVariants);
    if (!currentItem) {
      return { success: false, reason: "item-not-found", maxQuantity: 0 };
    }

    const quantityInOtherVariants = this.cartState.items
      .filter((item) => item.productId === productId && !matchesVariants(item))
      .reduce((total, item) => total + item.quantity, 0);
    const maxQuantity = Math.max(0, stock - quantityInOtherVariants);
    if (maxQuantity === 0) {
      return { success: false, reason: "stock-limit", maxQuantity };
    }
    const acceptedQuantity = Math.min(quantity, maxQuantity);

    this.cartState = {
      ...this.cartState,
      items: this.cartState.items.map((item) =>
        matchesVariants(item) ? { ...item, stock, quantity: acceptedQuantity } : item,
      ),
    };
    return { success: true, limited: quantity > maxQuantity, maxQuantity };
  }

  applyPromoCode(code: string): boolean {
    const promoCode = normalizePromoCode(code);
    if (!promoCode) return false;
    this.cartState = { ...this.cartState, promoCode };
    return true;
  }

  removePromoCode(): boolean {
    if (this.cartState.promoCode === null) return false;
    this.cartState = { ...this.cartState, promoCode: null };
    return true;
  }

  clearCart(): boolean {
    if (this.cartState.items.length === 0 && this.cartState.promoCode === null) return false;
    this.cartState = { items: [], promoCode: null };
    return true;
  }
}
