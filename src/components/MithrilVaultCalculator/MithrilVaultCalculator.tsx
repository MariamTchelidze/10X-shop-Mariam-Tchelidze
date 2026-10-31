import { useCallback, useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(getInitialOpenState);

  const updateOpenState = useCallback((next: boolean) => {
    setIsOpen(next);
    try {
      localStorage.setItem(OPEN_KEY, String(next));
    } catch {
      // Keep the current interaction available for this session.
    }
  }, []);

  useOutsideClick(containerRef, () => updateOpenState(false), isOpen);

  return (
    <div
      ref={containerRef}
      className={`fixed z-50 transition-[bottom,left] duration-300 ${isOpen ? "bottom-20 left-4 md:bottom-6 md:left-6" : "bottom-6 left-6"}`}
    >
      <button
        type="button"
        onClick={() => updateOpenState(true)}
        aria-label="Open the Mithril Vault currency calculator"
        aria-expanded={isOpen}
        aria-hidden={isOpen}
        tabIndex={isOpen ? -1 : 0}
        className={`inline-flex min-h-12 w-48 items-center justify-start gap-2 border border-gold/60 bg-market-paper px-4 text-left text-market-ink shadow-lg transition-all duration-300 hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${isOpen ? "pointer-events-none absolute left-0 top-0 scale-95 opacity-0" : "relative scale-100 opacity-100"}`}
      >
        <VaultMark />
        <span className="font-display text-xs uppercase tracking-[0.12em]">Mithril Vault</span>
      </button>

      <aside
        aria-label="Mithril Vault currency calculator"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute bottom-0 left-0 origin-bottom-left overflow-y-auto border border-gold/60 bg-market-paper text-market-ink shadow-2xl transition-[width,transform,opacity] duration-300 max-md:max-h-[calc(100dvh-7rem)] ${isOpen ? "w-[calc(100vw-2rem)] max-w-[22rem] translate-y-0 scale-100 opacity-100" : "pointer-events-none w-48 translate-y-2 scale-95 opacity-0"}`}
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
            onClick={() => updateOpenState(false)}
            aria-label="Minimize Mithril Vault"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-lg text-market-muted transition-colors hover:text-market-ink focus-visible:outline-2 focus-visible:outline-gold"
          >
            −
          </button>
        </header>
        <CalculatorForm />
      </aside>
    </div>
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
