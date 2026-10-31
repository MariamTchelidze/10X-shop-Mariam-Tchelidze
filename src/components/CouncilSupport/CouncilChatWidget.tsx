import { useCallback, useEffect, useRef } from "react";
import { useFloatingWidgets } from "../../context/FloatingWidgetContext";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { CouncilChatPanel } from "./CouncilChatPanel";
import { ElvenLeafMark } from "./ElvenLeafMark";

export function CouncilChatWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeWidget, setActiveWidget } = useFloatingWidgets();
  const isOpen = activeWidget === "council";

  const updateOpenState = useCallback((next: boolean) => {
    setActiveWidget(next ? "council" : null);
  }, [setActiveWidget]);

  useOutsideClick(containerRef, () => updateOpenState(false), isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") updateOpenState(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, updateOpenState]);

  return (
    <div ref={containerRef} className="relative h-12 w-48 shrink-0">
      <div
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`pointer-events-none absolute bottom-0 right-0 z-10 w-[calc(100vw-3rem)] max-w-[22rem] transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
      >
        <CouncilChatPanel onClose={() => updateOpenState(false)} />
      </div>

      {!isOpen && (
        <button
          type="button"
          onClick={() => updateOpenState(true)}
          aria-label="Open The Council of Elrond support"
          aria-expanded={false}
          className="inline-flex h-12 w-full items-center justify-start gap-2 border border-gold/60 bg-market-paper px-4 text-left text-market-ink shadow-lg transition-colors hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold max-lg:hidden"
        >
          <ElvenLeafMark />
          <span className="font-display text-[10px] uppercase tracking-[0.1em] sm:text-xs">Ask the Council</span>
        </button>
      )}
    </div>
  );
}
