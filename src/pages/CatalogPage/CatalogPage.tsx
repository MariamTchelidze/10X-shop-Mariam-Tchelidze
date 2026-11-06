// კატალოგის ფილტრებს URL-თან სინქრონულად მართავს და შედეგებს აჩვენებს.
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { CatalogToolbar } from "../../components/CatalogToolbar/CatalogToolbar";
import { HeroCarousel } from "../../components/HeroCarousel/HeroCarousel";
import {
  CATALOG_PAGE_SIZE,
  isCatalogSortOption,
  type CatalogSortOption,
} from "../../types/catalog";
import { CatalogResults } from "./components/CatalogResults";
import { useCatalogProducts } from "./useCatalogProducts";

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
  const pageParam = searchParams.get("page");
  const rawPage = pageParam === null ? 1 : Number(pageParam);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const [searchInput, setSearchInput] = useState(query);
  const { products, total, isLoading, error, retry } = useCatalogProducts({
    q: query,
    category,
    sort,
    page,
    setSearchParams,
  });

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    const hasInvalidSort = rawSort !== "" && !isCatalogSortOption(rawSort);
    const needsPage = page === 1 ? pageParam !== null : pageParam !== String(page);
    const hasConflictingFilters = Boolean(query && rawCategory);

    if (!needsPage && !hasInvalidSort && !hasConflictingFilters) {
      return;
    }

    // URL-ში არასწორ ან ურთიერთგამომრიცხავ ფილტრებს ვასწორებთ history-ის ზედმეტი ჩანაწერის გარეშე.
    setSearchParams(
      (current) => {
        if (page === 1) {
          current.delete("page");
        } else {
          current.set("page", String(page));
        }
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
  }, [page, pageParam, query, rawCategory, rawSort, searchParams, setSearchParams]);

  useEffect(() => {
    const normalizedInput = searchInput.trim();
    if (normalizedInput === query) {
      return;
    }

    // მცირე დაყოვნება ძიებას აკონტროლებს და ზედმეტ API მოთხოვნებს ამცირებს.
    const timeoutId = window.setTimeout(() => {
      setSearchParams(
        (current) => {
          if (normalizedInput) {
            current.set("q", normalizedInput);
            current.delete("category");
          } else {
            current.delete("q");
          }
          current.delete("page");
          return current;
        },
        { replace: true },
      );
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [query, searchInput, setSearchParams]);

  const totalPages = Math.ceil(total / CATALOG_PAGE_SIZE);
  const firstResult = total === 0 ? 0 : (page - 1) * CATALOG_PAGE_SIZE + 1;
  const lastResult = Math.min(page * CATALOG_PAGE_SIZE, total);

  const handleCategoryChange = (value: string): void => {
    // კატეგორიის არჩევისას ძიებას ვასუფთავებთ და პირველ გვერდზე ვბრუნდებით.
    setSearchInput("");
    setSearchParams((current) => {
      current.delete("q");
      if (value) {
        current.set("category", value);
      } else {
        current.delete("category");
      }
      current.delete("page");
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
      current.delete("page");
      return current;
    });
  };

  const handlePageChange = (nextPage: number): void => {
    // გვერდის მნიშვნელობას ხელმისაწვდომ დიაპაზონში ვზღუდავთ.
    const boundedPage = Math.min(Math.max(1, nextPage), Math.max(1, totalPages));
    setSearchParams((current) => {
      if (boundedPage === 1) {
        current.delete("page");
      } else {
        current.set("page", String(boundedPage));
      }
      return current;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = (): void => {
    setSearchInput("");
    setSearchParams({});
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
      <HeroCarousel />
      <header className="mb-7 flex items-end justify-between gap-4 border-b border-market-border pb-5 sm:mb-8">
        <h2 className="font-display text-3xl text-market-ink sm:text-4xl">Catalog</h2>
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

      <CatalogResults
        products={products}
        isLoading={isLoading}
        error={error}
        page={page}
        totalPages={totalPages}
        canClearFilters={Boolean(query || category || sort)}
        onRetry={retry}
        onClearFilters={clearFilters}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
