// შეკვეთის პროდუქტებსა და გადასახდელ ჯამს აჯამებს.
import type { CartItem } from "../../../types/cart";
import { lineTotal } from "../../../utils/product";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string | null;
  formatCurrency: (amount: number) => string;
}

export function OrderSummary({ items, subtotal, discount, total, promoCode, formatCurrency }: OrderSummaryProps) {
  // თითოეული ხაზის ფასდაკლებული ჯამი და მთელი კალათის ჯამი ცალ-ცალკე ჩანს.
  return (
    <aside className="h-fit border border-market-border p-5 sm:p-6">
      <h2 className="font-display text-2xl text-market-ink">Order summary</h2>
      <ul className="mt-5 space-y-3 border-b border-market-border pb-5">
        {items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-4 text-sm">
            <span className="text-market-muted">{item.title} × {item.quantity}</span>
            <span className="shrink-0 text-market-ink">
              {formatCurrency(lineTotal(item.price, item.discountPercentage, item.quantity))}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between gap-4 text-sm text-market-muted">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      {promoCode && (
        <div className="mt-3 flex justify-between gap-4 text-sm text-market-muted">
          <span>Discount ({promoCode} −10%)</span>
          <span>−{formatCurrency(discount)}</span>
        </div>
      )}
      <div className="mt-3 flex justify-between gap-4 text-sm text-market-muted">
        <span>Shipping</span>
        <span>Complimentary</span>
      </div>
      <div className="mt-4 flex justify-between gap-4 border-t border-market-border pt-4 text-sm font-medium text-market-ink">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </aside>
  );
}
