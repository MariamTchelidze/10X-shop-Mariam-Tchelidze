// კალათის მონაცემებს ამოწმებს, localStorage-დან კითხულობს და ინახავს.
import type { CartItem } from "../types/cart";

const CART_STORAGE_KEY = "lotr_cart";

type GetStock = (productId: number, fallbackStock: number) => number;

function isCartItem(value: unknown): value is CartItem {
  // ადგილობრივ საცავში არსებული ნებისმიერი მონაცემი ვიყენებთ მხოლოდ ველების შემოწმების შემდეგ.
  if (typeof value !== "object" || value === null) return false;
  if (
    !("productId" in value) || !("title" in value) || !("thumbnail" in value) ||
    !("price" in value) || !("discountPercentage" in value) ||
    !("stock" in value) || !("quantity" in value)
  ) {
    return false;
  }

  return (
    typeof value.productId === "number" && Number.isInteger(value.productId) && value.productId > 0 &&
    typeof value.title === "string" &&
    typeof value.thumbnail === "string" &&
    typeof value.price === "number" && Number.isFinite(value.price) && value.price >= 0 &&
    typeof value.discountPercentage === "number" && Number.isFinite(value.discountPercentage) &&
    typeof value.stock === "number" && Number.isInteger(value.stock) && value.stock >= 0 &&
    typeof value.quantity === "number" && Number.isInteger(value.quantity) && value.quantity > 0 &&
    (! ("size" in value) || typeof value.size === "string") &&
    (! ("color" in value) || typeof value.color === "string")
  );
}

export function readCartItems(getStock: GetStock): CartItem[] {
  // აღდგენისას კალათის რაოდენობებს მიმდინარე მარაგთან ვათანხმებთ.
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(saved)) return [];

    const reservedByProduct = new Map<number, number>();
    const restoredItems: CartItem[] = [];

    for (const value of saved) {
      if (!isCartItem(value)) continue;

      const stock = getStock(value.productId, value.stock);
      const alreadyReserved = reservedByProduct.get(value.productId) ?? 0;
      const quantity = Math.min(value.quantity, Math.max(0, stock - alreadyReserved));
      if (quantity < 1) continue;

      reservedByProduct.set(value.productId, alreadyReserved + quantity);
      restoredItems.push({ ...value, stock, quantity });
    }

    return restoredItems;
  } catch {
    return [];
  }
}

export function saveCartItems(items: readonly CartItem[]): void {
  // საცავის შეცდომა მიმდინარე React კალათას არ უნდა უშლიდეს ხელს.
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ბრაუზერის საცავის მიუწვდომლობისას კალათა მიმდინარე სესიაში მაინც მუშაობს.
  }
}
