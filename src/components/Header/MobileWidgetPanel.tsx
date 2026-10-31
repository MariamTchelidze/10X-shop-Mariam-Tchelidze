import type { FloatingWidgetId } from "../../types/floatingWidget";
import { CouncilChatPanel } from "../CouncilSupport/CouncilChatPanel";
import { EaglePostPanel } from "../EaglePostWidget/EaglePostPanel";
import { MithrilVaultPanel } from "../MithrilVaultCalculator/MithrilVaultPanel";

interface MobileWidgetPanelProps {
  widget: FloatingWidgetId | null;
  onClose: () => void;
}

export function MobileWidgetPanel({ widget, onClose }: MobileWidgetPanelProps) {
  if (!widget) return null;

  return (
    <div id="mobile-widget-panel" className="mt-3 overflow-hidden border border-gold/60 bg-market-paper shadow-lg">
      {widget === "eagle-post" && <EaglePostPanel onClose={onClose} />}
      {widget === "council" && <CouncilChatPanel onClose={onClose} />}
      {widget === "mithril-vault" && <MithrilVaultPanel onClose={onClose} />}
    </div>
  );
}
