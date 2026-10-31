import { useEffect, useRef, type MouseEvent } from "react";
import type { Product } from "../../types/product";
import { StockAlertForm } from "./StockAlertForm";

interface StockAlertModalProps {
  product: Product;
  onClose: () => void;
}

export function StockAlertModal({ product, onClose }: StockAlertModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
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

  const closeOnBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={closeOnBackdrop}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-alert-title"
        aria-describedby="stock-alert-description"
        className="relative grid max-h-[calc(100dvh-2rem)] w-full max-w-2xl grid-cols-1 overflow-y-auto border border-gold/50 bg-market-paper shadow-2xl sm:grid-cols-[0.8fr_1.2fr]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close Mithril Stock Alert"
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center border border-market-border bg-market-paper/95 text-xl text-market-ink transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          ×
        </button>

        <div className="flex min-h-44 items-center justify-center bg-market-surface p-8 sm:min-h-full">
          <RavenMark />
        </div>
        <div className="min-w-0 p-5 pt-16 sm:p-8 sm:pt-10">
          <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Mithril Stock Alert</p>
          <h2 id="stock-alert-title" className="mt-3 pr-5 font-display text-2xl leading-tight text-market-ink sm:text-3xl">
            Let the ravens keep watch
          </h2>
          <p id="stock-alert-description" className="mt-3 text-sm leading-6 text-market-muted">
            {product.title} has journeyed from the shelves for now. Leave your email and a raven will carry word when it returns.
          </p>
          <div className="mt-6">
            <StockAlertForm productId={product.id} productTitle={product.title} />
          </div>
        </div>
      </section>
    </div>
  );
}

function RavenMark() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className="h-24 w-24 text-gold sm:h-32 sm:w-32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="48" cy="48" r="42" className="opacity-40" />
      <path d="M19 60c13-2 20-8 28-18 9 10 17 16 30 17-8 6-18 9-30 8-11-1-20-3-28-7Z" />
      <path d="m47 42 7-9 13 2-8 7M53 42l-3 25M31 55l16 12m18-14-12 13m-9-34 6-8 9 5" />
      <path d="m67 35 9 2-8 4" />
    </svg>
  );
}
