import { useLocation } from "react-router-dom";
import { CouncilChatWidget } from "../CouncilSupport/CouncilChatWidget";
import { EaglePostWidget } from "../EaglePostWidget/EaglePostWidget";
import { MithrilVaultCalculator } from "../MithrilVaultCalculator/MithrilVaultCalculator";

export function FloatingWidgetDock() {
  const { pathname } = useLocation();
  if (pathname === "/login") return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 min-[1280px]:flex" aria-label="Realm tools">
        <EaglePostWidget />
        <CouncilChatWidget />
      </div>
      <div className="fixed bottom-6 left-6 z-40 hidden min-[1280px]:block">
        <MithrilVaultCalculator />
      </div>
    </>
  );
}
