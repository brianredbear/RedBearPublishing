import { Helmet } from "react-helmet-async";
import { SITE_NAME, SITE_URL } from "../content/site";
import { webpSrc } from "../content/images";

type SeoProps = {
  title: string;
  description?: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
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
  jsonLd,
  noIndex,
}: SeoProps) {
  const canonical = `${SITE_URL}${path.endsWith("/") ? path : `${path}/`}`.replace(
    `${SITE_URL}//`,
    `${SITE_URL}/`,
  );
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${webpSrc(image, imageWidth ?? 800)}`
    : undefined;

  const scripts = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <html lang="en-US" />
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      {noIndex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}
      <link rel="canonical" href={canonical} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      {ogImage && imageWidth ? (
        <meta property="og:image:width" content={String(imageWidth)} />
      ) : null}
      {ogImage && imageHeight ? (
        <meta property="og:image:height" content={String(imageHeight)} />
      ) : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
      {scripts.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
