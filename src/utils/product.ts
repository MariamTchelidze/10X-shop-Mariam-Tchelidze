export function discountedPrice(price: number, discountPercentage: number): number {
  return Number((price * (1 - discountPercentage / 100)).toFixed(2));
}

export function lineTotal(
  price: number,
  discountPercentage: number,
  quantity: number,
): number {
  return discountedPrice(price, discountPercentage) * quantity;
}

export interface StockStatus {
  message: string;
  className: string;
}

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) {
    return { message: "Out of Stock · Mithril Alert", className: "text-blood" };
  }
  if (stock <= 5) {
    return { message: `Only ${stock} left in stock!`, className: "text-gold" };
  }
  return { message: "In stock", className: "text-market-muted" };
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(amount: number): string {
  return currencyFormatter.format(amount);
}
