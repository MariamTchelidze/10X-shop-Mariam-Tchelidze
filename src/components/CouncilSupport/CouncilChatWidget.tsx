import { useCallback, useEffect, useRef, useState } from "react";
import { CouncilChatPanel } from "./CouncilChatPanel";
import { ElvenLeafMark } from "./ElvenLeafMark";

const OPEN_KEY = "middle-market-council-chat-open";

function readInitialOpenState(): boolean {
  try {
    return localStorage.getItem(OPEN_KEY) === "true";
  } catch {
    return false;
  }
}

export function CouncilChatWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(readInitialOpenState);

  const updateOpenState = useCallback((next: boolean) => {
    setIsOpen(next);
    try {
      localStorage.setItem(OPEN_KEY, String(next));
    } catch {
      // Keep the widget interactive for this session if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        updateOpenState(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") updateOpenState(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, updateOpenState]);

  return (
    <div ref={containerRef} className="w-full">
      <div
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${isOpen ? "mb-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className={`origin-bottom-right transition-transform duration-300 ${isOpen ? "translate-y-0 scale-100" : "translate-y-2 scale-95"}`}>
            <CouncilChatPanel onClose={() => updateOpenState(false)} />
          </div>
        </div>
      </div>

      {!isOpen && (
        <button
          type="button"
          onClick={() => updateOpenState(true)}
          aria-label="Open The Council of Elrond support"
          aria-expanded={false}
          className="inline-flex min-h-12 w-full items-center justify-start gap-2 border border-gold/60 bg-market-paper px-4 text-left text-market-ink shadow-lg transition-colors hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <ElvenLeafMark />
          <span className="font-display text-[10px] uppercase tracking-[0.1em] sm:text-xs">Ask the Council</span>
        </button>
      )}
    </div>
  );
}
