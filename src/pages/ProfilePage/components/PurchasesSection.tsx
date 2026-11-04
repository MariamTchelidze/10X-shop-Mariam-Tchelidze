// მომხმარებლის წინა შეკვეთებსა და შეკვეთების ისტორიის ბმულს აჩვენებს.
import { Link } from "react-router";
import type { Order } from "../../../types/order";
import { SectionPanel } from "./SectionPanel";
import { formatDate } from "../../../utils/formatters";

interface PurchasesSectionProps {
  orders: Order[];
  formatCurrency: (amount: number) => string;
}

export function PurchasesSection({ orders, formatCurrency }: PurchasesSectionProps) {
  // შეკვეთების არარსებობისას ცარიელ მდგომარეობას ვაჩვენებთ, სხვა შემთხვევაში კი მათ სიას.
  return (
    <SectionPanel title="My purchases" intro="Review placed orders and their latest saved status.">
      {orders.length === 0 ? (
        <p className="border border-market-border p-5 text-sm text-market-muted">
          No purchases are recorded yet. <Link to="/" className="text-market-ink underline underline-offset-4">Browse the market</Link>
        </p>
      ) : (
        <ul className="divide-y divide-market-border border-y border-market-border">
          {orders.map((order) => (
            <li key={order.id} className="flex min-w-0 max-w-full flex-wrap items-center justify-between gap-4 py-4">
              <div className="min-w-0 max-w-full">
                <p className="break-all text-xs uppercase tracking-widest text-market-ink">{order.id}</p>
                <p className="mt-1 text-xs text-market-muted">
                  {formatDate(order.date)} · {order.items.length} line items
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="border border-gold px-3 py-1 text-[10px] uppercase tracking-widest">{order.status}</span>
                <span className="text-sm">{formatCurrency(order.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link to="/orders" className="mt-5 inline-flex min-h-10 items-center text-xs uppercase tracking-widest text-market-muted underline underline-offset-4">
        Open order history
      </Link>
    </SectionPanel>
  );
}
