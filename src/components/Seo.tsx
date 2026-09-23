import { Helmet } from "react-helmet-async";
import { SITE_NAME, SITE_URL } from "../content/site";
import { webpSrc } from "../content/images";
import { absoluteUrl, LOGO_URL } from "../content/seo";

type SeoProps = {
  title: string;
  description?: string;
  path: string;
  type?: "website" | "article" | "book";
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  authors?: string[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
};

export function Seo({
  title,
  description,
  path,
  type = "website",
  image,
  imageWidth,
  imageHeight,
  authors,
  jsonLd,
  noIndex,
}: SeoProps) {
  const canonical = absoluteUrl(path);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${webpSrc(image, imageWidth ?? 800)}`
    : LOGO_URL;

  const scripts = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <html lang="en-US" />
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      {noIndex ? (
        <meta name="robots" content="noindex" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}
      <link rel="canonical" href={canonical} />
      <link rel="icon" href={`${SITE_URL}/cropped-redbear-favicon-copy-32x32.png`} sizes="32x32" />
      <link rel="icon" href={`${SITE_URL}/cropped-redbear-favicon-copy-192x192.png`} sizes="192x192" />
      <link rel="apple-touch-icon" href={`${SITE_URL}/cropped-redbear-favicon-copy-180x180.png`} />
      <meta name="msapplication-TileImage" content={`${SITE_URL}/cropped-redbear-favicon-copy-270x270.png`} />
      <link rel="describedby" href={`${SITE_URL}/llms.txt`} type="text/markdown" />
      <link rel="ai-catalog" href={`${SITE_URL}/.well-known/ai-catalog.json`} type="application/json" />
      <link rel="ard" href={`${SITE_URL}/.well-known/ard.json`} type="application/json" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />
      {imageWidth ? <meta property="og:image:width" content={String(imageWidth)} /> : null}
      {imageHeight ? <meta property="og:image:height" content={String(imageHeight)} /> : null}
      {type === "book" && authors?.length
        ? authors.map((author) => <meta key={author} property="book:author" content={author} />)
        : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={ogImage} />
      {scripts.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
