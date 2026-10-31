import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

const categoryLinks = [
  { label: "APPAREL", category: "womens-dresses" },
  { label: "ACCESSORIES", category: "womens-bags" },
  { label: "HOME & LIVING", category: "home-decoration" },
  { label: "COLLECTIBLES", query: "watch" },
] as const;

function getCategoryHref(pathname: string, search: string, categoryLink: (typeof categoryLinks)[number]): string {
  const params = new URLSearchParams(pathname === "/" ? search : "");
  params.delete("q");
  params.delete("category");
  if ("category" in categoryLink) params.set("category", categoryLink.category);
  else params.set("q", categoryLink.query);
  params.set("page", "1");
  return `/?${params.toString()}`;
}

function CategoryLinks({ mobile = false }: { mobile?: boolean }) {
  const location = useLocation();
  const currentParams = new URLSearchParams(location.search);

  return (
    <nav
      aria-label="Shop by category"
      className={`flex items-center ${mobile ? "w-max gap-7 px-4" : "gap-5 lg:gap-7"}`}
    >
      {categoryLinks.map((category) => {
        const isActive =
          location.pathname === "/" &&
          (("category" in category && currentParams.get("category") === category.category) ||
            ("query" in category && currentParams.get("q") === category.query));

        return (
          <Link
            key={category.label}
            to={getCategoryHref(location.pathname, location.search, category)}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex min-h-10 shrink-0 items-center border-b-2 text-[10px] font-medium tracking-[0.16em] transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-market-ink sm:text-xs ${isActive ? "border-market-ink text-market-ink" : "border-transparent text-market-muted"}`}
          >
            {category.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const displayName = user.fullName || user.email || user.username;

  const handleSearchClick = (): void => {
    if (location.pathname === "/") {
      document.getElementById("catalog-search")?.focus();
      return;
    }

    navigate("/", { state: { focusSearch: true } });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-market-border bg-market-paper">
      <div className="mx-auto grid min-h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:px-6 lg:min-h-20 lg:px-10">
        <div className="min-w-0">
          <div className="hidden lg:block">
            <CategoryLinks />
          </div>
          <button
            type="button"
            onClick={handleSearchClick}
            className="text-[10px] font-medium tracking-[0.14em] text-market-muted transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink sm:text-xs lg:hidden"
          >
            SEARCH
          </button>
        </div>

        <Link
          to="/"
          aria-label="Middle-earth Market home"
          className="justify-self-center rounded-full transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink"
        >
          <img
            src="/images/Logo.png"
            alt="Middle-earth Market"
            width={1254}
            height={1254}
            className="h-11 w-11 object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14"
          />
        </Link>

        <div className="flex items-center justify-self-end gap-2 sm:gap-4 lg:gap-6">
          <button
            type="button"
            onClick={handleSearchClick}
            className="hidden text-xs font-medium tracking-[0.12em] text-market-muted transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink lg:inline-flex"
          >
            SEARCH
          </button>
          {user.isLoggedIn ? (
            <Link
              to="/profile"
              aria-label={`Profile for ${displayName}`}
              className="max-w-20 truncate text-[10px] font-medium tracking-[0.12em] text-market-muted transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink sm:max-w-32 sm:text-xs"
            >
              {displayName || "PROFILE"}
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-[10px] font-medium tracking-[0.12em] text-market-muted transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink sm:text-xs"
            >
              LOG IN
            </Link>
          )}
          <Link
            to="/cart"
            aria-label={itemCount > 0 ? `Bag, ${itemCount} items` : "Bag"}
            className="inline-flex min-h-10 items-center gap-1.5 text-[10px] font-medium tracking-[0.12em] text-market-muted transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink sm:text-xs"
          >
            BAG
            <span className="inline-flex min-w-4 justify-center text-market-ink">
              {itemCount > 0 ? itemCount : ""}
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="overflow-x-auto border-t border-market-border lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <CategoryLinks mobile />
      </div>
    </header>
  );
}
