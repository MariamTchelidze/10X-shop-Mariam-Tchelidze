// შეკვეთების ისტორიას localStorage-დან კითხულობს და ახალ შეკვეთას ინახავს.
import type { Order } from "../types/order";

const ORDERS_STORAGE_KEY = "10x-shop-orders";

export function readOrders(): Order[] {
  // localStorage-ის JSON-ს ვკითხულობთ და დაზიანებულ ან სიად არქცეულ მონაცემზე ცარიელს ვაბრუნებთ.
  try {
    const value: unknown = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value as Order[] : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  // ახალი შეკვეთა ისტორიის დასაწყისში ემატება, ამიტომ უახლესი პირველი გამოჩნდება.
  const orders = readOrders();
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...orders]));
}
