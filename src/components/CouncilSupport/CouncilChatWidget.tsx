import { WidgetPopover } from "../FloatingWidgets/WidgetPopover";
import { CouncilPanel, WidgetPanelLoader } from "../FloatingWidgets/WidgetPanelLoader";

export function CouncilChatWidget() {
  return <WidgetPopover id="council" label="Ask the Council" icon="❧"><WidgetPanelLoader><CouncilPanel /></WidgetPanelLoader></WidgetPopover>;
}
