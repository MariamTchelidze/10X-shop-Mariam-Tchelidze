// შეკვეთების ისტორიას localStorage-დან კითხულობს და ახალ შეკვეთას ინახავს.
import type { Order } from "../types/order";
import type { CartItem } from "../types/cart";

const ORDERS_STORAGE_KEY = "10x-shop-orders";

export function readOrders(): Order[] {
  // localStorage-ის JSON-ს ვკითხულობთ და ყოველი შეკვეთის საჭირო ველებს ვამოწმებთ.
  try {
    const value: unknown = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter(isOrder) : [];
  } catch {
    return [];
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  return "productId" in value && typeof value.productId === "number" && Number.isInteger(value.productId) && value.productId > 0 &&
    "title" in value && typeof value.title === "string" &&
    "thumbnail" in value && typeof value.thumbnail === "string" &&
    "price" in value && typeof value.price === "number" && Number.isFinite(value.price) && value.price >= 0 &&
    "discountPercentage" in value && typeof value.discountPercentage === "number" && Number.isFinite(value.discountPercentage) &&
    "stock" in value && typeof value.stock === "number" && Number.isInteger(value.stock) &&
    "quantity" in value && typeof value.quantity === "number" && Number.isInteger(value.quantity) && value.quantity > 0;
}

export function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;
  if (
    !("id" in value) || typeof value.id !== "string" ||
    !("username" in value) || typeof value.username !== "string" ||
    !("date" in value) || typeof value.date !== "string" || !Number.isFinite(Date.parse(value.date)) ||
    !("items" in value) || !Array.isArray(value.items) || !value.items.every(isCartItem) ||
    !("total" in value) || typeof value.total !== "number" || !Number.isFinite(value.total)
  ) return false;

  const record = value as Record<string, unknown>;
  if ("status" in record && record.status !== undefined &&
      record.status !== "Placed" && record.status !== "Processing" &&
      record.status !== "Shipped" && record.status !== "Delivered") return false;
  for (const field of ["subtotal", "discount", "shipping", "taxes"] as const) {
    if (field in record && record[field] !== undefined &&
        (typeof record[field] !== "number" || !Number.isFinite(record[field]) || record[field] < 0)) return false;
  }
  if ("promoCode" in record && record.promoCode !== null && record.promoCode !== undefined && record.promoCode !== "10X10") return false;
  if ("shippingAddress" in record && record.shippingAddress !== undefined) {
    const address = record.shippingAddress;
    if (typeof address !== "object" || address === null ||
        !("fullName" in address) || typeof address.fullName !== "string" ||
        !("email" in address) || typeof address.email !== "string" ||
        !("address" in address) || typeof address.address !== "string" ||
        !("city" in address) || typeof address.city !== "string") return false;
  }
  return true;
}

export function saveOrder(order: Order): boolean {
  // ახალი შეკვეთა ისტორიის დასაწყისში ემატება; საცავის შეცდომა false-ით ბრუნდება.
  try {
    const orders = readOrders();
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...orders]));
    return true;
  } catch {
    return false;
  }
}

export function clearOrders(): boolean {
  try {
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function createOrderId(): string {
  // ლოკალურ ისტორიაში არსებულ უდიდეს ნომერს ერთს ვუმატებთ.
  const lastSequence = readOrders().reduce((largest, order) => {
    const match = /^10X-(\d{5})$/.exec(order.id);
    return match ? Math.max(largest, Number(match[1])) : largest;
  }, 0);
  return `10X-${String(lastSequence + 1).padStart(5, "0")}`;
}

export function getOrderStatus(order: Order, now: number = Date.now()): "Processing" | "Shipped" | "Delivered" {
  // სტატუსი შეკვეთის თარიღიდან გამოითვლება და შეკვეთის ჩანაწერს არ ცვლის.
  const elapsedMs = Math.max(0, now - Date.parse(order.date));
  if (elapsedMs < 60_000) return "Processing";
  if (elapsedMs < 180_000) return "Shipped";
  return "Delivered";
}
