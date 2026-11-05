import { WidgetPopover } from "../FloatingWidgets/WidgetPopover";
import { EaglePostPanel, WidgetPanelLoader } from "../FloatingWidgets/WidgetPanelLoader";

export function EaglePostWidget() {
  return <WidgetPopover id="eagle-post" label="Eagle Post" icon="⌁"><WidgetPanelLoader><EaglePostPanel /></WidgetPanelLoader></WidgetPopover>;
}
