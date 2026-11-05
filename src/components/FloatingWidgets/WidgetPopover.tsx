import { useCallback, useRef, type ReactNode } from "react";
import { useWidgets, type WidgetId } from "../../context/WidgetContext";
import { useOutsideClick } from "../../hooks/useOutsideClick";

interface WidgetPopoverProps {
  id: WidgetId;
  label: string;
  icon: string;
  align?: "left" | "right";
  children: ReactNode;
}

export function WidgetPopover({ id, label, icon, align = "right", children }: WidgetPopoverProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { activeWidget, toggleWidget, closeWidget } = useWidgets();
  const isOpen = activeWidget === id;

  const closeOnDesktopOutsideClick = useCallback(() => {
    // მობილურზე პანელი Burger Menu-შია; დოკის გარეთ დაწკაპუნებამ ის არ უნდა დახუროს.
    if (window.matchMedia("(min-width: 1280px)").matches) closeWidget();
  }, [closeWidget]);

  useOutsideClick(rootRef, closeOnDesktopOutsideClick, isOpen);

  return (
    <div ref={rootRef} className="relative flex justify-end">
      {isOpen && (
        <section
          aria-label={label}
          className={`absolute bottom-[calc(100%+0.75rem)] z-40 max-h-[70dvh] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto border border-market-border bg-market-paper text-market-ink shadow-2xl transition duration-200 motion-safe:animate-[toast-in_180ms_ease-out] ${align === "left" ? "left-0 origin-bottom-left" : "right-0 origin-bottom-right"}`}
        >
          <header className="flex items-center justify-between gap-3 border-b border-market-border px-4 py-3">
            <h2 className="font-display text-xs uppercase tracking-[0.14em] text-gold">{label}</h2>
            <button type="button" aria-label={`Close ${label}`} onClick={closeWidget} className="inline-flex h-9 w-9 items-center justify-center text-xl text-market-muted hover:text-market-ink focus-visible:outline-2 focus-visible:outline-gold">×</button>
          </header>
          <div className="p-4">{children}</div>
        </section>
      )}
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => toggleWidget(id)}
        className="inline-flex min-h-12 w-48 items-center justify-start gap-3 border border-market-border bg-market-paper px-4 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-market-ink shadow-lg transition-colors hover:border-gold hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <span aria-hidden="true" className="text-base text-gold">{icon}</span>
        {label}
      </button>
    </div>
  );
}
