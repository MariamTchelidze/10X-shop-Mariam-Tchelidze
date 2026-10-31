import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../api/products";
import { CatalogToolbar } from "../../components/CatalogToolbar/CatalogToolbar";
import { Pagination } from "../../components/Pagination/Pagination";
import { ProductGrid } from "../../components/ProductGrid/ProductGrid";
import {
  CATALOG_PAGE_SIZE,
  isCatalogSortOption,
  type CatalogQuery,
  type CatalogSortOption,
} from "../../types/catalog";
import type { Product } from "../../types/product";

const SEARCH_DEBOUNCE_MS = 400;

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const routeState = location.state as { focusSearch?: boolean } | null;
  const focusSearch = routeState?.focusSearch === true;
  const query = searchParams.get("q")?.trim() ?? "";
  const rawCategory = searchParams.get("category") ?? "";
  const category = query ? "" : rawCategory;
  const rawSort = searchParams.get("sort") ?? "";
  const sort: CatalogSortOption = isCatalogSortOption(rawSort) ? rawSort : "";
  const rawPage = Number(searchParams.get("page"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const [searchInput, setSearchInput] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    const hasInvalidSort = rawSort !== "" && !isCatalogSortOption(rawSort);
    const needsPage = searchParams.get("page") !== String(page);
    const hasConflictingFilters = Boolean(query && rawCategory);

    if (!needsPage && !hasInvalidSort && !hasConflictingFilters) {
      return;
    }

    setSearchParams(
      (current) => {
        current.set("page", String(page));
        if (hasInvalidSort) {
          current.delete("sort");
        }
        if (query && rawCategory) {
          current.delete("category");
        }
        return current;
      },
      { replace: true },
    );
  }, [page, query, rawCategory, rawSort, searchParams, setSearchParams]);

  useEffect(() => {
    const normalizedInput = searchInput.trim();
    if (normalizedInput === query) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSearchParams(
        (current) => {
          if (normalizedInput) {
            current.set("q", normalizedInput);
            current.delete("category");
          } else {
            current.delete("q");
          }
          current.set("page", "1");
          return current;
        },
        { replace: true },
      );
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [query, searchInput, setSearchParams]);

  useEffect(() => {
    const controller = new AbortController();
    const params: CatalogQuery = { q: query, category, sort, page };

    const loadProducts = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchProducts(params, controller.signal);
        if (!controller.signal.aborted) {
          const lastPage = Math.max(
            1,
            Math.ceil(response.total / CATALOG_PAGE_SIZE),
          );
          if (page > lastPage) {
            setSearchParams(
              (current) => {
                current.set("page", String(lastPage));
                return current;
              },
              { replace: true },
            );
            return;
          }
          setProducts(response.products);
          setTotal(response.total);
        }
      } catch (reason: unknown) {
        if (!controller.signal.aborted) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Something went wrong while loading products.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();
    return () => controller.abort();
  }, [category, page, query, retryCount, setSearchParams, sort]);

  const totalPages = Math.ceil(total / CATALOG_PAGE_SIZE);
  const firstResult = total === 0 ? 0 : (page - 1) * CATALOG_PAGE_SIZE + 1;
  const lastResult = Math.min(page * CATALOG_PAGE_SIZE, total);

  const handleCategoryChange = (value: string): void => {
    setSearchInput("");
    setSearchParams((current) => {
      current.delete("q");
      if (value) {
        current.set("category", value);
      } else {
        current.delete("category");
      }
      current.set("page", "1");
      return current;
    });
  };

  const handleSortChange = (value: CatalogSortOption): void => {
    setSearchParams((current) => {
      if (value) {
        current.set("sort", value);
      } else {
        current.delete("sort");
      }
      current.set("page", "1");
      return current;
    });
  };

  const handlePageChange = (nextPage: number): void => {
    const boundedPage = Math.min(Math.max(1, nextPage), Math.max(1, totalPages));
    setSearchParams((current) => {
      current.set("page", String(boundedPage));
      return current;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = (): void => {
    setSearchInput("");
    setSearchParams({ page: "1" });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
      <section className="relative mb-9 overflow-hidden border border-market-border bg-market-surface px-5 py-10 sm:mb-12 sm:px-10 sm:py-14 lg:px-16" aria-labelledby="realm-heading">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border-[10px] border-gold/70 shadow-[0_0_55px_rgba(201,169,106,0.25)] sm:right-12 sm:h-56 sm:w-56 sm:border-[14px]" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-forest">A MARKET BEYOND THE SHIRE</p>
        <h1 id="realm-heading" className="relative z-10 mt-4 max-w-2xl font-display text-3xl leading-tight text-market-ink sm:text-5xl">Treasures of Middle-earth</h1>
        <p className="relative z-10 mt-4 max-w-xl text-sm leading-6 text-market-muted sm:text-base">Artifacts, apparel, and keepsakes for every road through the realm.</p>
        <div className="relative z-10 mt-6 flex max-w-2xl flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.12em] text-market-muted sm:text-xs">
          <span>The One Ring replica</span><span>Nazgûl cloak</span><span>Sauron hoodie</span><span>Mordor mug</span>
        </div>
      </section>
      <header className="mb-7 flex items-end justify-between gap-4 border-b border-market-border pb-5 sm:mb-8">
        <h2 className="font-display text-3xl text-market-ink sm:text-4xl">Browse the realm</h2>
        {!isLoading && !error && (
          <p className="text-right text-[10px] uppercase tracking-[0.12em] text-market-muted sm:text-xs">
            {total === 0 ? "0 items" : `Showing ${firstResult}–${lastResult} of ${total}`}
          </p>
        )}
      </header>

      <CatalogToolbar
        focusSearch={focusSearch}
        searchValue={searchInput}
        category={category}
        sort={sort}
        onSearchChange={setSearchInput}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
      />

      {isLoading && (
        <p className="py-16 text-center text-sm text-market-muted" role="status">
          Loading products…
        </p>
      )}

      {!isLoading && error && (
        <section className="py-16 text-center" role="alert">
          <p className="text-sm text-market-muted">{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-5 border-b border-market-ink pb-1 text-xs uppercase tracking-[0.14em] text-market-ink hover:text-market-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink"
          >
            Try again
          </button>
        </section>
      )}

      {!isLoading && !error && products.length === 0 && (
        <section className="py-16 text-center">
          <p className="text-sm text-market-muted">No products found.</p>
          {(query || category || sort) && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-xs uppercase tracking-[0.14em] text-market-ink underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </section>
      )}

      {!isLoading && !error && products.length > 0 && (
        <>
          <ProductGrid products={products} />
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </>
      )}
    </main>
  );
}
