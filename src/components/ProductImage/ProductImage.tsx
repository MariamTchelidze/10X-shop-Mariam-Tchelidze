import { useEffect, useState, type CSSProperties, type ImgHTMLAttributes } from "react";

interface ProductImageProps {
  src: string;
  webpSrcSet?: string;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  fetchPriority?: ImgHTMLAttributes<HTMLImageElement>["fetchPriority"];
  style?: CSSProperties;
  ariaHidden?: boolean;
}

// სურათის ჩატვირთვას მართავს და შეცდომისას გატეხილი ხატის ნაცვლად placeholder-ს აჩვენებს.
export function ProductImage({ src, webpSrcSet, sizes, alt, width, height, className, loading = "lazy", fetchPriority = "auto", style, ariaHidden }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => setHasError(false), [src]);

  if (hasError) {
    return (
      <div
        role="img"
        aria-hidden={ariaHidden}
        aria-label={`${alt} — image unavailable`}
        className={`flex items-center justify-center bg-market-surface px-3 text-center text-[10px] uppercase tracking-[0.12em] text-market-muted ${className}`}
        style={{ aspectRatio: `${width} / ${height}`, ...style }}
      >
        Artifact image unavailable
      </div>
    );
  }

  const image = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      aria-hidden={ariaHidden}
      onError={() => setHasError(true)}
      className={className}
      style={style}
    />
  );

  return webpSrcSet ? (
    <picture className="contents">
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      {image}
    </picture>
  ) : image;
}
