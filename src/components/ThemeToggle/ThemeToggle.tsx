// თემას ცვლის, არჩევანს ინახავს და გვერდის სხვა ნაწილებს ცვლილებას ატყობინებს.
import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "10x-shop-theme";

function isDarkTheme(): boolean {
  return document.documentElement.classList.contains("dark");
}

interface ThemeToggleProps {
  showLabel?: boolean;
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(isDarkTheme);

  useEffect(() => {
    // თუ თემის სხვა ღილაკმა ფერი შეცვალა, ამ ღილაკის მდგომარეობასაც ვაახლებთ.
    const syncThemeState = () => setIsDark(isDarkTheme());
    window.addEventListener("theme-change", syncThemeState);
    return () => window.removeEventListener("theme-change", syncThemeState);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    // HTML კლასის შეცვლა CSS თემას აახლებს, არჩევანი კი შემდეგი ვიზიტისთვის ინახება.
    document.documentElement.classList.toggle("dark", nextIsDark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? "dark" : "light");
    } catch {
      // საცავის მიუწვდომლობის შემთხვევაშიც, თემის შეცვლა მიმდინარე სესიაში იმუშავებს.
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextIsDark ? "#0B0B0B" : "#F7F3E9");
    setIsDark(nextIsDark);
    window.dispatchEvent(new Event("theme-change"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={`inline-flex min-h-10 shrink-0 items-center ${showLabel ? "gap-2 px-1" : "w-9 justify-center"} text-market-ink transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-market-ink`}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
        </svg>
      )}
      {showLabel && <span className="text-[10px] uppercase tracking-[0.12em]">{isDark ? "Dark theme" : "Light theme"}</span>}
    </button>
  );
}
