// სტუმარს კალათისა და სურვილების სიის სანახავად შესვლას სთავაზობს.
import { useEffect, type MouseEvent } from "react";
import { Link } from "react-router-dom";

interface ShoppingAccessPromptProps {
  destination: "/cart" | "/wishlist";
  onClose: () => void;
}

export function ShoppingAccessPrompt({ destination, onClose }: ShoppingAccessPromptProps) {
  useEffect(() => {
    // შეტყობინების გახსნისას უკანა გვერდს ვკეტავთ და Escape-ით დახურვას ვამატებთ.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const closeOnBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    // შეტყობინების გარე ფენაზე დაჭერა ხურავს ფანჯარას.
    if (event.target === event.currentTarget) onClose();
  };

  const returnState = { from: destination };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={closeOnBackdrop}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="shopping-access-title" className="relative w-full max-w-md border border-gold/60 bg-market-paper p-6 text-market-ink shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close sign-in prompt" className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center text-xl text-market-muted hover:text-market-ink focus-visible:outline-2 focus-visible:outline-gold">×</button>
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold">The market awaits</p>
        <h2 id="shopping-access-title" className="mt-3 pr-8 font-display text-2xl">Sign in to continue</h2>
        <p className="mt-4 text-sm leading-6 text-market-muted">To check your bag or wishlist, please sign in or register first.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link to="/login" state={returnState} className="inline-flex min-h-12 items-center justify-center bg-market-ink px-5 text-center text-xs font-medium uppercase tracking-[0.12em] text-market-paper transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
            Sign in
          </Link>
          <Link to="/login?mode=register" state={returnState} className="inline-flex min-h-12 items-center justify-center border border-market-border px-5 text-center text-xs font-medium uppercase tracking-[0.12em] text-market-ink transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
            Register
          </Link>
        </div>
      </section>
    </div>
  );
}
