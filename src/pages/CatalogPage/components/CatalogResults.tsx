// კატალოგის ჩატვირთვის, შეცდომის, ცარიელი შედეგისა და პროდუქტის სიის ხედვებს არჩევს.
import type { Product } from "../../../types/product";
import { Pagination } from "../../../components/Pagination/Pagination";
import { ProductGrid } from "../../../components/ProductGrid/ProductGrid";

interface CatalogResultsProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  canClearFilters: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
}

export function CatalogResults({
  products,
  isLoading,
  error,
  page,
  totalPages,
  canClearFilters,
  onRetry,
  onClearFilters,
  onPageChange,
}: CatalogResultsProps) {
  // ჩატვირთვის, შეცდომისა და ცარიელი შედეგის UI ერთ კომპონენტში განისაზღვრება.
  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-market-muted" role="status">
        Loading products…
      </p>
    );
  }

  if (error) {
    return (
      <section className="py-16 text-center" role="alert">
        <p className="text-sm text-market-muted">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex min-h-11 items-center border-b border-market-ink pb-1 text-xs uppercase tracking-[0.14em] text-market-ink hover:text-market-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink"
        >
          Try again
        </button>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 text-center">
        <p className="text-sm text-market-muted">No products found.</p>
        {canClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 inline-flex min-h-11 items-center text-xs uppercase tracking-[0.14em] text-market-ink underline underline-offset-4"
          >
            Clear filters
          </button>
        )}
      </section>
    );
  }

  return (
    <>
      <ProductGrid products={products} />
      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </>
  );
}
