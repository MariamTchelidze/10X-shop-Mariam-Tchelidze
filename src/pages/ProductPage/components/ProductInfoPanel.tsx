// პროდუქტის ფასს, მარაგს, რაოდენობას და კალათაში დამატებას აჩვენებს.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useInventory } from "../../../context/InventoryContext";
import { useRealm } from "../../../context/RealmContext";
import type { Product } from "../../../types/product";
import { discountedPrice, getStockStatus } from "../../../utils/product";
import { StockAlertModal } from "../../../components/StockAlert/StockAlertModal";

interface ProductInfoPanelProps {
  product: Product;
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [isStockAlertOpen, setIsStockAlertOpen] = useState(false);
  const { addItem } = useCart();
  const { formatCurrency } = useRealm();
  const { getStock } = useInventory();
  const stock = getStock(product.id, product.stock);
  const price = discountedPrice(product.price, product.discountPercentage);
  const stockStatus = getStockStatus(stock);

  useEffect(() => {
    // სხვა პროდუქტზე გადასვლისას წინა რაოდენობასა და შეტყობინებას ვასუფთავებთ.
    setQuantity(1);
    setCartMessage(null);
  }, [product.id]);

  useEffect(() => {
    // მარაგის შემცირებისას არჩეულ რაოდენობას ხელმისაწვდომ ზღვრამდე ვამცირებთ.
    setQuantity((current) => Math.min(current, Math.max(1, stock)));
  }, [stock]);

  const handleAddToCart = (): void => {
    // კალათის კონტექსტი საერთო მარაგის ზღვარს ამოწმებს.
    const added = addItem(product, quantity);
    setCartMessage(added ? "Added to cart." : "All available stock is already in your bag.");
  };

  return (
    <section className="flex flex-col items-start py-2 md:py-8">
      <Link
        to={`/?category=${encodeURIComponent(product.category)}&page=1`}
        aria-label={`Browse products in ${product.category}`}
        className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.16em] text-market-muted underline underline-offset-4 transition-colors hover:text-market-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {product.category}
      </Link>
      <h1 className="mt-3 font-display text-3xl text-market-ink sm:text-4xl">{product.title}</h1>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <p className="text-base text-market-ink">{formatCurrency(price)}</p>
        {product.discountPercentage > 0 && (
          <>
            <p className="text-sm text-market-muted line-through">{formatCurrency(product.price)}</p>
            <span className="text-xs text-market-muted">−{Math.round(product.discountPercentage)}%</span>
          </>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <span className="text-market-ink" aria-label={`Rated ${product.rating} out of 5`}>
          ★ {product.rating.toFixed(1)}
        </span>
        <span className={stockStatus.className}>{stockStatus.message}</span>
      </div>
      <p className="mt-6 max-w-prose text-sm leading-6 text-market-muted">{product.description}</p>

      <div className="mt-8 flex min-h-12 items-center border border-market-border">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || stock === 0}
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          className="min-h-12 min-w-12 text-lg text-market-ink disabled:text-market-border"
        >
          −
        </button>
        <span className="min-w-10 text-center text-sm" aria-live="polite">{quantity}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={quantity >= stock || stock === 0}
          onClick={() => setQuantity((current) => Math.min(stock, current + 1))}
          className="min-h-12 min-w-12 text-lg text-market-ink disabled:text-market-border"
        >
          +
        </button>
      </div>
      {stock > 0 ? (
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-4 min-h-12 w-full max-w-sm bg-market-ink px-6 text-xs font-medium uppercase tracking-[0.14em] text-market-paper transition-colors hover:bg-market-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink"
        >
          Add to cart
        </button>
      ) : (
        <div className="mt-4 grid w-full max-w-sm gap-2">
          <button type="button" disabled className="min-h-12 cursor-not-allowed bg-market-surface px-6 text-xs font-medium uppercase tracking-[0.14em] text-market-muted">
            Out of stock
          </button>
          <button
            type="button"
            onClick={() => setIsStockAlertOpen(true)}
            className="min-h-12 border border-gold bg-market-paper px-6 text-xs font-medium uppercase tracking-[0.14em] text-market-ink transition-colors hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            Request Mithril stock alert
          </button>
        </div>
      )}
      {cartMessage && <p className="mt-3 text-sm text-market-muted" role="status">{cartMessage}</p>}
      {isStockAlertOpen && (
        <StockAlertModal product={product} onClose={() => setIsStockAlertOpen(false)} />
      )}
    </section>
  );
}
