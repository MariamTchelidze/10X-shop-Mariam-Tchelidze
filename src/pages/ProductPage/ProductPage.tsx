import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchProductById } from "../../api/products";
import { ProductReviewsContainer } from "../../components/ProductReviews/ProductReviewsContainer";
import { StockAlertModal } from "../../components/StockAlert/StockAlertModal";
import { useCart } from "../../context/CartContext";
import { useRealm } from "../../context/RealmContext";
import { useInventory } from "../../context/InventoryContext";
import type { Product } from "../../types/product";
import { discountedPrice } from "../../utils/product";
import { RelatedProducts } from "./components/RelatedProducts";

export function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  const isValidId = Number.isInteger(productId) && productId > 0;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [isStockAlertOpen, setIsStockAlertOpen] = useState(false);
  const { addItem } = useCart();
  const { formatCurrency } = useRealm();
  const { getStock } = useInventory();

  useEffect(() => {
    const controller = new AbortController();
    setQuantity(1);
    setCartMessage(null);

    if (!isValidId) {
      setProduct(null);
      setError(null);
      setIsLoading(false);
      return () => controller.abort();
    }

    const loadProduct = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchProductById(productId, controller.signal);
        if (!controller.signal.aborted) {
          setProduct(result);
        }
      } catch (reason: unknown) {
        if (!controller.signal.aborted) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Something went wrong while loading this product.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadProduct();
    return () => controller.abort();
  }, [isValidId, productId]);

  useEffect(() => {
    setQuantity((current) => Math.min(current, Math.max(1, getStock(productId, product?.stock ?? 0))));
  }, [getStock, product?.stock, productId]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-market-muted" role="status">
        Loading product…
      </main>
    );
  }

  if (!isValidId || (!error && product === null)) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-market-ink">Page not found</h1>
        <p className="mt-3 text-sm text-market-muted">The product you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-block text-xs uppercase tracking-[0.14em] text-market-ink underline">
          Back to catalog
        </Link>
      </main>
    );
  }

  if (error || product === null) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center" role="alert">
        <p className="text-sm text-market-muted">{error ?? "Unable to load this product."}</p>
        <Link to="/" className="mt-6 inline-block text-xs uppercase tracking-[0.14em] text-market-ink underline">
          Back to catalog
        </Link>
      </main>
    );
  }

  const price = discountedPrice(product.price, product.discountPercentage);
  const stock = getStock(product.id, product.stock);
  const stockMessage =
    stock === 0
      ? "Out of Stock · Mithril Alert"
      : stock <= 5
        ? `Only ${stock} left in stock!`
        : "In stock";
  const stockColor = stock > 0 && stock <= 5 ? "text-gold" : stock === 0 ? "text-blood" : "text-market-muted";

  const handleAddToCart = (): void => {
    const added = addItem(product, quantity);
    setCartMessage(
      added ? "Added to cart." : "Your cart already contains the available stock.",
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link to="/" className="mb-6 inline-block text-xs uppercase tracking-[0.14em] text-market-muted hover:text-market-ink">
        ← Back to catalog
      </Link>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="bg-market-surface">
          <img
            src={product.thumbnail}
            alt={product.title}
            width={900}
            height={1100}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
        <section className="flex flex-col items-start py-2 md:py-8">
          <p className="text-xs uppercase tracking-[0.16em] text-market-muted">{product.category}</p>
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
            <span className={stockColor}>{stockMessage}</span>
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
        </section>
      </div>
      <ProductReviewsContainer product={product} />
      <RelatedProducts product={product} />
      {isStockAlertOpen && (
        <StockAlertModal product={product} onClose={() => setIsStockAlertOpen(false)} />
      )}
    </main>
  );
}
