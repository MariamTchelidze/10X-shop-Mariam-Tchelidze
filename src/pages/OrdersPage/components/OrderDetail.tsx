// ერთი შეკვეთის ნივთებს, მისამართს, სტატუსის გზასა და ხელახალ შეკვეთას აჩვენებს.
import { Link } from "react-router-dom";
import type { Order, OrderStatus } from "../../../types/order";
import { formatDate } from "../../../utils/formatters";
import { lineTotal } from "../../../utils/product";

interface OrderDetailProps {
  order: Order;
  status: OrderStatus;
  formatCurrency: (amount: number) => string;
  onReorder: () => void;
}

const statusSteps: OrderStatus[] = ["Processing", "Shipped", "Delivered"];

export function OrderDetail({ order, status, formatCurrency, onReorder }: OrderDetailProps) {
  const activeStep = statusSteps.indexOf(status);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <Link to="/orders" className="mb-6 inline-flex min-h-10 items-center text-xs uppercase tracking-widest text-market-muted underline underline-offset-4">← My orders</Link>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-market-border pb-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-market-muted">Order reference</p>
          <h1 className="mt-2 break-all font-display text-2xl text-market-ink sm:text-3xl">#{order.id}</h1>
        </div>
        <p className="text-sm text-market-muted">Placed {formatDate(order.date)}</p>
      </header>

      <ol aria-label="Order status" className="mb-8 grid grid-cols-3 border-y border-market-border py-5">
        {statusSteps.map((step, index) => (
          <li key={step} className={`text-center text-[9px] uppercase tracking-[0.08em] sm:text-xs sm:tracking-widest ${index <= activeStep ? "text-forest" : "text-market-muted"}`}>
            <span aria-hidden="true" className="mb-2 block text-lg">{index <= activeStep ? "✓" : "○"}</span>
            {step}
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section aria-labelledby="order-items-title">
          <h2 id="order-items-title" className="mb-4 font-display text-xl text-market-ink">Items in this order</h2>
          <ul className="divide-y divide-market-border border-y border-market-border">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`} className="flex min-w-0 flex-wrap justify-between gap-3 py-4 text-sm">
                <span className="min-w-0 text-market-muted">{item.title} × {item.quantity}</span>
                <span className="shrink-0 text-market-ink">{formatCurrency(lineTotal(item.price, item.discountPercentage, item.quantity))}</span>
              </li>
            ))}
          </ul>
          {order.shippingAddress && (
            <address className="mt-6 text-sm not-italic leading-6 text-market-muted">
              <span className="mb-1 block text-[10px] uppercase tracking-widest text-market-ink">Delivery address</span>
              {order.shippingAddress.fullName}<br />{order.shippingAddress.address}<br />{order.shippingAddress.city}<br />{order.shippingAddress.email}
            </address>
          )}
          {order.paymentMethod && <p className="mt-5 text-xs text-market-muted">{order.paymentMethod}</p>}
        </section>

        <aside className="h-fit border border-market-border p-5">
          <h2 className="font-display text-xl text-market-ink">Order total</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-3 text-market-muted"><dt>Subtotal</dt><dd>{formatCurrency(order.subtotal ?? order.total)}</dd></div>
            {(order.discount ?? 0) > 0 && <div className="flex justify-between gap-3 text-market-muted"><dt>Discount</dt><dd>−{formatCurrency(order.discount ?? 0)}</dd></div>}
            <div className="flex justify-between gap-3 border-t border-market-border pt-3 font-medium text-market-ink"><dt>Total</dt><dd>{formatCurrency(order.total)}</dd></div>
          </dl>
          <button type="button" onClick={onReorder} className="mt-6 min-h-12 w-full bg-market-ink px-4 text-xs uppercase tracking-widest text-market-paper transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Reorder</button>
        </aside>
      </div>
    </main>
  );
}
