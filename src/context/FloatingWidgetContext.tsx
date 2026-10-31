import { createContext, useContext, useState, type ReactNode } from "react";
import type { FloatingWidgetId } from "../types/floatingWidget";

interface FloatingWidgetContextValue {
  activeWidget: FloatingWidgetId | null;
  setActiveWidget: (widget: FloatingWidgetId | null) => void;
}

const FloatingWidgetContext = createContext<FloatingWidgetContextValue | undefined>(undefined);

export function FloatingWidgetProvider({ children }: { children: ReactNode }) {
  const [activeWidget, setActiveWidget] = useState<FloatingWidgetId | null>(null);

  return (
    <FloatingWidgetContext.Provider value={{ activeWidget, setActiveWidget }}>
      {children}
    </FloatingWidgetContext.Provider>
  );
}

export function useFloatingWidgets(): FloatingWidgetContextValue {
  const context = useContext(FloatingWidgetContext);
  if (!context) {
    throw new Error("useFloatingWidgets must be used within a FloatingWidgetProvider.");
  }
  return context;
}
