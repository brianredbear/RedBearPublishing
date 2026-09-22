import { defaultSizes, originalPath, webpSrcSet } from "../content/images";

type PictureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  kind?: "cover" | "hero" | "logo" | "full" | "button";
  className?: string;
  priority?: boolean;
};

export function Picture({
  src,
  alt,
  width,
  height,
  sizes,
  kind = "full",
  className,
  priority = false,
}: PictureProps) {
  return (
    <picture className={className}>
      <source
        type="image/webp"
        srcSet={webpSrcSet(src, width)}
        sizes={sizes ?? defaultSizes(kind)}
      />
      <img
        className={className}
        src={originalPath(src)}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
}
