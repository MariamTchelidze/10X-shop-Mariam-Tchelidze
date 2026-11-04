// მცურავი Mithril Vault კალკულატორის ხილვადობასა და დახურვას მართავს.
import { useCallback, useRef } from "react";
import { useFloatingWidgets } from "../../context/FloatingWidgetContext";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { MithrilVaultPanel, VaultMark } from "./MithrilVaultPanel";

export function MithrilVaultCalculator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeWidget, setActiveWidget } = useFloatingWidgets();
  const isOpen = activeWidget === "mithril-vault";

  // გახსნა სხვა მცურავ ვიჯეტს ავტომატურად ხურავს საერთო აქტიური ID-ის შეცვლით.
  const updateOpenState = useCallback((next: boolean) => {
    setActiveWidget(next ? "mithril-vault" : null);
  }, [setActiveWidget]);

  // პანელის გარეთ დაჭერა მხოლოდ მაშინ უსმენს მოვლენას, როცა კალკულატორი გახსნილია.
  useOutsideClick(containerRef, () => updateOpenState(false), isOpen);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-4 z-50 max-[1279px]:hidden"
    >
      <button
        type="button"
        onClick={() => updateOpenState(true)}
        aria-label="Open the Mithril Vault currency calculator"
        aria-expanded={isOpen}
        aria-hidden={isOpen}
        tabIndex={isOpen ? -1 : 0}
        title="Mithril Vault calculator"
        className={`inline-flex h-11 w-11 items-center justify-center border border-gold/60 bg-market-paper text-market-ink shadow-lg transition-all duration-300 hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${isOpen ? "pointer-events-none absolute left-0 top-0 scale-95 opacity-0" : "relative scale-100 opacity-100"}`}
      >
        <VaultMark />
        <span className="sr-only">Mithril Vault</span>
      </button>

      <aside
        aria-label="Mithril Vault currency calculator"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute bottom-0 left-0 origin-bottom-left overflow-x-hidden overflow-y-auto border border-gold/60 bg-market-paper text-market-ink shadow-2xl transition-[transform,opacity] duration-200 ${isOpen ? "w-[calc(100vw-2rem)] max-w-[22rem] translate-y-0 scale-100 opacity-100" : "pointer-events-none w-0 max-w-0 translate-y-1 scale-95 opacity-0"}`}
      >
        <MithrilVaultPanel onClose={() => updateOpenState(false)} />
      </aside>
    </div>
  );
}
