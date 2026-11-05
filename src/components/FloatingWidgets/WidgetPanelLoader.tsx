import { lazy, Suspense, type ReactNode } from "react";

// პანელების კოდს მხოლოდ მომხმარებლის გახსნისას ვტვირთავთ, რომ საწყისი bundle შემცირდეს.
export const EaglePostPanel = lazy(() =>
  import("../EaglePostWidget/EaglePostPanel").then((module) => ({ default: module.EaglePostPanel })),
);
export const CouncilPanel = lazy(() =>
  import("../CouncilSupport/CouncilPanel").then((module) => ({ default: module.CouncilPanel })),
);
export const VaultCalculatorPanel = lazy(() =>
  import("../MithrilVaultCalculator/VaultCalculatorPanel").then((module) => ({ default: module.VaultCalculatorPanel })),
);

export function WidgetPanelLoader({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div role="status" className="py-8 text-center text-xs text-market-muted">Loading realm tool…</div>}>
      {children}
    </Suspense>
  );
}
