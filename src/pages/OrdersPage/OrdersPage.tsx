// მიმდინარე მომხმარებლის შეკვეთების სიასა და დეტალურ გვერდს აჩვენებს.
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../../api/products";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useRealm } from "../../context/RealmContext";
import { useToast } from "../../context/ToastContext";
import type { Order } from "../../types/order";
import { formatDate } from "../../utils/formatters";
import { getOrderStatus, readOrders } from "../../utils/orders";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import { OrderDetail } from "./components/OrderDetail";

export function OrdersPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { formatPrice } = useRealm();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now());
  const [orders, setOrders] = useState<Order[]>(() =>
    readOrders().filter((order) => order.username === user.username),
  );

  useEffect(() => {
    // ყოველ 30 წამში სტატუსს ვაახლებთ და unmount-ზე interval-ს ვასუფთავებთ.
    const timer = window.setInterval(() => {
      setNow(Date.now());
      setOrders(readOrders().filter((order) => order.username === user.username));
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [user.username]);

  const selectedOrder = id ? orders.find((order) => order.id === id) : undefined;

  const handleReorder = async (order: Order): Promise<void> => {
    let addedCount = 0;
    try {
      // ხელახლა შეკვეთისას პროდუქტის მიმდინარე მარაგს API-დან ვამოწმებთ.
      for (const item of order.items) {
        const product = await fetchProductById(item.productId);
        if (!product) continue;
        const added = addItem(product, item.quantity, {
          ...(item.size ? { size: item.size } : {}),
          ...(item.color ? { color: item.color } : {}),
        });
        if (added) addedCount += 1;
      }
    } catch {
      addToast("Some products could not be loaded. Please try again.", "error");
      return;
    }

    if (addedCount === 0) {
      addToast("No items from this order are currently available.", "info");
      return;
    }
    addToast("Added to cart.", "success");
    navigate("/cart");
  };

  if (id) {
    if (!selectedOrder) return <NotFoundPage />;
    return (
      <OrderDetail
        order={selectedOrder}
        status={getOrderStatus(selectedOrder, now)}
        formatPrice={formatPrice}
        onReorder={() => void handleReorder(selectedOrder)}
      />
    );
  }

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
            <Link key={order.id} to={`/orders/${encodeURIComponent(order.id)}`} className="grid min-w-0 gap-3 border border-market-border p-4 transition-colors hover:border-gold sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-6 sm:p-6">
              <span className="min-w-0">
                <span className="block break-all text-xs uppercase tracking-widest text-market-muted">Order {order.id}</span>
                <span className="mt-2 block text-sm text-market-ink">{formatDate(order.date)} · {order.items.reduce((total, item) => total + item.quantity, 0)} items</span>
              </span>
              <span className="w-fit rounded-full border border-market-border px-3 py-1 text-[10px] uppercase tracking-widest">{getOrderStatus(order, now)}</span>
              <span className="text-sm font-medium">{formatPrice(order.total)}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
