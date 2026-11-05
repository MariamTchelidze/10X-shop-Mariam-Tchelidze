import { WidgetPopover } from "../FloatingWidgets/WidgetPopover";
import { EaglePostPanel } from "./EaglePostPanel";

export function EaglePostWidget() {
  return <WidgetPopover id="eagle-post" label="Eagle Post" icon="⌁"><EaglePostPanel /></WidgetPopover>;
}
