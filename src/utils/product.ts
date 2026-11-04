// ფასდაკლებულ ფასს, ხაზის ჯამსა და მარაგის სტატუსს ითვლის.
export function discountedPrice(price: number, discountPercentage: number): number {
  // ფასი პროცენტული ფასდაკლების შემდეგ ორ ათწილადამდე მრგვალდება.
  return Number((price * (1 - discountPercentage / 100)).toFixed(2));
}

export function lineTotal(
  price: number,
  discountPercentage: number,
  quantity: number,
): number {
  // ერთეულის ფასდაკლებული ფასის რაოდენობაზე გამრავლებით ხაზის ჯამს ვიღებთ.
  return discountedPrice(price, discountPercentage) * quantity;
}

export interface StockStatus {
  message: string;
  className: string;
}

export function getStockStatus(stock: number): StockStatus {
  // შეტყობინების ტექსტი და ფერი მარაგის რაოდენობის მიხედვით განისაზღვრება.
  if (stock <= 0) {
    return { message: "Out of Stock · Mithril Alert", className: "text-blood" };
  }
  if (stock <= 5) {
    return { message: `Only ${stock} left in stock!`, className: "text-gold" };
  }
  return { message: "In stock", className: "text-market-muted" };
}
