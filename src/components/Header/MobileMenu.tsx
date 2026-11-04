// მობილური ნავიგაციის სრულეკრანიან მენიუსა და ვიჯეტების პანელებს მართავს.
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { FloatingWidgetId } from "../../types/floatingWidget";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { RealmSelector } from "./RealmSelector";
import { MobileWidgetPanel } from "./MobileWidgetPanel";

const widgetActions: { id: FloatingWidgetId; label: string }[] = [
  { id: "eagle-post", label: "Eagle Post" },
  { id: "mithril-vault", label: "Mithril Vault Calculator" },
  { id: "council", label: "Ask The Council" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<FloatingWidgetId | null>(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // მისამართი იცვლება და გვერდით მენიუსთან ერთად ღია ვიჯეტსაც ვხურავთ.
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setSelectedWidget(null);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [closeMenu, location.pathname, location.search]);

  useEffect(() => {
    if (!isOpen) return;
    // მენიუს გახსნისას უკანა გვერდს ვკეტავთ; Escape მენიუს ხურავს.
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [closeMenu, isOpen]);

  const toggleWidget = (widget: FloatingWidgetId) => {
    // იმავე ვიჯეტზე დაჭერა ხურავს მას, სხვა ვიჯეტზე დაჭერა კი მას ხსნის.
    setSelectedWidget((current) => current === widget ? null : widget);
  };

  // Մենյուից դուրս գալուց հետո guest-ին կատալոգ ենք տանում՝ պահպանելով զամբյուղը։
  const handleLogout = (): void => {
    logout();
    closeMenu();
    navigate("/", { replace: true });
  };

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        onClick={() => isOpen ? closeMenu() : setIsOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center text-market-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
          {isOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>

      {isOpen && (
        <aside
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-[60] h-[100dvh] w-screen max-w-none overflow-y-auto overscroll-contain bg-market-paper px-5 pb-7 pt-[max(1rem,env(safe-area-inset-top))] text-market-ink sm:px-6"
        >
          <div className="mx-auto flex min-h-12 max-w-2xl items-center justify-between border-b border-market-border pb-3">
            <span className="font-display text-xs uppercase tracking-[0.16em]">Middle-earth Market</span>
            <button type="button" aria-label="Close navigation menu" onClick={closeMenu} className="inline-flex h-11 w-11 items-center justify-center text-2xl text-market-ink focus-visible:outline-2 focus-visible:outline-gold">×</button>
          </div>
          <div className="mx-auto max-w-2xl">
            <nav aria-label="Account navigation" className="grid border-y border-market-border">
              <Link
                to={user.isLoggedIn ? "/profile" : "/login"}
                onClick={closeMenu}
                aria-current={location.pathname === (user.isLoggedIn ? "/profile" : "/login") ? "page" : undefined}
                className={`py-4 text-xs font-medium uppercase tracking-[0.16em] ${location.pathname === (user.isLoggedIn ? "/profile" : "/login") ? "text-market-ink underline decoration-gold underline-offset-8" : "text-market-muted"}`}
              >
                {user.isLoggedIn ? "My Profile" : "Log In / Register"}
              </Link>
              {user.isLoggedIn && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="border-t border-market-border py-4 text-left text-xs font-medium uppercase tracking-[0.16em] text-market-muted transition-colors hover:text-market-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  Sign out
                </button>
              )}
              <Link
                to="/"
                onClick={closeMenu}
                aria-current={location.pathname === "/" ? "page" : undefined}
                className={`border-t border-market-border py-4 text-xs font-medium uppercase tracking-[0.16em] ${location.pathname === "/" ? "text-market-ink underline decoration-gold underline-offset-8" : "text-market-muted"}`}
              >
                Catalog
              </Link>
              <Link
                to="/cart"
                onClick={closeMenu}
                aria-current={location.pathname === "/cart" ? "page" : undefined}
                className={`border-t border-market-border py-4 text-xs font-medium uppercase tracking-[0.16em] ${location.pathname === "/cart" ? "text-market-ink underline decoration-gold underline-offset-8" : "text-market-muted"}`}
              >
                Cart
              </Link>
            </nav>

            <section className="mt-5" aria-label="Theme controller">
              <ThemeToggle showLabel />
            </section>

            <section className="mt-5 grid gap-2" aria-label="Middle-earth widgets">
              {widgetActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  aria-expanded={selectedWidget === action.id}
                  aria-controls="mobile-widget-panel"
                  onClick={() => toggleWidget(action.id)}
                  className="flex min-h-11 items-center justify-between border border-market-border px-3 text-left text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-gold hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-gold"
                >
                  {action.label}<span aria-hidden="true">{selectedWidget === action.id ? "−" : "+"}</span>
                </button>
              ))}
              <MobileWidgetPanel widget={selectedWidget} onClose={() => setSelectedWidget(null)} />
            </section>

            <section className="mt-5 border-t border-market-border pt-4" aria-label="Realm and currency selector">
              <RealmSelector showLabel />
            </section>
          </div>
        </aside>
      )}
    </>
  );
}
