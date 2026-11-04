// დესკტოპზე Eagle Post-სა და საბჭოს ვიჯეტებს ერთად ათავსებს.
import { CouncilChatWidget } from "../CouncilSupport/CouncilChatWidget";
import { EaglePostWidget } from "../EaglePostWidget/EaglePostWidget";

export function FloatingWidgets() {
  // ორივე ვიჯეტი ერთ მარჯვენა კიდეს ეყრდნობა და ქვედა კუთხეში სვეტად ეწყობა.
  return (
    <div className="fixed bottom-4 right-4 z-50 hidden w-11 flex-col items-end gap-2 min-[1280px]:flex">
      <EaglePostWidget />
      <CouncilChatWidget />
    </div>
  );
}
