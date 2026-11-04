// Eagle Post-ის მცურავი ღილაკისა და პანელის მდგომარეობას მართავს.
import { useRef } from "react";
import { useFloatingWidgets } from "../../context/FloatingWidgetContext";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { EagleMark, EaglePostPanel } from "./EaglePostPanel";

export function EaglePostWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeWidget, setActiveWidget } = useFloatingWidgets();
  const isOpen = activeWidget === "eagle-post";
  // გახსნის მდგომარეობა საერთო კონტექსტში ინახება სხვა ვიჯეტებთან კოორდინაციისთვის.
  const setIsOpen = (open: boolean) => setActiveWidget(open ? "eagle-post" : null);

  useOutsideClick(containerRef, () => setIsOpen(false), isOpen);

  if (!isOpen) {
    return (
      <div ref={containerRef} className="group relative h-11 w-11 shrink-0">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Eagle Post newsletter"
          title="Eagle Post"
          className="inline-flex h-11 w-11 items-center justify-center border border-gold/60 bg-market-paper text-market-ink shadow-lg transition-colors hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold max-[1279px]:hidden"
        >
          <EagleMark />
          <span className="sr-only">Eagle Post</span>
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-11 w-11 shrink-0">
      <aside aria-label="Eagle Post newsletter" className="absolute bottom-0 right-0 w-[calc(100vw-3rem)] max-w-[22rem]">
        <EaglePostPanel onClose={() => setIsOpen(false)} />
      </aside>
    </div>
  );
}
