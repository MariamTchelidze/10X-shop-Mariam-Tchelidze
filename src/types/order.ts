import type { CartItem } from "./cart";

export interface Order {
  id: string;
  username: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Placed";
  subtotal?: number;
  shipping?: number;
  taxes?: number;
  shippingAddress?: {
    fullName: string;
    email: string;
    address: string;
    city: string;
  };
  paymentMethod?: string;
}
