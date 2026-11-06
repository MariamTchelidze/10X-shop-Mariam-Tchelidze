import { QRCodeSVG } from "qrcode.react";

const DEFAULT_QR_URL = "https://treasures-of-middle-earth.vercel.app/?page=1";

interface QRCodeWidgetProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function QRCodeWidget({
  url = DEFAULT_QR_URL,
  title = "Open Treasures of Middle-earth on your phone",
  description,
  className = "",
}: QRCodeWidgetProps) {
  return (
    <figure className={`mx-auto w-fit text-center ${className}`.trim()}>
      <div
        className="w-fit rounded-sm border border-market-border p-3 shadow-sm"
        style={{ backgroundColor: "var(--qr-background)" }}
      >
        <QRCodeSVG
          value={url}
          size={240}
          level="H"
          marginSize={2}
          bgColor="var(--qr-background)"
          fgColor="var(--qr-foreground)"
          title={title}
          role="img"
          aria-label={`${title}: ${url}`}
          className="block h-auto max-w-full"
        />
      </div>
      {description ? (
        <figcaption className="mt-3 max-w-xs font-sans text-sm leading-6 text-market-muted">
          {description}
        </figcaption>
      ) : null}
    </figure>
  );
}
