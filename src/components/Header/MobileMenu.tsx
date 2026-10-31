import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const { user } = useAuth();
  const location = useLocation();

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setSelectedWidget(null);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [closeMenu, location.pathname, location.search]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [closeMenu, isOpen]);

  const toggleWidget = (widget: FloatingWidgetId) => {
    setSelectedWidget((current) => current === widget ? null : widget);
  };

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        onClick={() => isOpen ? closeMenu() : setIsOpen(true)}
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
            onClick={closeMenu}
            className="fixed inset-0 z-40 cursor-default bg-black/35"
          />
          <aside
            id="mobile-navigation-drawer"
            aria-label="Mobile navigation"
            className="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-market-border bg-market-paper px-5 pb-7 pt-4 text-market-ink shadow-xl sm:px-6"
          >
            <nav aria-label="Account navigation" className="grid border-y border-market-border">
              <Link to={user.isLoggedIn ? "/profile" : "/login"} onClick={closeMenu} className="py-4 text-xs font-medium uppercase tracking-[0.16em]">
                {user.isLoggedIn ? "My Profile" : "Log In / Register"}
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
          </aside>
        </>
      )}
    </>
  );
}
