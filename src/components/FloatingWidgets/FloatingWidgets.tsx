import { useFloatingWidgets } from "../../context/FloatingWidgetContext";
import { CouncilChatWidget } from "../CouncilSupport/CouncilChatWidget";
import { EaglePostWidget } from "../EaglePostWidget/EaglePostWidget";

export function FloatingWidgets() {
  const { activeWidget } = useFloatingWidgets();
  const isWidgetOpen = activeWidget === "eagle-post" || activeWidget === "council";

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex w-48 flex-col items-end gap-3 max-sm:right-4 ${isWidgetOpen ? "max-lg:bottom-4 max-lg:left-4 max-lg:right-4 max-lg:w-auto" : "max-lg:hidden"}`}>
      <EaglePostWidget />
      <CouncilChatWidget />
    </div>
  );
}
