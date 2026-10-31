import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchProductById } from "../../api/products";
import { ProductReviewsContainer } from "../../components/ProductReviews/ProductReviewsContainer";
import type { Product } from "../../types/product";
import { ProductInfoPanel } from "./components/ProductInfoPanel";
import { RelatedProducts } from "./components/RelatedProducts";

export function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  const isValidId = Number.isInteger(productId) && productId > 0;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
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
        <ProductInfoPanel product={product} />
      </div>
      <ProductReviewsContainer product={product} />
      <RelatedProducts product={product} />
    </main>
  );
}
