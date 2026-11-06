import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { MobileMenu } from "../Header/MobileMenu";

// მობილურის ფიქსირებულ ქვედა ზოლში ოთხ მთავარ დანიშნულებას აჩვენებს.
export function BottomNav() {
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // ძიება არსებულ ველს ფოკუსს აძლევს და URL-ზე დაფუძნებულ ფილტრაციას უცვლელად ტოვებს.
  const focusCatalogSearch = (): void => {
    if (location.pathname === "/") {
      document.getElementById("catalog-search")?.focus();
      document.getElementById("catalog-search")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    navigate("/", { state: { focusSearch: true } });
  };

  const isCatalogActive = location.pathname === "/";

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-market-border bg-market-paper/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 text-market-ink shadow-[0_-4px_18px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"
    >
      <Link
        to="/"
        aria-label="Home, catalog"
        aria-current={isCatalogActive && !location.search ? "page" : undefined}
        className={`flex min-h-12 flex-col items-center justify-center gap-1 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-gold ${isCatalogActive ? "text-market-ink" : "text-market-muted"}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />
          <path d="M12 14v7" />
        </svg>
        <span className="text-[9px] uppercase tracking-[0.1em]">Home</span>
      </Link>

      <button
        type="button"
        onClick={focusCatalogSearch}
        aria-label="Search the catalog"
        aria-current={location.pathname === "/" && location.search.includes("q=") ? "page" : undefined}
        className="flex min-h-12 flex-col items-center justify-center gap-1 text-market-muted focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-gold"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10.8" cy="10.8" r="6.6" />
          <path d="m16 16 4.5 4.5M8.2 10.8h5.2M10.8 8.2v5.2" />
        </svg>
        <span className="text-[9px] uppercase tracking-[0.1em]">Search</span>
      </button>

      <Link
        to="/cart"
        aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}
        aria-current={location.pathname === "/cart" ? "page" : undefined}
        className={`relative flex min-h-12 flex-col items-center justify-center gap-1 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-gold ${location.pathname === "/cart" ? "text-market-ink" : "text-market-muted"}`}
      >
        <span className="relative inline-flex">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8h14l1 13H4L5 8Z" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          </svg>
          {itemCount > 0 && <span aria-hidden="true" className="absolute -right-2 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-market-ink px-1 text-[9px] leading-none text-market-paper">{itemCount}</span>}
        </span>
        <span className="text-[9px] uppercase tracking-[0.1em]">Cart</span>
      </Link>

      <MobileMenu triggerVariant="account" />
    </nav>
  );
}
