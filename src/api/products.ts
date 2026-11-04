/* ამ მოდულში თავმოყრილია პროდუქტებისა და კატეგორიების ყველა API მოთხოვნა (DummyJSON-თან კომუნიკაციისთვის). */
import type { Product, ProductsResponse } from "../types/product";
import type { CatalogQuery, Category } from "../types/catalog";
import { CATALOG_PAGE_SIZE } from "../types/catalog";

// ძირითადი მისამართი, საიდანაც მონაცემები მოგვაქვს
const API_BASE = "https://dummyjson.com";

/*
 * პროდუქტების წამოღება სერვერიდან.
 * ითვალისწინებს ძიებას, კატეგორიებს, გვერდებად დაყოფას (pagination) და დახარისხებას.
 */
export async function fetchProducts(
  query: CatalogQuery,
  // AbortSignal გამოიყენება იმისათვის, რომ ძველი/აქტუალური არამნიშვნელოვანი მოთხოვნა გავაუქმოთ, თუ მომხმარებელმა ახალი ძიება დაიწყო
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  // ვრწმუნდებით, რომ გვერდის ნომერი მინიმუმ 1 არის
  const page = Math.max(1, Math.floor(query.page));
  const searchParams = new URLSearchParams();

  // თუ საძიებო სიტყვა არსებობს, ვამატებთ პარამეტრებში
  if (query.q) {
    searchParams.set("q", query.q);
  }
  searchParams.set("limit", String(CATALOG_PAGE_SIZE));
  searchParams.set("skip", String((page - 1) * CATALOG_PAGE_SIZE));

  // ვამატებთ დახარისხების (sort) პარამეტრებს, თუ არჩეულია
  const sortConfig = getSortConfig(query.sort);
  if (sortConfig) {
    searchParams.set("sortBy", sortConfig.sortBy);
    searchParams.set("order", sortConfig.order);
  }

  // დინამიკურად ვარჩევთ მისამართს (endpoint-ს): ძიებაა, კატეგორია თუ ზოგადი სია
  const endpoint = query.q
    ? "/products/search"
    : query.category
      ? `/products/category/${encodeURIComponent(query.category)}`
      : "/products";
  const response = await fetch(`${API_BASE}${endpoint}?${searchParams.toString()}`, { signal });

  // თუ სერვერმა შეცდომა დააბრუნა, ვათავისუფლებთ გასაგებ შეტყობინებას
  if (!response.ok) {
    throw new Error(`Unable to load products (HTTP ${response.status}).`);
  }

  const data = (await response.json()) as ProductsResponse;
  // ვაბრუნებთ მონაცემებს და დამატებით ვზრუნავთ კლიენტის მხარეს დახარისხებაზეც (სანდოობისთვის)
  return { ...data, products: sortProducts(data.products, query.sort) };
}
/**
 * კატეგორიების სიის წამოღება (ფილტრაციისთვის)
 */
export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/products/categories`, { signal });

  if (!response.ok) {
    throw new Error(`Unable to load categories (HTTP ${response.status}).`);
  }

  return (await response.json()) as Category[];
}

/**
 * კონკრეტული პროდუქტის წამოღება მისი ID-ის მიხედვით (დეტალური გვერდისთვის)
 */
export async function fetchProductById(
  id: number,
  signal?: AbortSignal,
): Promise<Product | null> {
  const response = await fetch(`https://dummyjson.com/products/${id}`, { signal });

  // თუ პროდუქტი ვერ მოიძებნა (404), ვბრუნებთ null-ს, რომ აპლიკაცია არ დაიჭედოს
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unable to load this product (HTTP ${response.status}).`);
  }

  return (await response.json()) as Product;
}

interface SortConfig {
  sortBy: "price" | "rating" | "title";
  order: "asc" | "desc";
}

/**
 * ეხმარება სისტემას მომხმარებლის მიერ არჩეული სორტირება გადაიყვანოს API-სთვის გასაგებ ფორმატში
 */
function getSortConfig(sort: CatalogQuery["sort"]): SortConfig | null {
  switch (sort) {
    case "price-asc":
      return { sortBy: "price", order: "asc" };
    case "price-desc":
      return { sortBy: "price", order: "desc" };
    case "rating-desc":
      return { sortBy: "rating", order: "desc" };
    case "title-asc":
      return { sortBy: "title", order: "asc" };
    case "":
      return null;
  }
}

/**
 * პროდუქტების დახარისხება კლიენტის მხარეს (რომ ორიგინალი მასივი არ დავაზიანოთ, ვქმნით მის ასლს)
 */
function sortProducts(products: Product[], sort: CatalogQuery["sort"]): Product[] {
  return [...products].sort((first, second) => {
    switch (sort) {
      case "price-asc":
        return first.price - second.price;
      case "price-desc":
        return second.price - first.price;
      case "rating-desc":
        return second.rating - first.rating;
      case "title-asc":
        // სათაურების ანბანური მიმდევრობით შედარება
        return first.title.localeCompare(second.title);
      case "":
        return 0;
    }
  });
}
