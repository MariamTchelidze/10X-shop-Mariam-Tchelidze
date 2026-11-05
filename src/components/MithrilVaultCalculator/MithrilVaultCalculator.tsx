import { WidgetPopover } from "../FloatingWidgets/WidgetPopover";
import { VaultCalculatorPanel, WidgetPanelLoader } from "../FloatingWidgets/WidgetPanelLoader";

export function MithrilVaultCalculator() {
  return <WidgetPopover id="mithril-vault" label="Mithril Vault" icon="◉" align="left"><WidgetPanelLoader><VaultCalculatorPanel /></WidgetPanelLoader></WidgetPopover>;
}
