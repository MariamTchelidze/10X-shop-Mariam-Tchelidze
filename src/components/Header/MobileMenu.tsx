// მობილური ნავიგაციის სრულეკრანიან მენიუსა და ვიჯეტების პანელებს მართავს.
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuth } from "../../context/AuthContext";
import { useWidgets, type WidgetId } from "../../context/WidgetContext";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { RealmSelector } from "./RealmSelector";
import { CouncilPanel, EaglePostPanel, VaultCalculatorPanel, WidgetPanelLoader } from "../FloatingWidgets/WidgetPanelLoader";

const widgetActions: { id: WidgetId; label: string; icon: string }[] = [
  { id: "eagle-post", label: "Eagle Post", icon: "⌁" },
  { id: "mithril-vault", label: "Mithril Vault", icon: "◉" },
  { id: "council", label: "Ask the Council", icon: "❧" },
];

interface MobileMenuProps {
  triggerVariant?: "menu" | "account";
}

export function MobileMenu({ triggerVariant = "menu" }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { activeWidget, toggleWidget, closeWidget } = useWidgets();

  // მისამართის შეცვლისას მობილურ მენიუს ვხურავთ.
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    closeWidget();
  }, [closeWidget]);

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

  // მენიუდან გასვლისას მომხმარებელი კატალოგზე გადაგვყავს და კალათას ვინარჩუნებთ.
  const handleLogout = (): void => {
    logout();
    closeMenu();
    navigate("/", { replace: true });
  };

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close account and settings" : triggerVariant === "account" ? "Open account and settings" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        onClick={() => isOpen ? closeMenu() : setIsOpen(true)}
        className={`inline-flex min-h-11 min-w-11 items-center justify-center text-market-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${triggerVariant === "account" ? "h-full w-full flex-col gap-1" : "h-11 w-11"}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {triggerVariant === "account" ? <><circle cx="12" cy="8" r="3.25" /><path d="M5.5 20c.4-3.4 2.7-5.2 6.5-5.2s6.1 1.8 6.5 5.2" /><path d="M19.5 4.5c.4 1.2.4 2.2 0 3.2" /></> : isOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
        {triggerVariant === "account" && <span className="text-[9px] uppercase tracking-[0.1em]">Account</span>}
      </button>

      {isOpen && createPortal(
        <aside
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={triggerVariant === "account" ? "Account and settings" : "Mobile navigation"}
          className="fixed inset-0 z-[60] h-[100dvh] w-screen max-w-none overflow-y-auto overscroll-contain bg-market-paper px-5 pb-7 pt-[max(1rem,env(safe-area-inset-top))] text-market-ink sm:px-6"
        >
          <div className="mx-auto flex min-h-12 max-w-2xl items-center justify-between border-b border-market-border pb-3">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.16em]">10X SHOP</span>
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
                BAG
              </Link>
            </nav>

            <section className="mt-5" aria-label="Theme controller">
              <ThemeToggle showLabel />
            </section>

            <section className="mt-5 border-t border-market-border pt-4" aria-label="Realm and currency selector">
              <RealmSelector showLabel />
            </section>

            {location.pathname !== "/login" && (
              <section className="mt-5 border-t border-market-border pt-4" aria-label="Realm tools">
                <h2 className="mb-3 font-display text-xs uppercase tracking-[0.16em] text-gold">Realm tools</h2>
                <div className="grid gap-2 sm:grid-cols-3">
                  {widgetActions.map((widget) => (
                    <button
                      key={widget.id}
                      type="button"
                      aria-expanded={activeWidget === widget.id}
                      onClick={() => toggleWidget(widget.id)}
                      className={`flex min-h-12 items-center gap-3 border px-3 text-left text-xs uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${activeWidget === widget.id ? "border-gold bg-market-surface text-market-ink" : "border-market-border text-market-muted hover:text-market-ink"}`}
                    >
                      <span aria-hidden="true" className="text-base text-gold">{widget.icon}</span>
                      {widget.label}
                    </button>
                  ))}
                </div>
                {activeWidget && (
                  <div className="mt-4 border border-market-border bg-market-paper p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-market-muted">Widget panel</span>
                      <button type="button" onClick={closeWidget} className="inline-flex h-10 w-10 items-center justify-center text-xl text-market-muted hover:text-market-ink focus-visible:outline-2 focus-visible:outline-gold" aria-label="Close widget panel">×</button>
                    </div>
                    <WidgetPanelLoader>
                      {activeWidget === "eagle-post" && <EaglePostPanel />}
                      {activeWidget === "council" && <CouncilPanel />}
                      {activeWidget === "mithril-vault" && <VaultCalculatorPanel />}
                    </WidgetPanelLoader>
                  </div>
                )}
              </section>
            )}
          </div>
        </aside>,
        document.body,
      )}
    </>
  );
}
