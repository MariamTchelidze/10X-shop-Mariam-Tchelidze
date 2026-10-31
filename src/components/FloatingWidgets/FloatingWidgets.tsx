import { useFloatingWidgets } from "../../context/FloatingWidgetContext";
import { CouncilChatWidget } from "../CouncilSupport/CouncilChatWidget";
import { EaglePostWidget } from "../EaglePostWidget/EaglePostWidget";

export function FloatingWidgets() {
  const { activeWidget } = useFloatingWidgets();
  const isWidgetOpen = activeWidget === "eagle-post" || activeWidget === "council";

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex w-48 flex-col items-end gap-3 max-sm:right-4 ${isWidgetOpen ? "max-[1024px]:bottom-4 max-[1024px]:left-4 max-[1024px]:right-4 max-[1024px]:w-auto" : "max-[1024px]:hidden"}`}>
      <EaglePostWidget />
      <CouncilChatWidget />
    </div>
  );
}
