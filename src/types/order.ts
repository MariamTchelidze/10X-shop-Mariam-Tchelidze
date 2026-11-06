// შეკვეთისა და მიწოდების მისამართის მონაცემთა სტრუქტურას განსაზღვრავს.
import type { CartItem } from "./cart";

export interface ShippingAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  username: string;
  date: string;
  items: CartItem[];
  total: number;
  status?: OrderStatus | "Placed";
  subtotal?: number;
  discount?: number;
  promoCode?: string | null;
  shipping?: number;
  taxes?: number;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered";
