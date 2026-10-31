import { useState } from "react";
import { CouncilChatWidget } from "../CouncilSupport/CouncilChatWidget";
import { EaglePostWidget } from "../EaglePostWidget/EaglePostWidget";

export function FloatingWidgets() {
  const [isEaglePostOpen, setIsEaglePostOpen] = useState(false);
  const [isCouncilOpen, setIsCouncilOpen] = useState(false);
  const isExpanded = isEaglePostOpen || isCouncilOpen;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex max-h-[calc(100dvh-3rem)] flex-col items-stretch gap-3 overflow-y-auto transition-[width] duration-300 max-sm:right-4 ${isExpanded ? "w-[calc(100vw-3rem)] max-w-[22rem]" : "w-48"}`}>
      <EaglePostWidget onOpenChange={setIsEaglePostOpen} />
      <CouncilChatWidget onOpenChange={setIsCouncilOpen} />
    </div>
  );
}
