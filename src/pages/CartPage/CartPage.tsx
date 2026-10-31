import { Link } from "react-router";
import { useCart } from "../../context/CartContext";
import { useRealm } from "../../context/RealmContext";
import { useInventory } from "../../context/InventoryContext";
import type { CartItem } from "../../types/cart";
import { CartItemRow } from "./components/CartItemRow";
import { CartSummary } from "./components/CartSummary";

export function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const { formatCurrency } = useRealm();
  const { getStock } = useInventory();

  const getMaxQuantity = (item: CartItem): number => {
    const otherVariantQuantity = items
      .filter((entry) => entry.productId === item.productId && !(entry.size === item.size && entry.color === item.color))
      .reduce((total, entry) => total + entry.quantity, 0);
    return Math.max(1, getStock(item.productId, item.stock) - otherVariantQuantity);
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl text-market-ink">Your cart is empty</h1>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-12 items-center bg-market-ink px-8 text-xs uppercase tracking-[0.14em] text-market-paper transition-colors hover:bg-market-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="mb-8 border-b border-market-border pb-5 font-display text-3xl text-market-ink sm:mb-10 sm:text-4xl">
        Your cart
      </h1>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <ul className="divide-y divide-market-border">
          {items.map((item) => (
            <CartItemRow
              key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`}
              item={item}
              maxQuantity={getMaxQuantity(item)}
              formatCurrency={formatCurrency}
              onRemove={(current) =>
                removeItem(current.productId, { size: current.size, color: current.color })
              }
              onQuantityChange={(current, quantity) =>
                updateQuantity(current.productId, quantity, {
                  size: current.size,
                  color: current.color,
                })
              }
            />
          ))}
        </ul>
        <CartSummary subtotal={subtotal} formatCurrency={formatCurrency} />
      </div>
    </main>
  );
}
