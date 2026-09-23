import { comicsContent, actionopolisContent } from "./comics";
import { homeContent } from "./home";
import { webpSrc } from "./images";
import { coverAlt, type Post } from "./posts";
import { SITE_NAME, SITE_URL } from "./site";

export const LOGO_URL = `${SITE_URL}${webpSrc("redbear.-logo-whiteloutline.png", 374)}`;

export function withTrailingSlash(path: string): string {
  if (path === "/") {
    return "/";
  }
  return path.endsWith("/") ? path : `${path}/`;
}

export function absoluteUrl(path: string): string {
  const normalized = withTrailingSlash(path);
  if (normalized === "/") {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}${normalized}`;
}

export function trimDescription(text: string, min = 140, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) {
    return clean;
  }
  const slice = clean.slice(0, max);
  const atWord = slice.lastIndexOf(" ");
  const trimmed = (atWord >= min ? slice.slice(0, atWord) : slice).replace(/[.,;:]+$/, "");
  return trimmed;
}

export function pageTitle(name: string): string {
  const suffix = " | Redbear Publishing";
  if (name.length + suffix.length <= 60) {
    return `${name}${suffix}`;
  }
  return name;
}

function firstSynopsis(post: Post): string {
  return post.paragraphs.find((paragraph) => !/^(Length|Author|Authors|Cover|Date):/i.test(paragraph)) ?? post.excerpt;
}

export function parseCredits(post: Post): {
  authors: string[];
  illustrators: string[];
  coverArtists: string[];
  pageCount?: number;
} {
  const authors: string[] = [];
  const illustrators: string[] = [];
  const coverArtists: string[] = [];
  let pageCount: number | undefined;
  for (const paragraph of post.paragraphs) {
    const length = paragraph.match(/Length:\s*(\d+)/i);
    if (length) {
      pageCount = Number(length[1]);
    }
    const author = paragraph.match(/Authors?:\s*([^.\n]+)/i);
    if (author) {
      author[1].split(/,| and | with |&/i).forEach((part) => {
        const role = part.replace(/\u00a0/g, " ");
        const name = role.replace(/\(.*?\)/g, "").trim();
        if (!name) {
          return;
        }
        if (/illustrat/i.test(role)) {
          illustrators.push(name);
          return;
        }
        if (/\((contributor|compiler|creator|colorist)\)/i.test(role)) {
          return;
        }
        authors.push(name);
      });
      const illustrator = paragraph.match(/Illustrations? by\s+([^.\n]+)|Illustrator:\s*([^.\n]+)/i);
      if (illustrator) {
        (illustrator[1] || illustrator[2])
          .split(/,| and | with /i)
          .map((name) => name.replace(/\(.*?\)/g, "").trim())
          .filter(Boolean)
          .forEach((name) => illustrators.push(name));
      }
    }
    const cover = paragraph.match(/Cover (?:Art|Artist|Illustrator):\s*([^.\n]+)/i);
    if (cover) {
      coverArtists.push(cover[1].trim());
    }
  }
  return {
    authors: [...new Set(authors)],
    illustrators: [...new Set(illustrators)],
    coverArtists: [...new Set(coverArtists)],
    pageCount,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: LOGO_URL,
    email: "info@redbearpublishing.com",
    telephone: "+1-323-620-2327",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function homeSeo() {
  return {
    title: "Redbear Publishing | Comics, Graphic Novels & Sci-Fi Books",
    description:
      "Redbear Publishing is home to Spectrum, the comic from PJ Haarsma and Alan Tudyk, The Softwire series, and more sci-fi and adventure comics and books.",
    path: "/",
    type: "website" as const,
    image: homeContent.ogImage,
    imageWidth: 800,
    imageHeight: 1201,
    jsonLd: [
      organizationJsonLd(),
      websiteJsonLd(),
      breadcrumbJsonLd([{ name: SITE_NAME, path: "/" }]),
    ],
  };
}

export function comicsSeo() {
  return {
    title: pageTitle("Comics"),
    description: trimDescription(comicsContent.description),
    path: "/comics/",
    type: "website" as const,
    image: comicsContent.ogImage,
    imageWidth: 900,
    imageHeight: 153,
    jsonLd: [
      organizationJsonLd(),
      breadcrumbJsonLd([
        { name: SITE_NAME, path: "/" },
        { name: "Comics", path: "/comics/" },
      ]),
    ],
  };
}

export function actionopolisSeo() {
  const quote =
    "These high-energy texts and engaging characters will attract reluctant readers as well as fantasy fans.";
  return {
    title: pageTitle("Actionopolis Books"),
    description: trimDescription(quote),
    path: "/category/actionopolis/",
    type: "website" as const,
    image: actionopolisContent.ogImage,
    imageWidth: 563,
    imageHeight: 900,
    jsonLd: [
      organizationJsonLd(),
      breadcrumbJsonLd([
        { name: SITE_NAME, path: "/" },
        { name: "Actionopolis", path: "/category/actionopolis/" },
      ]),
    ],
  };
}

export function notFoundSeo(path: string) {
  return {
    title: pageTitle("Page not found"),
    description: "The page you requested could not be found.",
    path,
    noIndex: true,
    jsonLd: [organizationJsonLd()],
  };
}

function toIsoDate(date: string): string | undefined {
  const match = date.trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (!match) {
    return undefined;
  }
  const months: Record<string, string> = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };
  const month = months[match[1].toLowerCase()];
  if (!month) {
    return undefined;
  }
  return `${match[3]}-${month}-${match[2].padStart(2, "0")}`;
}

function people(names: string[]) {
  return names.map((name) => ({ "@type": "Person", name }));
}

export function postSeo(post: Post) {
  const credits = parseCredits(post);
  const description = trimDescription(firstSynopsis(post));
  const image = `${SITE_URL}${webpSrc(post.image, post.width)}`;
  const url = absoluteUrl(`/${post.slug}/`);
  const isSpectrum = post.slug.startsWith("spectrum-");
  const isComic = post.category === "comics" || post.category === "komikwerks";
  const parent = isComic
    ? { name: "Comics", path: "/comics/" }
    : { name: "Actionopolis", path: "/category/actionopolis/" };

  let schema: Record<string, unknown>;
  if (isSpectrum) {
    const issueNumber = post.title.includes("#1") ? 1 : 0;
    const mainIssue = post.slug.includes("alt-cover")
      ? post.slug.includes("spectrum-0")
        ? `${SITE_URL}/spectrum-0/`
        : `${SITE_URL}/spectrum-1/`
      : undefined;
    schema = {
      "@context": "https://schema.org",
      "@type": "ComicIssue",
      name: post.title,
      description,
      image,
      url,
      issueNumber,
      ...(credits.authors.length ? { author: people(credits.authors) } : {}),
      ...(credits.illustrators.length || credits.coverArtists.length
        ? { artist: people([...credits.illustrators, ...credits.coverArtists]) }
        : {}),
      ...(credits.pageCount ? { numberOfPages: credits.pageCount } : {}),
      ...(toIsoDate(post.date) ? { datePublished: toIsoDate(post.date) } : {}),
      isPartOf: {
        "@type": "ComicSeries",
        "@id": `${SITE_URL}/#spectrum`,
        name: "Spectrum",
      },
      publisher: { "@id": `${SITE_URL}/#organization` },
      ...(mainIssue ? { isVariantOf: mainIssue } : {}),
    };
  } else if (isComic) {
    schema = {
      "@context": "https://schema.org",
      "@type": "ComicStory",
      name: post.title,
      description,
      image,
      url,
      ...(credits.authors.length ? { author: people(credits.authors) } : {}),
      ...(credits.illustrators.length ? { illustrator: people(credits.illustrators) } : {}),
      ...(credits.pageCount ? { numberOfPages: credits.pageCount } : {}),
      ...(toIsoDate(post.date) ? { datePublished: toIsoDate(post.date) } : {}),
      publisher: { "@id": `${SITE_URL}/#organization` },
    };
  } else {
    schema = {
      "@context": "https://schema.org",
      "@type": "Book",
      name: post.title,
      description,
      image,
      url,
      ...(credits.authors.length ? { author: people(credits.authors) } : {}),
      ...(credits.illustrators.length ? { illustrator: people(credits.illustrators) } : {}),
      ...(credits.pageCount ? { numberOfPages: credits.pageCount } : {}),
      ...(toIsoDate(post.date) ? { datePublished: toIsoDate(post.date) } : {}),
      ...(post.formats.includes("Paperback") ? { bookFormat: "https://schema.org/Paperback" } : {}),
      publisher: { "@id": `${SITE_URL}/#organization` },
    };
  }

  return {
    title: pageTitle(post.title),
    description,
    path: `/${post.slug}/`,
    type: "book" as const,
    image: post.image,
    imageWidth: post.width,
    imageHeight: post.height,
    authors: credits.authors,
    jsonLd: [
      organizationJsonLd(),
      schema,
      breadcrumbJsonLd([
        { name: SITE_NAME, path: "/" },
        parent,
        { name: post.title, path: `/${post.slug}/` },
      ]),
    ],
  };
}

export function coverImageAlt(post: Post): string {
  const credits = parseCredits(post);
  const artist = credits.coverArtists[0];
  if (post.slug.includes("alt-cover") && artist) {
    return `${post.title} cover by ${artist}`;
  }
  return coverAlt(post);
}
