import { CouncilChatWidget } from "../CouncilSupport/CouncilChatWidget";
import { EaglePostWidget } from "../EaglePostWidget/EaglePostWidget";

export function FloatingWidgets() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-h-[calc(100dvh-3rem)] w-[calc(100vw-3rem)] max-w-[22rem] flex-col items-end gap-3 overflow-y-auto max-sm:right-4">
      <EaglePostWidget />
      <CouncilChatWidget />
    </div>
  );
}
