// სათაურის ნავიგაციას, ანგარიშის მოქმედებებსა და საყიდლების ჩანთის წვდომას აერთიანებს.
import { useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { useWishlist } from "../../context/WishlistContext";
import { RealmSelector } from "./RealmSelector";
import { MobileMenu } from "./MobileMenu";
import { ShoppingAccessPrompt } from "./ShoppingAccessPrompt";


// საიტის ძირითადი კატეგორიების სია შესაბამისი ფილტრაციის პარამეტრებით.
const categoryLinks = [
  { label: "APPAREL", category: "womens-dresses" },
  { label: "ACCESSORIES", category: "womens-bags" },
  { label: "HOME & LIVING", category: "home-decoration" },
  { label: "COLLECTIBLES", query: "watch" },
] as const;

// მიმდინარე მისამართის ზედმეტ ფილტრებს შლის და არჩეულ კატეგორიას თავიდან იწყებს.
function getCategoryHref(pathname: string, search: string, categoryLink: (typeof categoryLinks)[number]): string {
  const params = new URLSearchParams(pathname === "/" ? search : "");
  params.delete("q");
  params.delete("category");
  if ("category" in categoryLink) params.set("category", categoryLink.category);
  else params.set("q", categoryLink.query);
  params.set("page", "1");
  return `/?${params.toString()}`;
}

// კატეგორიების ნავიგაციის კომპონენტი, რომელიც აგენერირებს და აფერადებს აქტიურ ბმულებს.
function CategoryLinks() {
  const location = useLocation();
  const currentParams = new URLSearchParams(location.search);

  // URL-ის პარამეტრით ვადგენთ აქტიურ კატეგორიას და შესაბამის ბმულებს ვხატავთ.
  return (
    <nav
      aria-label="Shop by category"
      className="flex flex-wrap items-center gap-x-5 gap-y-1 lg:gap-x-7"
    >
      <Link
        to="/"
        aria-current={location.pathname === "/" && !currentParams.has("q") && !currentParams.has("category") ? "page" : undefined}
        className={`inline-flex min-h-11 shrink-0 items-center border-b-2 text-[10px] font-medium tracking-[0.16em] transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-market-ink sm:text-xs ${location.pathname === "/" && !currentParams.has("q") && !currentParams.has("category") ? "border-market-ink text-market-ink" : "border-transparent text-market-muted"}`}
      >
        CATALOG
      </Link>
      {categoryLinks.map((category) => {

        // ამოწმებს არის თუ არა მოცემული კატეგორია ამჟამად არჩეული.
        const isActive =
          location.pathname === "/" &&
          (("category" in category && currentParams.get("category") === category.category) ||
            ("query" in category && currentParams.get("q") === category.query));

            // თითოეული კატეგორიისთვის არენდერებს შესაბამის ბმულს.
        return (
          <Link
            key={category.label}
            to={getCategoryHref(location.pathname, location.search, category)}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center border-b-2 text-[10px] font-medium tracking-[0.16em] transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-market-ink sm:text-xs ${isActive ? "border-market-ink text-market-ink" : "border-transparent text-market-muted"}`}
          >
            {category.label}
          </Link>
        );
      })}
    </nav>
  );
}

// ჰედერის მთავარი კომპონენტი, რომელიც მართავს მობილურ და დესკტოპ მენიუებს, ძიებასა და ავტორიზაციას.
export function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [requestedDestination, setRequestedDestination] = useState<"/wishlist" | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // ადგენს გამოსატან მომხმარებლის სახელს პრიორიტეტების მიხედვით.
  const displayName = user.fullName || user.email || user.username;

  // მთავარ გვერდზე ძიებას ფოკუსს ვაძლევთ, სხვა გვერდიდან კი კატალოგზე გადავდივართ.
  const handleSearchClick = (): void => {
    if (location.pathname === "/") {
      document.getElementById("catalog-search")?.focus();
      return;
    }

    navigate("/", { state: { focusSearch: true } });
  };

  // Logout-ის შემდეგ მომხმარებელს საჯარო კატალოგზე ვაბრუნებთ და კალათას ვინარჩუნებთ.
  const handleLogout = (): void => {
    logout();
    navigate("/", { replace: true });
  };


  // ამოწმებს მომხმარებლის ავტორიზაციას და სტუმრის შემთხვევაში ხსნის შესვლის შეტყობინებას.
  const guardWishlistLink = () =>
    (event: MouseEvent<HTMLAnchorElement>): void => {
      // სტუმრის შემთხვევაში გვერდზე გადასვლის ნაცვლად შესვლის შეტყობინებას ვხსნით.
      if (user.isLoggedIn) return;
      event.preventDefault();
      setRequestedDestination("/wishlist");
    };

  // მობილურსა და დიდ ეკრანზე სათაურის შესაბამის განლაგებას ვაჩვენებთ.
  return (
    <header className="sticky top-0 z-50 border-b border-market-border bg-market-paper">

      {/* მობილური მოწყობილობების ჰედერის განლაგება ლოგოთი და სწრაფი ღილაკებით. */}
      <div className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 min-[1280px]:hidden">
        <div className="flex min-w-0 items-center gap-1">

          {/* მთავარ გვერდზე გადამსვლელი ლოგო მობილურისთვის. */}
          <Link to="/" aria-label="10X Shop home" className="inline-flex shrink-0 items-center gap-2 rounded-full transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink">
            <picture>
              <source srcSet="/images/Logo-display.webp" type="image/webp" />
              <img src="/images/Logo-display.jpg" alt="" width={128} height={128} decoding="async" className="h-10 w-10 object-contain sm:h-11 sm:w-11" />
            </picture>
            <span className="whitespace-nowrap font-display text-[10px] font-semibold tracking-[0.14em] text-market-ink sm:text-xs">10X SHOP</span>
          </Link>
          {/* კალათის გვერდზე გადასვლის ღილაკი რაოდენობის მაჩვენებლით. */}
          <Link
            to="/cart"
            aria-label={itemCount > 0 ? `Shopping bag, ${itemCount} items` : "Shopping bag"}
            aria-current={location.pathname === "/cart" ? "page" : undefined}
            className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center border-b-2 text-market-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${location.pathname === "/cart" ? "border-market-ink" : "border-transparent"}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8h14l1 13H4L5 8Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            {itemCount > 0 && <span className="absolute right-0 top-0 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-market-ink px-1 text-[9px] leading-none text-market-paper">{itemCount}</span>}
          </Link>
          {/* სურვილების სიის ღილაკი შესაბამისი რაოდენობის ბეჯით. */}
          <Link
            to="/wishlist"
            onClick={guardWishlistLink()}
            aria-label={wishlistItems.length > 0 ? `Wishlist, ${wishlistItems.length} items` : "Wishlist"}
            className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center text-market-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
            {wishlistItems.length > 0 && <span className="absolute right-0 top-0 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-market-ink px-1 text-[9px] leading-none text-market-paper">{wishlistItems.length}</span>}
          </Link>
        </div>

        {/* მობილური მენიუს გამომწვევი კომპონენტი. */}
        <MobileMenu />
      </div>

{/* დიდი ეკრანების (დესკტოპის) ბადეზე დაფუძნებული განლაგება. */}
      <div className="mx-auto hidden min-h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:px-6 min-[1280px]:grid lg:min-h-20 lg:px-10">
        <div className="min-w-0">
          {/* დესკტოპ ვერსიისთვის კატეგორიების ჩვენება. */}
          <div className="hidden lg:block">
            <CategoryLinks />
          </div>
          {/* საძიებო ღილაკი საშუალო ზომის ეკრანებისთვის. */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="inline-flex min-h-11 items-center text-[10px] font-medium tracking-[0.14em] text-market-muted transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink sm:text-xs lg:hidden"
          >
            SEARCH
          </button>
        </div>
    {/* შუა ნაწილში განთავსებული მთავარი ლოგო. */}
        <Link
          to="/"
          aria-label="10X Shop home"
          className="inline-flex items-center justify-self-center gap-2 whitespace-nowrap rounded-full transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink"
        >
          <picture>
            <source srcSet="/images/Logo-display.webp" type="image/webp" />
            <img
              src="/images/Logo-display.jpg"
              alt=""
              width={128}
              height={128}
              decoding="async"
              className="h-11 w-11 object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14"
            />
          </picture>
          <span className="font-display text-xs font-semibold tracking-[0.16em] text-market-ink lg:text-sm">10X SHOP</span>
        </Link>

{/* მარჯვენა მხარეს განთავსებული ძიების, ავტორიზაციის და კალათის მართვის ელემენტები. */}
        <div className="flex items-center justify-self-end gap-2 sm:gap-4 lg:gap-6">
          <button
            type="button"
            onClick={handleSearchClick}
            className="hidden min-h-11 items-center text-xs font-medium tracking-[0.12em] text-market-muted transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink lg:inline-flex"
          >
            SEARCH
          </button>
          {/* ავტორიზაციის სტატუსის მიხედვით პროფილი ან შესვლის ღილაკი. */}
          {user.isLoggedIn ? (
            <>
              <Link
                to="/profile"
                aria-label={`Profile for ${displayName}`}
                aria-current={location.pathname === "/profile" ? "page" : undefined}
                className={`inline-flex min-h-11 max-w-12 items-center truncate border-b-2 text-[10px] font-medium tracking-[0.12em] transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink sm:max-w-32 sm:text-xs ${location.pathname === "/profile" ? "border-market-ink text-market-ink" : "border-transparent text-market-muted"}`}
              >
                {displayName || "PROFILE"}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-11 items-center text-[10px] font-medium tracking-[0.12em] text-market-muted transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink sm:text-xs"
              >
                LOG OUT
              </button>
            </>
          ) : (
            <Link
              to="/login"
              aria-current={location.pathname === "/login" ? "page" : undefined}
              className={`inline-flex min-h-11 items-center border-b-2 px-1 pb-1 text-[10px] font-medium tracking-[0.12em] transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink sm:text-xs ${location.pathname === "/login" ? "border-market-ink text-market-ink" : "border-transparent text-market-muted"}`}
            >
              LOG IN
            </Link>
          )}
          {/* რეგიონების ასარჩევი კომპონენტი. */}
          <RealmSelector />
          <Link
            to="/wishlist"
            onClick={guardWishlistLink()}
            aria-label={wishlistItems.length > 0 ? `Wishlist, ${wishlistItems.length} items` : "Wishlist"}
            aria-current={location.pathname === "/wishlist" ? "page" : undefined}
            className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center border-b-2 transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-market-ink ${location.pathname === "/wishlist" ? "border-market-ink text-market-ink" : "border-transparent text-market-muted"}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
            {wishlistItems.length > 0 && <span className="absolute right-0 top-0 min-w-4 text-center text-[9px] text-market-ink">{wishlistItems.length}</span>}
          </Link>
          <Link
            to="/cart"
            aria-label={itemCount > 0 ? `Bag, ${itemCount} items` : "Bag"}
            aria-current={location.pathname === "/cart" ? "page" : undefined}
            className={`inline-flex min-h-11 items-center gap-1.5 border-b-2 text-[10px] font-medium tracking-[0.12em] transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink sm:text-xs ${location.pathname === "/cart" ? "border-market-ink text-market-ink" : "border-transparent text-market-muted"}`}
          >
            BAG
            <span className="inline-flex min-w-4 justify-center text-market-ink">
              {itemCount > 0 ? itemCount : ""}
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
      {requestedDestination && <ShoppingAccessPrompt destination={requestedDestination} onClose={() => setRequestedDestination(null)} />}
    </header>
  );
}
