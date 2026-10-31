import { useEffect, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(readInitialOpenState);

  const updateOpenState = (next: boolean) => {
    setIsOpen(next);
    try {
      localStorage.setItem(OPEN_KEY, String(next));
    } catch {
      // Keep the widget interactive for this session if storage is unavailable.
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") updateOpenState(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => updateOpenState(true)}
        aria-label="Open The Council of Elrond support"
        aria-expanded={isOpen}
        aria-hidden={isOpen}
        tabIndex={isOpen ? -1 : 0}
        className={`fixed bottom-24 right-6 z-50 inline-flex min-h-12 items-center gap-2 border border-gold/60 bg-market-paper px-4 text-market-ink shadow-lg transition-all duration-300 hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold max-sm:bottom-20 max-sm:right-4 sm:bottom-[19rem] ${isOpen ? "pointer-events-none translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        <ElvenLeafMark />
        <span className="font-display text-[10px] uppercase tracking-[0.1em] sm:text-xs">Ask the Council</span>
      </button>

      <div
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed bottom-[19rem] right-6 z-50 max-h-[calc(100dvh-20rem)] w-[calc(100vw-2rem)] max-w-[22rem] origin-bottom-right overflow-y-auto transition-all duration-300 ease-out motion-reduce:transition-none max-sm:bottom-20 max-sm:right-4 max-sm:max-h-[calc(100dvh-7rem)] ${isOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0"}`}
      >
        <CouncilChatPanel onClose={() => updateOpenState(false)} />
      </div>
    </>
  );
}
