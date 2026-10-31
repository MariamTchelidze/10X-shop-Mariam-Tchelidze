import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFloatingWidgets } from "../../context/FloatingWidgetContext";
import type { FloatingWidgetId } from "../../types/floatingWidget";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { RealmSelector } from "./RealmSelector";

const widgetActions: { id: FloatingWidgetId; label: string }[] = [
  { id: "eagle-post", label: "Eagle Post" },
  { id: "council", label: "Council of Elrond" },
  { id: "mithril-vault", label: "Mithril Vault Calculator" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { setActiveWidget } = useFloatingWidgets();
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login" || location.pathname.startsWith("/login/");

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const openWidget = (widget: FloatingWidgetId) => {
    setIsOpen(false);
    setActiveWidget(widget);
  };

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-10 w-10 items-center justify-center text-market-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
          {isOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/35"
          />
          <aside
            id="mobile-navigation-drawer"
            aria-label="Mobile navigation"
            className="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-market-border bg-market-paper px-5 pb-7 pt-4 text-market-ink shadow-xl sm:px-6"
          >
            <nav aria-label="Main navigation" className="grid divide-y divide-market-border border-y border-market-border">
              <Link to="/" onClick={() => setIsOpen(false)} className="py-4 text-xs font-medium uppercase tracking-[0.16em]">Catalog</Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="py-4 text-xs font-medium uppercase tracking-[0.16em]">Cart</Link>
              <Link to={user.isLoggedIn ? "/profile" : "/login"} onClick={() => setIsOpen(false)} className="py-4 text-xs font-medium uppercase tracking-[0.16em]">
                {user.isLoggedIn ? "My Profile" : "Log In / Register"}
              </Link>
              {user.isLoggedIn && <Link to="/orders" onClick={() => setIsOpen(false)} className="py-4 text-xs font-medium uppercase tracking-[0.16em]">My Purchases</Link>}
              <Link to="/wishlist" onClick={() => setIsOpen(false)} className="py-4 text-xs font-medium uppercase tracking-[0.16em]">Wishlist</Link>
              <Link to="/help-center" onClick={() => setIsOpen(false)} className="py-4 text-xs font-medium uppercase tracking-[0.16em]">Help &amp; Lore</Link>
            </nav>

            <section className="mt-6" aria-labelledby="mobile-preferences-title">
              <h2 id="mobile-preferences-title" className="mb-3 font-display text-sm uppercase tracking-[0.12em]">Realm preferences</h2>
              <div className="flex flex-wrap items-center justify-between gap-3 border border-market-border p-3">
                <ThemeToggle showLabel />
                <RealmSelector showLabel />
              </div>
            </section>

            {!isLoginRoute && (
              <section className="mt-6" aria-labelledby="mobile-quick-tools-title">
                <h2 id="mobile-quick-tools-title" className="mb-3 font-display text-sm uppercase tracking-[0.12em]">Market tools</h2>
                <div className="grid gap-2">
                  {widgetActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => openWidget(action.id)}
                      className="min-h-11 border border-market-border px-3 text-left text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-gold hover:bg-market-surface focus-visible:outline-2 focus-visible:outline-gold"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </>
      )}
    </>
  );
}
