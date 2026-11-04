// კალკულატორის სათაურს, დახურვის ღილაკსა და ფორმას აერთიანებს.
import { CalculatorForm } from "./CalculatorForm";

interface MithrilVaultPanelProps {
  onClose: () => void;
}

export function MithrilVaultPanel({ onClose }: MithrilVaultPanelProps) {
  // პანელი სათაურსა და გაცვლის ფორმას აერთიანებს; დახურვას მშობელს ატყობინებს.
  return (
    <>
      <header className="flex items-start justify-between gap-3 border-b border-market-border px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold"><VaultMark /></span>
          <div className="min-w-0">
            <h2 className="font-display text-sm uppercase tracking-[0.1em]">The Mithril Vault</h2>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-market-muted">Exchange across the realms</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close Mithril Vault" className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-lg text-market-muted transition-colors hover:text-market-ink focus-visible:outline-2 focus-visible:outline-gold">×</button>
      </header>
      <CalculatorForm />
    </>
  );
}

export function VaultMark() {
  // ვექტორული ნიშანი მიმდინარე ტექსტურ ფერს იყენებს.
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="12" />
      <circle cx="16" cy="16" r="7.5" />
      <path d="m12 17 2.5 2.5 5.5-7" />
    </svg>
  );
}
