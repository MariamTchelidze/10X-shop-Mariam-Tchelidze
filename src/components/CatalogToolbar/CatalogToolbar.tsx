// კატალოგის ძიებისა და ფილტრების მართვის ხელსაწყოთა ზოლია.
// 1. იმპორტები და ტიპიზაციის კონტრაქტები (Interfaces)
import { useEffect, useState } from "react";
import { fetchCategories } from "../../api/products";
import type { CatalogSortOption, Category } from "../../types/catalog";

/*
 * CatalogToolbar კომპონენტის შემავალი პარამეტრების (Props) სტრუქტურა.
 * განსაზღვრავს ძიების, კატეგორიებისა და სორტირების მართვის ფუნქციებსა და მნიშვნელობებს.
 */
interface CatalogToolbarProps {
  focusSearch?: boolean;
  searchValue: string;
  category: string;
  sort: CatalogSortOption;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: CatalogSortOption) => void;
}
/*
 * სორტირების შესაძლო ვარიანტები ინტერფეისისთვის.
 * აკავშირებს შიდა გასაღებებს (value) მომხმარებლისთვის სახელს (label).
 */
const sortOptions: { value: CatalogSortOption; label: string }[] = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "title-asc", label: "Name A–Z" },
];

// 3. ძირითადი კომპონენტი (CatalogToolbar)
export function CatalogToolbar({
  focusSearch = false,
  searchValue,
  category,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: CatalogToolbarProps) {
  // შიდა ਸტატუსები კატეგორიების ასატვირთად, ჩატვირთვის პროცესისა და შეცდომების სამართავად
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // 4. გვერდის ჩატვირთვის ეფექტი (Side Effects & API Calls)
  useEffect(() => {
    // AbortController გამოიყენება იმისათვის, რომ ძველი/აქტუალური მოთხოვნა გავაუქმოთ, თუ კომპონენტი დაიხურა
    const controller = new AbortController();

    const loadCategories = async (): Promise<void> => {
      try {
        const result = await fetchCategories(controller.signal);
        if (!controller.signal.aborted) {
          setCategories(result);
        }
      } catch (reason: unknown) {
        if (!controller.signal.aborted) {
          setCategoryError(
            reason instanceof Error ? reason.message : "Unable to load categories.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCategories(false);
        }
      }
    };

    void loadCategories();
    // Cleanup ფუნქცია, რომელიც აუქმებს ქსელურ მოთხოვნას კომპონენტის განადგურებისას
    return () => controller.abort();
  }, []);

  // 5. ვიზუალური რენდერი (JSX UI Layout)
  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:mb-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {/* ბლოკი 1: პროდუქტების ძიების ინპუტი */}
      <div>
        <label htmlFor="catalog-search" className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-market-muted">
          Search
        </label>
        <input
          id="catalog-search"
          type="search"
          autoFocus={focusSearch}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products"
          className="min-h-11 w-full border-b border-market-border bg-transparent px-1 text-sm text-market-ink outline-none placeholder:text-market-muted focus:border-market-ink"
        />
      </div>
      
      {/* ბლოკი 2: კატეგორიების მიხედვით ფილტრაციის ჩამოსაშლელი სია */}
      <div>
        <label htmlFor="catalog-category" className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-market-muted">
          Category
        </label>
        <select
          id="catalog-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          disabled={isLoadingCategories || categories.length === 0}
          className="min-h-11 w-full border-b border-market-border bg-primary px-1 text-sm text-primary outline-none focus:border-market-ink disabled:text-market-muted"
        >
          <option value="" className="bg-primary text-primary">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug} className="bg-primary text-primary">
              {item.name}
            </option>
          ))}
        </select>
        {categoryError && <p className="mt-1 text-xs text-market-muted" role="status">Categories unavailable</p>}
      </div>

      {/* ბლოკი 3: დახარისხების (Sort) ჩამოსაშლელი სია */}
      <div>
        <label htmlFor="catalog-sort" className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-market-muted">
          Sort by
        </label>
        <select
          id="catalog-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as CatalogSortOption)}
          className="min-h-11 w-full border-b border-market-border bg-primary px-1 text-sm text-primary outline-none focus:border-market-ink"
        >
          {sortOptions.map((option) => (
            <option key={option.value || "default"} value={option.value} className="bg-primary text-primary">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
