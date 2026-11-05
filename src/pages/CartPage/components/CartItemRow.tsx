// კალათის ერთ პროდუქტს, არჩეულ ვარიანტებს, ფასსა და რაოდენობის მართვას აჩვენებს.
import { Link } from "react-router";
import type { CartItem } from "../../../types/cart";
import { discountedPrice, lineTotal } from "../../../utils/product";
import { ProductImage } from "../../../components/ProductImage/ProductImage";

// Props აღწერს მონაცემებსა და მოქმედებებს, რომლებსაც მშობელი კომპონენტი გადასცემს.
interface CartItemRowProps {
  item: CartItem;
  maxQuantity: number;
  formatCurrency: (amount: number) => string;
  onRemove: (item: CartItem) => void;
  onQuantityChange: (item: CartItem, quantity: number) => void;
}

export function CartItemRow({ item, maxQuantity, formatCurrency, onRemove, onQuantityChange }: CartItemRowProps) {
  // ერთეულის ფასი ფასდაკლების შემდეგ გამოითვლება.
  const unitPrice = discountedPrice(item.price, item.discountPercentage);
  // ვაჩვენებთ მხოლოდ იმ ზომასა და ფერს, რომლებიც მომხმარებელმა აირჩია.
  const variants = [
    item.size ? `Size: ${item.size}` : "",
    item.color ? `Color: ${item.color}` : "",
  ].filter(Boolean);

  return (
    <li className="flex gap-4 py-5 sm:gap-6">
      {/* სურათზე დაჭერით პროდუქტის დეტალების გვერდზე გადავალთ. */}
      <Link to={`/products/${item.productId}`} className="w-24 shrink-0 bg-market-surface sm:w-32">
        <ProductImage
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          width={300}
          height={400}
          className="aspect-[3/4] h-full w-full object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <Link to={`/products/${item.productId}`} className="text-sm font-medium text-market-ink hover:underline">
            {item.title}
          </Link>
          {variants.length > 0 && (
            <p className="mt-1 text-xs text-market-muted">{variants.join(" · ")}</p>
          )}
          <p className="mt-2 text-sm text-market-muted">{formatCurrency(unitPrice)} each</p>
          <button
            type="button"
            onClick={() => onRemove(item)}
            className="mt-3 inline-flex min-h-11 items-center text-xs uppercase tracking-[0.12em] text-market-muted underline underline-offset-4 hover:text-market-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink"
          >
            Remove
          </button>
        </div>
        <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
          <div className="flex min-h-11 items-center border border-market-border">
            <button
              type="button"
              aria-label={`Decrease ${item.title} quantity`}
              disabled={item.quantity <= 1}
              onClick={() => onQuantityChange(item, item.quantity - 1)}
              className="min-h-11 min-w-11 text-lg text-market-ink disabled:text-market-border"
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm" aria-live="polite">{item.quantity}</span>

            <button
              type="button"
              aria-label={`Increase ${item.title} quantity`}
              disabled={item.quantity >= maxQuantity}
              onClick={() => onQuantityChange(item, item.quantity + 1)}
              className="min-h-11 min-w-11 text-lg text-market-ink disabled:text-market-border"
            >
              +
            </button>
          </div>

          <p className="text-sm font-medium text-market-ink">
            {formatCurrency(lineTotal(item.price, item.discountPercentage, item.quantity))}
          </p>
        </div>
      </div>
    </li>
  );
}
