// დასრულებული შეკვეთის დადასტურებასა და შეჯამებას აჩვენებს.
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useRealm } from "../../context/RealmContext";
import type { Order } from "../../types/order";
import { isOrder, readOrders } from "../../utils/orders";
import { discountedPrice } from "../../utils/product";
import { formatDate } from "../../utils/formatters";

interface OrderSuccessLocationState {
  order?: Order;
}

export function OrderSuccessPage() {
  const location = useLocation();
  const routeState = location.state as OrderSuccessLocationState | null;
  const routeOrder: unknown = routeState?.order;
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const { formatCurrency } = useRealm();
  // ჯერ მარშრუტის მდგომარეობას ვიყენებთ; გვერდის განახლებისას ბოლო შენახულ შეკვეთას ვეძებთ.
  const [order] = useState<Order | null>(() =>
    (isOrder(routeOrder) && routeOrder.username === user.username ? routeOrder : undefined) ??
      readOrders().find((savedOrder) => savedOrder.username === user.username) ?? null,
  );

  const cartMatchesOrder = Boolean(order) && items.length === (order?.items.length ?? -1) &&
    (order?.items.every((orderedItem) => items.some((cartItem) =>
      cartItem.productId === orderedItem.productId && cartItem.quantity === orderedItem.quantity &&
      cartItem.size === orderedItem.size && cartItem.color === orderedItem.color,
    )) ?? false);

  useEffect(() => {
    // მხოლოდ იმ კალათას ვასუფთავებთ, რომლის ნივთებიც ნაჩვენებ შეკვეთას ემთხვევა.
    if (cartMatchesOrder) clearCart();
  }, [cartMatchesOrder, clearCart]);

  if (!order) {
    return (
      <main className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold">The trail is quiet</p>
        <h1 className="mt-4 font-display text-3xl text-market-ink">No order found</h1>
        <p className="mt-3 text-sm text-market-muted">There is no recent order to display for this account.</p>
        <Link to="/" className="mt-7 inline-flex min-h-12 items-center bg-market-ink px-7 text-xs uppercase tracking-widest text-market-paper">Continue shopping</Link>
      </main>
    );
  }

  // ძველი შეკვეთების ჩანაწერებისთვის არასავალდებულო ჯამებს ნაგულისხმევ მნიშვნელობებს ვაძლევთ.
  const subtotal = order.subtotal ?? order.total;
  const discount = order.discount ?? 0;
  const shipping = order.shipping ?? 0;
  const taxes = order.taxes ?? 0;
  const address = order.shippingAddress;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="relative overflow-hidden border border-gold/50 bg-market-surface px-5 py-10 text-center sm:px-10 sm:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-gold/25 sm:h-48 sm:w-48" />
        <p className="relative text-[10px] uppercase tracking-[0.2em] text-earth">Your treasure is secured</p>
        <h1 className="relative mx-auto mt-4 max-w-3xl font-display text-3xl leading-tight text-market-ink sm:text-5xl">Your Order Has Been Dispatched to Middle-earth</h1>
        <p className="relative mt-4 text-sm leading-6 text-market-muted">Thank you. Your order has been placed and is ready for its journey.</p>
        <p className="relative mt-6 font-display text-sm tracking-[0.12em] text-gold">REFERENCE · #{order.id}</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
        <section aria-labelledby="items-heading">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-market-border pb-4">
            <h2 id="items-heading" className="font-display text-2xl text-market-ink">Treasures reserved</h2>
            <p className="text-xs text-market-muted">Placed {formatDate(order.date)}</p>
          </div>
          <ul className="divide-y divide-market-border">
            {order.items.map((item) => {
              const unitPrice = discountedPrice(item.price, item.discountPercentage);
              return (
                <li key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`} className="flex gap-4 py-5 sm:gap-6">
                  <img src={item.thumbnail} alt={item.title} loading="lazy" width={180} height={220} className="aspect-[3/4] w-20 shrink-0 bg-market-surface object-cover sm:w-24" />
                  <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0"><h3 className="font-display text-sm text-market-ink">{item.title}</h3><p className="mt-2 text-xs text-market-muted">Quantity: {item.quantity}</p>{(item.size || item.color) && <p className="mt-1 text-xs text-market-muted">{[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" · ")}</p>}</div>
                    <p className="shrink-0 text-sm text-market-ink">{formatCurrency(unitPrice * item.quantity)}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <section className="mt-6 border-t border-market-border pt-6" aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="font-display text-xl text-market-ink">The road ahead</h2>
            <p className="mt-3 text-sm text-market-muted">Carried by an Elven courier · 3–5 Realm Days</p>
          </section>

          <div className="mt-6 grid gap-5 border-t border-market-border pt-6 sm:grid-cols-2">
            <section aria-labelledby="shipping-heading">
              <h2 id="shipping-heading" className="text-[10px] uppercase tracking-[0.16em] text-gold">Shipping address</h2>
              {address ? <address className="mt-3 text-sm not-italic leading-6 text-market-muted">{address.fullName}<br />{address.address}<br />{address.city}<br />{address.email}</address> : <p className="mt-3 text-sm text-market-muted">Address details are unavailable.</p>}
            </section>
            <section aria-labelledby="payment-heading">
              <h2 id="payment-heading" className="text-[10px] uppercase tracking-[0.16em] text-gold">Payment</h2>
              <p className="mt-3 text-sm leading-6 text-market-muted">{order.paymentMethod ?? "Demo checkout — no payment collected"}</p>
            </section>
          </div>
        </section>

        <aside className="h-fit border border-market-border bg-market-surface p-5 sm:p-6">
          <h2 className="font-display text-xl text-market-ink">Order total</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between gap-4 text-market-muted"><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
            {order.promoCode && <div className="flex justify-between gap-4 text-market-muted"><dt>Discount ({order.promoCode} −10%)</dt><dd>−{formatCurrency(discount)}</dd></div>}
            <div className="flex justify-between gap-4 text-market-muted"><dt>Shipping</dt><dd>{shipping === 0 ? "Complimentary" : formatCurrency(shipping)}</dd></div>
            <div className="flex justify-between gap-4 text-market-muted"><dt>Taxes</dt><dd>{formatCurrency(taxes)}</dd></div>
            <div className="flex justify-between gap-4 border-t border-market-border pt-4 font-medium text-market-ink"><dt>Total</dt><dd>{formatCurrency(order.total)}</dd></div>
          </dl>
          <p className="mt-4 text-[10px] leading-5 text-market-muted">Demo order only. No payment was collected.</p>
        </aside>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-market-border pt-6 sm:flex-row sm:justify-between">
        <Link to="/" className="inline-flex min-h-12 items-center justify-center bg-market-ink px-7 text-xs uppercase tracking-[0.14em] text-market-paper transition-opacity hover:opacity-80">Continue shopping</Link>
        <Link to="/profile" className="inline-flex min-h-12 items-center justify-center border border-market-border px-7 text-xs uppercase tracking-[0.14em] text-market-ink transition-colors hover:border-gold">View order in profile</Link>
      </div>
    </main>
  );
}
