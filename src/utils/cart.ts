import type { CartItem } from "../types/cart";
import { lineTotal } from "./product";

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
}

// Promo code-ებს ერთ ადგილას ამოწმებს, რომ Cart და Checkout ერთსა და იმავე წესს იყენებდეს.
export function normalizePromoCode(code: string): "10X10" | null {
  return code.trim().toUpperCase() === "10X10" ? "10X10" : null;
}

// კალათის ჯამებს ფასდაკლებული ერთეულის ფასით ითვლის.
export function calculateCartTotals(items: readonly CartItem[], promoCode: string | null): CartTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + lineTotal(item.price, item.discountPercentage, item.quantity),
    0,
  );
  const discount = promoCode === "10X10" ? Number((subtotal * 0.1).toFixed(2)) : 0;

  return { subtotal, discount, total: Math.max(0, subtotal - discount) };
}
