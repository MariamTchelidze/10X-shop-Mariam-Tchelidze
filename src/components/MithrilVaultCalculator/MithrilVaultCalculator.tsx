import { WidgetPopover } from "../FloatingWidgets/WidgetPopover";
import { VaultCalculatorPanel } from "./VaultCalculatorPanel";

export function MithrilVaultCalculator() {
  return <WidgetPopover id="mithril-vault" label="Mithril Vault" icon="◉" align="left"><VaultCalculatorPanel /></WidgetPopover>;
}
