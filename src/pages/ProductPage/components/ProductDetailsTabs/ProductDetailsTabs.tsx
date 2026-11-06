// პროდუქტის აღწერას, სპეციფიკაციებსა და შეფასებებს ჩანართებად აჩვენებს.
import { useState, type KeyboardEvent } from "react";
import "./ProductDetailsTabs.css";
import type { Product } from "../../../../types/product";
import { ProductReviewsContainer } from "../../../../components/ProductReviews/ProductReviewsContainer";

type ProductTab = "description" | "specifications" | "reviews";

const tabs: { id: ProductTab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "specifications", label: "Specifications" },
  { id: "reviews", label: "Tavern lore & reviews" },
];

interface ProductDetailsTabsProps {
  product: Product;
}

export function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<ProductTab>("description");

  // კლავიატურის ისრებით ჩანართებს შორის გადაადგილებას ვუჭერთ მხარს.
  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    document.getElementById(`product-tab-${nextTab.id}`)?.focus();
  };

  return (
    <section className="mt-12 border-t border-market-border pt-7 sm:mt-16 sm:pt-9" aria-label="Product details">
      <div role="tablist" aria-label="Product information" className="flex max-w-full gap-5 overflow-x-auto border-b border-market-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`product-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="product-detail-panel"
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={handleTabKeyDown}
            className={`min-h-12 shrink-0 border-b-2 px-1 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:text-xs ${activeTab === tab.id ? "border-market-ink text-market-ink" : "border-transparent text-market-muted hover:text-market-ink"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        key={activeTab}
        id="product-detail-panel"
        role="tabpanel"
        aria-labelledby={`product-tab-${activeTab}`}
        tabIndex={0}
        className="product-tab-panel min-w-0 py-7 outline-none focus-visible:ring-2 focus-visible:ring-gold sm:py-9"
      >
        {activeTab === "description" && (
          <div className="max-w-3xl">
            <h2 className="font-display text-xl text-market-ink">About this artifact</h2>
            <p className="mt-4 text-sm leading-7 text-market-muted">{product.description}</p>
          </div>
        )}

        {activeTab === "specifications" && <ProductSpecifications product={product} />}

        {activeTab === "reviews" && <ProductReviewsContainer product={product} />}
      </div>
    </section>
  );
}

function ProductSpecifications({ product }: ProductDetailsTabsProps) {
  const specifications: { label: string; value: string }[] = [
    { label: "Artifact number", value: `#${product.id}` },
    { label: "Category", value: product.category },
    { label: "Brand", value: product.brand || "Independent maker" },
    { label: "Realm rating", value: `${product.rating.toFixed(1)} / 5` },
    { label: "Available stock", value: String(product.stock) },
    ...(product.sizes?.length ? [{ label: "Available sizes", value: product.sizes.join(", ") }] : []),
    ...(product.colors?.length ? [{ label: "Available colors", value: product.colors.join(", ") }] : []),
  ];

  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-xl text-market-ink">Artifact specifications</h2>
      <dl className="mt-4 divide-y divide-market-border border-y border-market-border">
        {specifications.map((specification) => (
          <div key={specification.label} className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-3 text-sm sm:grid-cols-2">
            <dt className="text-market-muted">{specification.label}</dt>
            <dd className="min-w-0 break-words text-market-ink">{specification.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
