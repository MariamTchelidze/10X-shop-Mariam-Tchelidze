import { useEffect, useRef, useState } from "react";
import { REALMS, useRealm } from "../../context/RealmContext";

export function RealmSelector() {
  const { realm, setRealm } = useRealm();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        aria-label={`Realm and currency: ${realm.name}, ${realm.currencyName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-10 w-9 items-center justify-center text-lg text-market-ink transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <span aria-hidden="true">{realm.marker}</span>
      </button>
      {isOpen && (
        <div role="listbox" aria-label="Choose your realm and currency" className="absolute right-0 top-full z-[60] mt-2 w-[min(19rem,calc(100vw-2rem))] border border-market-border bg-market-paper p-2 text-market-ink shadow-xl">
          <p className="px-3 py-2 font-display text-xs uppercase tracking-widest text-gold">Choose your realm</p>
          {REALMS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={realm.id === option.id}
              onClick={() => { setRealm(option.id); setIsOpen(false); }}
              className={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-gold ${realm.id === option.id ? "bg-market-surface" : ""}`}
            >
              <span aria-hidden="true" className="pt-0.5 text-base">{option.marker}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-sm">{option.name} <span className="font-sans text-xs text-market-muted">({option.region})</span></span>
                <span className="mt-1 block text-xs text-market-muted">{option.currencyName} ({option.currencySymbol})</span>
              </span>
              <span className="shrink-0 pt-1 text-[10px] uppercase tracking-wider text-market-muted">{option.multiplier.toFixed(1)}×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
