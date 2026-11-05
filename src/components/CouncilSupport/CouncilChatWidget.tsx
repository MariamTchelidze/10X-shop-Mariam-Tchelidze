import { WidgetPopover } from "../FloatingWidgets/WidgetPopover";
import { CouncilPanel } from "./CouncilPanel";

export function CouncilChatWidget() {
  return <WidgetPopover id="council" label="Ask the Council" icon="❧"><CouncilPanel /></WidgetPopover>;
}
