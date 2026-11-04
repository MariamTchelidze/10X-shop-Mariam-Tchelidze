// 1. იმპორტები და ჰუკები (Imports & Hooks)
import { useCallback, useEffect, useRef } from "react";
import { useFloatingWidgets } from "../../context/FloatingWidgetContext";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { CouncilChatPanel } from "./CouncilChatPanel";
import { ElvenLeafMark } from "./ElvenLeafMark";


// 2. ძირითადი კომპონენტი (CouncilChatWidget)
export function CouncilChatWidget() {
  // ვქმნით რეფს კონტეინერისთვის, რათა დავადგინოთ კლიკი მის გარეთ გასულა თუ არა.
  const containerRef = useRef<HTMLDivElement>(null);

  // გლობალური კონტექსტიდან ვითხოვთ აქტიური ვიჯეტის მართვის ფუნქციებს.
  const { activeWidget, setActiveWidget } = useFloatingWidgets();

  // ვამოწმებთ, გახსნილია თუ არა ამჟამად კონკრეტულად „Council“ ვიჯეტი.
  const isOpen = activeWidget === "council";

  // 3. მდგომარეობის მართვის ლოგიკა (State Handlers)

  // მემორიზებული ფუნქცია ცვლის ვიჯეტის ღია/დახურულ სტატუსს გლობალურ კონტექსტში.
  const updateOpenState = useCallback((next: boolean) => {
    setActiveWidget(next ? "council" : null);
  }, [setActiveWidget]);

  // ვიყენებთქასთომ ჰუკს: კვირტზე გარეთ დაკლიკებისას ვიჯეტი ავტომატურად იხურება.
  useOutsideClick(containerRef, () => updateOpenState(false), isOpen);

  // ეფექტი უზრუნველყოფს Escape ღილაკით ვიჯეტის დახურვას მხოლოდ მაშინ, როცა ის ღიაა.
  useEffect(() => {
    // Escape ღილაკი ღია პანელს ხურავს; listener მხოლოდ გახსნილ მდგომარეობაში არსებობს.
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") updateOpenState(false);
    };

    // ქლიანაპ ფუნქცია შლის ლისენერს კომპონენტის დახურვისას.
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, updateOpenState]);


  // 4. ვიზუალური რენდერი (JSX UI Layout)
  return (
    <div ref={containerRef} className="relative h-12 w-48 shrink-0">

      {/* ანიმაციური პანელი, რომელიც იხსნება ღილაკზე დაჭერისას. */}
      <div
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`pointer-events-none absolute bottom-0 right-0 z-10 w-[calc(100vw-3rem)] max-w-[22rem] transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
      >
        <CouncilChatPanel onClose={() => updateOpenState(false)} />
      </div>

{/* საწყისი ღილაკი, რომელიც ჩანს ვიჯეტის დახურულ მდგომარეობაში. */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => updateOpenState(true)}
          aria-label="Open The Council of Elrond support"
          aria-expanded={false}
          className="inline-flex h-12 w-full items-center justify-start gap-2 border border-gold/60 bg-market-paper px-4 text-left text-market-ink shadow-lg transition-colors hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold max-[1024px]:hidden"
        >
          <ElvenLeafMark />
          <span className="font-display text-[10px] uppercase tracking-[0.1em] sm:text-xs">Ask the Council</span>
        </button>
      )}
    </div>
  );
}
