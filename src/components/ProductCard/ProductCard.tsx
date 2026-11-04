// კატალოგის პროდუქტის ბარათს, სწრაფ დამატებასა და დამხმარე ფანჯრებს მართავს.
import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useRealm } from "../../context/RealmContext";
import { useInventory } from "../../context/InventoryContext";
import { QuickViewModal } from "../QuickViewModal/QuickViewModal";
import { StockAlertModal } from "../StockAlert/StockAlertModal";
import type { Product } from "../../types/product";
import { discountedPrice, getStockStatus } from "../../utils/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { formatCurrency } = useRealm();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getStock } = useInventory();
  const [isVariantPickerOpen, setIsVariantPickerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [variantError, setVariantError] = useState("");
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isStockAlertOpen, setIsStockAlertOpen] = useState(false);
  const stock = getStock(product.id, product.stock);
  const hasVariants = Boolean(product.sizes?.length || product.colors?.length);
  const stockStatus = getStockStatus(stock);

  // მარაგს ვამოწმებთ ჯერ; შემდეგ სტუმარს კალათის კონტექსტი შესვლის შეტყობინებას აჩვენებს.
  const handleQuickAdd = (): void => {
    if (stock < 1) {
      setIsStockAlertOpen(true);
      return;
    }
    if (hasVariants) {
      setVariantError("");
      setIsVariantPickerOpen((current) => !current);
      return;
    }
    addItem(product, 1);
  };

  const handleVariantSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // ფორმა არ იგზავნება, სანამ საჭირო ზომა და ფერი არჩეული არ არის.
    if (stock < 1) {
      setIsVariantPickerOpen(false);
      setIsStockAlertOpen(true);
      return;
    }
    if ((product.sizes?.length && !selectedSize) || (product.colors?.length && !selectedColor)) {
      setVariantError("Choose your options to continue.");
      return;
    }
    const wasAdded = addItem(product, 1, {
      ...(selectedSize ? { size: selectedSize } : {}),
      ...(selectedColor ? { color: selectedColor } : {}),
    });
    if (wasAdded) setIsVariantPickerOpen(false);
  };

  return (
    <article className={`group relative min-w-0 ${isQuickViewOpen || isStockAlertOpen ? "z-[60]" : ""}`}>
      <Link
        to={`/products/${product.id}`}
        aria-label={`View ${product.title} details`}
        className="absolute inset-0 z-10 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      />
      <div className="relative overflow-hidden bg-market-surface">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          width={600}
          height={800}
          className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <button
          type="button"
          aria-label={isInWishlist(product.id) ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          aria-pressed={isInWishlist(product.id)}
          onClick={() => toggleWishlist(product)}
          className="absolute right-3 top-3 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-market-border bg-market-paper/95 text-market-ink shadow-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
        </button>

        <div className={`absolute inset-x-0 bottom-0 z-20 transition-all duration-300 ${isVariantPickerOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 max-sm:translate-y-0 max-sm:opacity-100"}`}>
          {!isVariantPickerOpen ? stock === 0 ? (
            <div className="grid grid-cols-2">
              <button
                type="button"
                disabled
                className="min-h-11 cursor-not-allowed bg-market-surface px-3 text-[10px] font-medium uppercase tracking-[0.1em] text-market-muted"
              >
                Out of stock
              </button>
              <button
                type="button"
                onClick={() => setIsStockAlertOpen(true)}
                className="min-h-11 bg-market-paper/95 px-3 text-[10px] font-medium uppercase tracking-[0.1em] text-market-ink transition-colors hover:bg-market-ink hover:text-market-paper focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold"
              >
                Mithril alert
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="min-h-11 w-full bg-market-paper/95 px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-market-ink backdrop-blur-sm transition-colors hover:bg-market-ink hover:text-market-paper focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold"
            >
              Add to Bag
            </button>
          ) : (
            <form onSubmit={handleVariantSubmit} className="space-y-3 bg-market-paper/95 p-3 text-market-ink shadow-lg backdrop-blur-sm sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-xs uppercase tracking-wider">Select options</p>
                <button type="button" aria-label="Close quick options" onClick={() => setIsVariantPickerOpen(false)} className="inline-flex h-11 w-11 items-center justify-center text-lg leading-none text-market-muted hover:text-market-ink focus-visible:outline-2 focus-visible:outline-gold">×</button>
              </div>
              {product.sizes && product.sizes.length > 0 && <label className="block text-[9px] uppercase tracking-widest text-market-muted">Size<select required value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)} className="mt-1 min-h-11 w-full border border-market-border bg-primary px-2 text-xs text-primary"><option value="">Choose size</option>{product.sizes.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>}
              {product.colors && product.colors.length > 0 && <label className="block text-[9px] uppercase tracking-widest text-market-muted">Color<select required value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)} className="mt-1 min-h-11 w-full border border-market-border bg-primary px-2 text-xs text-primary"><option value="">Choose color</option>{product.colors.map((color) => <option key={color} value={color}>{color}</option>)}</select></label>}
              {variantError && <p role="alert" className="text-[10px] text-error">{variantError}</p>}
              <button type="submit" className="min-h-11 w-full bg-market-ink px-3 text-[9px] font-medium uppercase tracking-[0.12em] text-market-paper transition-opacity hover:opacity-80">Add to Bag</button>
            </form>
          )}
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 font-display text-sm font-medium uppercase tracking-wide text-market-ink">
            {product.title}
          </h2>
          <span className={`max-w-[44%] shrink text-right text-[9px] leading-3 sm:text-[10px] ${stockStatus.className}`}>{stockStatus.message}</span>
        </div>
        <p className="text-xs capitalize tracking-wide text-market-muted">
          {product.category}{product.brand ? ` · ${product.brand}` : ""}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-sm font-medium text-market-ink">
            {formatCurrency(discountedPrice(product.price, product.discountPercentage))}
          </p>
          {product.discountPercentage >= 1 && (
            <>
              <p className="text-xs text-market-muted line-through">{formatCurrency(product.price)}</p>
              <span className="text-[10px] font-medium text-forest">−{Math.round(product.discountPercentage)}%</span>
            </>
          )}
        </div>
        <p className="pointer-events-none relative z-20 text-xs text-market-ink" aria-label={`Rated ${product.rating.toFixed(1)} out of 5`}>
          <span aria-hidden="true">★</span> {product.rating.toFixed(1)}
        </p>
        <button type="button" onClick={() => setIsQuickViewOpen(true)} className="relative z-20 inline-flex min-h-11 items-center pt-1 text-[10px] uppercase tracking-[0.14em] text-market-muted underline underline-offset-4 transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Scry Artifact</button>
      </div>
      {isQuickViewOpen && <QuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />}
      {isStockAlertOpen && <StockAlertModal product={product} onClose={() => setIsStockAlertOpen(false)} />}
    </article>
  );
}
