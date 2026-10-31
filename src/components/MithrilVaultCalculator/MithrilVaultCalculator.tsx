import { useState } from "react";
import { CalculatorForm } from "./CalculatorForm";

const OPEN_KEY = "middle-market-mithril-vault-open";

function getInitialOpenState(): boolean {
  try {
    const saved = localStorage.getItem(OPEN_KEY);
    if (saved !== null) return saved === "true";
  } catch {
    // Use the viewport default when browser storage is unavailable.
  }
  return window.matchMedia("(min-width: 768px)").matches;
}

export function MithrilVaultCalculator() {
  const [isOpen, setIsOpen] = useState(getInitialOpenState);

  const toggleOpen = () => {
    setIsOpen((current) => {
      const next = !current;
      try {
        localStorage.setItem(OPEN_KEY, String(next));
      } catch {
        // Keep the current interaction available for this session.
      }
      return next;
    });
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="Open the Mithril Vault currency calculator"
        className="fixed bottom-6 left-6 z-50 inline-flex min-h-12 items-center gap-2 border border-gold/60 bg-market-paper px-4 text-market-ink shadow-lg transition-colors hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <VaultMark />
        <span className="font-display text-xs uppercase tracking-[0.12em]">Mithril Vault</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Mithril Vault currency calculator"
      className="fixed bottom-6 left-6 z-50 w-[calc(100vw-2rem)] max-w-[22rem] border border-gold/60 bg-market-paper text-market-ink shadow-2xl max-md:bottom-20 max-md:left-4 max-md:max-h-[calc(100dvh-7rem)] max-md:overflow-y-auto"
    >
      <header className="flex items-start justify-between gap-3 border-b border-market-border px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold">
            <VaultMark />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-sm uppercase tracking-[0.1em]">The Mithril Vault</h2>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-market-muted">Exchange across the realms</p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleOpen}
          aria-label="Minimize Mithril Vault"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-lg text-market-muted transition-colors hover:text-market-ink focus-visible:outline-2 focus-visible:outline-gold"
        >
          −
        </button>
      </header>
      <CalculatorForm />
    </aside>
  );
}

function VaultMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="12" />
      <circle cx="16" cy="16" r="7.5" />
      <path d="m12 17 2.5 2.5 5.5-7" />
    </svg>
  );
}
