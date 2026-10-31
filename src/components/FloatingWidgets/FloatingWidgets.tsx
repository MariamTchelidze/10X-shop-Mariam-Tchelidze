import { CouncilChatWidget } from "../CouncilSupport/CouncilChatWidget";
import { EaglePostWidget } from "../EaglePostWidget/EaglePostWidget";

export function FloatingWidgets() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-48 flex-col items-end gap-3 max-sm:right-4">
      <EaglePostWidget />
      <CouncilChatWidget />
    </div>
  );
}
