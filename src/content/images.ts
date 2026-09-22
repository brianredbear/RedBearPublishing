const WIDTHS = [480, 800, 1200, 1600] as const;

export function stem(filename: string): string {
  return filename.replace(/\.(jpg|jpeg|png)$/i, "");
}

export function originalPath(filename: string): string {
  return `/images/original/${filename}`;
}

export function webpSrc(filename: string, width: number): string {
  return `/images/${stem(filename)}-${width}.webp`;
}

export function webpSrcSet(filename: string, nativeWidth: number): string {
  const widths = [
    ...WIDTHS.filter((width) => width < nativeWidth),
    nativeWidth,
  ];
  return widths
    .map((width) => `${webpSrc(filename, width)} ${width}w`)
    .join(", ");
}

export function defaultSizes(kind: "cover" | "hero" | "logo" | "full" | "button"): string {
  switch (kind) {
    case "hero":
      return "(max-width: 767px) 280px, 400px";
    case "cover":
      return "(max-width: 767px) 280px, (max-width: 1120px) 45vw, 360px";
    case "logo":
      return "160px";
    case "button":
      return "180px";
    default:
      return "(max-width: 767px) 100vw, 1120px";
  }
}
