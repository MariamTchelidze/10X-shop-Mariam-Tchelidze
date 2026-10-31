import { Link } from "react-router";
import type { Product } from "../../types/product";
import { discountedPrice, formatPrice } from "../../utils/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const stockMessage =
    product.stock === 0
      ? "Out of stock"
      : product.stock <= 5
        ? `Only ${product.stock} left!`
        : "In stock";
  const stockColor =
    product.stock === 0
      ? "text-market-muted"
      : product.stock <= 5
        ? "text-amber-700"
        : "text-market-muted";

  return (
    <Link
      to={`/products/${product.id}`}
      aria-label={`View ${product.title}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink"
    >
      <article>
        <div className="overflow-hidden bg-market-surface">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            width={600}
            height={800}
            className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="space-y-2 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-sans text-sm font-medium uppercase tracking-wide text-market-ink">
              {product.title}
            </h2>
            <span className={`shrink-0 text-xs ${stockColor}`}>{stockMessage}</span>
          </div>
          <p className="text-xs capitalize tracking-wide text-market-muted">
            {product.category}
          </p>
          <p className="text-sm text-market-ink">
            {formatPrice(discountedPrice(product.price, product.discountPercentage))}
          </p>
        </div>
      </article>
    </Link>
  );
}
