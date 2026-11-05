import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type WidgetId = "eagle-post" | "council" | "mithril-vault";

interface WidgetContextValue {
  activeWidget: WidgetId | null;
  toggleWidget: (widget: WidgetId) => void;
  closeWidget: () => void;
}

const WidgetContext = createContext<WidgetContextValue | undefined>(undefined);

export function WidgetProvider({ children }: { children: ReactNode }) {
  const [activeWidget, setActiveWidget] = useState<WidgetId | null>(null);

  const toggleWidget = useCallback((widget: WidgetId) => {
    setActiveWidget((current) => current === widget ? null : widget);
  }, []);

  const closeWidget = useCallback(() => setActiveWidget(null), []);

  return (
    <WidgetContext.Provider value={{ activeWidget, toggleWidget, closeWidget }}>
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidgets(): WidgetContextValue {
  const context = useContext(WidgetContext);
  if (!context) throw new Error("useWidgets must be used within a WidgetProvider.");
  return context;
}
