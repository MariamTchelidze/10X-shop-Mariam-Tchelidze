import { useEffect, useState } from "react";
import { QRCodeWidget } from "../Common/QRCodeWidget";

const SESSION_FLAG = "hasSeenQrModal";

function hasSeenModalThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_FLAG) === "true";
  } catch {
    // QR ნახვის მონიშვნა თუ მიუწვდომელია, ფანჯარა ჩვეულებრივად მაინც მუშაობს.
    return false;
  }
}

function markModalAsSeen(): void {
  try {
    window.sessionStorage.setItem(SESSION_FLAG, "true");
  } catch {
    // პირადი დათვალიერების შეზღუდვამ ფანჯრის გამოყენება არ უნდა დაბლოკოს.
  }
}

function useDesktopViewport(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsDesktop(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  return isDesktop;
}

function DesktopQrDialog() {
  const [isOpen, setIsOpen] = useState(() => !hasSeenModalThisSession());
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    markModalAsSeen();
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const closeButtonTimer = window.setTimeout(() => setShowCloseButton(true), 2000);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(closeButtonTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-5 backdrop-blur-sm sm:p-8">
      <section
        aria-labelledby="qr-modal-title"
        aria-modal="true"
        className="relative my-auto flex w-full max-w-3xl flex-col items-center border border-gold/60 bg-market-paper px-7 py-12 text-center text-market-ink shadow-2xl sm:px-14 sm:py-14"
        role="dialog"
      >
        {showCloseButton ? (
          <button
            aria-label="Close QR code window"
            className="absolute right-4 top-4 flex min-h-12 min-w-12 cursor-pointer items-center justify-center text-4xl leading-none text-market-muted transition hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:right-5 sm:top-5"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            ×
          </button>
        ) : null}

        <h2
          className="mx-auto mb-9 max-w-2xl font-display text-xl leading-8 text-market-muted sm:text-2xl sm:leading-9"
          id="qr-modal-title"
        >
          To use our website on your phone, please scan the QR code with your
          camera and follow the instructions.
        </h2>

        <QRCodeWidget
          className="mb-7"
          description="Scan to open the market directly in your phone browser."
        />

        <button
          className="mx-auto block cursor-pointer border-b border-current pb-1 font-display text-sm tracking-wider text-market-ink transition hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          Continue on the desktop.
        </button>
      </section>
    </div>
  );
}

export function QrCodeModal() {
  const isDesktop = useDesktopViewport();

  // Dialog კომპონენტი მხოლოდ დესკტოპის ზომაზე ემატება DOM-ში.
  return isDesktop ? <DesktopQrDialog /> : null;
}
