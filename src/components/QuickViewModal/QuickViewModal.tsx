// პროდუქტის მოკლე დეტალებს მოდალურ ფანჯარაში აჩვენებს.
import { lazy, Suspense, useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { useCart } from "../../context/CartContext";
import { useRealm } from "../../context/RealmContext";
import { useInventory } from "../../context/InventoryContext";
import type { Product } from "../../types/product";
import { discountedPrice, getStockStatus } from "../../utils/product";
import { ProductImage } from "../ProductImage/ProductImage";

// მარაგის შეტყობინების ფორმას მხოლოდ out-of-stock სცენარში ვტვირთავთ.
const StockAlertModal = lazy(() => import("../StockAlert/StockAlertModal").then((module) => ({ default: module.StockAlertModal })));

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { formatPrice } = useRealm();
  const { getStock } = useInventory();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [error, setError] = useState("");
  const [isStockAlertOpen, setIsStockAlertOpen] = useState(false);
  const image = product.images[0] ?? product.thumbnail;
  const price = discountedPrice(product.price, product.discountPercentage);
  const stock = getStock(product.id, product.stock);
  const stockStatus = getStockStatus(stock);

  useEffect(() => {
    // მოდალის გახსნისას ფონს ვკეტავთ, დახურვისას კი წინა scroll მდგომარეობას აღვადგენთ.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    // შიგთავსზე დაჭერა მოდალს არ ხურავს; მხოლოდ გარე ფენის დაჭერაა დახურვის მიზეზი.
    if (event.target === event.currentTarget) onClose();
  };

  const handleAddToBag = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // მარაგი და არჩეული ვარიანტები მოწმდება კალათაში დამატებამდე.
    if (stock < 1) {
      setIsStockAlertOpen(true);
      return;
    }
    if ((product.sizes?.length && !selectedSize) || (product.colors?.length && !selectedColor)) {
      setError("Choose your artifact options before adding it to your bag.");
      return;
    }
    const added = addItem(product, 1, {
      ...(selectedSize ? { size: selectedSize } : {}),
      ...(selectedColor ? { color: selectedColor } : {}),
    });
    if (added) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={handleBackdropMouseDown}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="quick-view-title" className="relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl grid-cols-1 overflow-y-auto border border-gold/50 bg-market-paper shadow-2xl sm:max-h-[min(44rem,calc(100dvh-3rem))] sm:grid-cols-2">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close artifact quick view"
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center border border-market-border bg-market-paper/95 text-xl text-market-ink transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          ×
        </button>

        <div className="max-h-[38vh] min-h-52 bg-market-surface sm:max-h-none sm:min-h-[32rem]">
          <ProductImage src={image} alt={product.title} width={900} height={1100} loading="eager" className="h-full max-h-[38vh] w-full object-cover sm:max-h-full" />
        </div>

        <div className="flex min-w-0 flex-col p-5 sm:p-8 lg:p-10">
          <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Scry the artifact</p>
          <h2 id="quick-view-title" className="mt-3 pr-10 font-display text-2xl leading-tight text-market-ink sm:text-3xl">{product.title}</h2>
          <p className="mt-2 text-xs uppercase tracking-widest text-market-muted">{product.category}</p>
          <p className={`mt-2 text-xs ${stockStatus.className}`}>{stockStatus.message}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="text-base text-market-ink">{formatPrice(price)}</p>
            {product.discountPercentage > 0 && <p className="text-sm text-market-muted line-through">{formatPrice(product.price)}</p>}
          </div>
          <p className="mt-5 max-h-28 overflow-y-auto text-sm leading-6 text-market-muted sm:max-h-40">{product.description}</p>

          <form onSubmit={handleAddToBag} className="mt-6 space-y-4">
            {product.sizes && product.sizes.length > 0 && (
              <label htmlFor="quick-view-size" className="block text-[10px] uppercase tracking-[0.14em] text-market-muted">Size
                <select id="quick-view-size" required value={selectedSize} onChange={(event) => { setSelectedSize(event.target.value); setError(""); }} className="mt-2 min-h-11 w-full border border-market-border bg-primary px-3 text-sm text-primary focus:border-gold focus:outline-none">
                  <option value="">Choose size</option>
                  {product.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            )}
            {product.colors && product.colors.length > 0 && (
              <label htmlFor="quick-view-color" className="block text-[10px] uppercase tracking-[0.14em] text-market-muted">Color
                <select id="quick-view-color" required value={selectedColor} onChange={(event) => { setSelectedColor(event.target.value); setError(""); }} className="mt-2 min-h-11 w-full border border-market-border bg-primary px-3 text-sm text-primary focus:border-gold focus:outline-none">
                  <option value="">Choose color</option>
                  {product.colors.map((color) => <option key={color} value={color}>{color}</option>)}
                </select>
              </label>
            )}
            {error && <p role="alert" className="text-xs text-error">{error}</p>}
            {stock > 0 ? (
              <button type="submit" className="min-h-12 w-full bg-market-ink px-6 text-xs font-medium uppercase tracking-[0.14em] text-market-paper transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                Add to Bag
              </button>
            ) : (
              <div className="grid gap-2">
                <button type="button" disabled className="min-h-12 w-full cursor-not-allowed bg-market-surface px-6 text-xs font-medium uppercase tracking-[0.14em] text-market-muted">
                  Out of stock
                </button>
                <button type="button" onClick={() => setIsStockAlertOpen(true)} className="min-h-12 w-full border border-gold px-6 text-xs font-medium uppercase tracking-[0.14em] text-market-ink transition-colors hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                  Request Mithril stock alert
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
      {isStockAlertOpen && (
        <Suspense fallback={null}>
          <StockAlertModal product={product} onClose={() => setIsStockAlertOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
