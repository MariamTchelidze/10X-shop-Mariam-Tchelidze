import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useRealm } from "../../context/RealmContext";
import { readOrders } from "../../utils/orders";

export function OrdersPage() {
  const { user } = useAuth();
  const { formatCurrency } = useRealm();
  const [orders] = useState(() => readOrders().filter((order) => order.username === user.username));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-8 border-b border-market-border pb-5 font-display text-3xl text-market-ink sm:text-4xl">My orders</h1>
      {orders.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-market-muted">You have no orders yet.</p>
          <Link to="/" className="mt-5 inline-flex min-h-11 items-center bg-market-ink px-6 text-xs uppercase tracking-widest text-market-paper">Browse products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <details key={order.id} className="border border-market-border p-4 sm:p-6">
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4">
                <span className="min-w-0"><span className="block text-xs uppercase tracking-widest text-market-muted">Order {order.id}</span><span className="mt-2 block text-sm text-market-ink">{new Date(order.date).toLocaleDateString()}</span></span>
                <span className="rounded-full border border-market-border px-3 py-1 text-[10px] uppercase tracking-widest">{order.status}</span>
                <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
              </summary>
              <ul className="mt-5 divide-y divide-market-border border-t border-market-border">
                {order.items.map((item) => <li key={item.productId} className="flex justify-between gap-4 py-3 text-sm"><span className="min-w-0 text-market-muted">{item.title} × {item.quantity}</span><span className="shrink-0">{formatCurrency(item.price * (1 - item.discountPercentage / 100) * item.quantity)}</span></li>)}
              </ul>
            </details>
          ))}
        </div>
      )}
    </main>
  );
}
