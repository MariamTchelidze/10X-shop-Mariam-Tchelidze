export interface CartItem {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  stock: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CartVariants {
  size?: string;
  color?: string;
}
