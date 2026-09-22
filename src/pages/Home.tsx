import { homeContent } from "../content/home";
import { SITE_NAME, SITE_URL } from "../content/site";
import { Picture } from "../components/Picture";
import { Seo } from "../components/Seo";
import { originalPath, webpSrc } from "../content/images";

const AMAZON_LOGO = {
  src: "amazon-kindle-2.png",
  width: 485,
  height: 93,
};

function AmazonButton({ href }: { href: string }) {
  return (
    <div className="amazon-well">
      <a className="amazon-link" href={href} target="_blank" rel="noreferrer" aria-label="Buy on Amazon">
        <img
          src={webpSrc(AMAZON_LOGO.src, AMAZON_LOGO.width)}
          alt="Buy on Amazon"
          width={AMAZON_LOGO.width}
          height={AMAZON_LOGO.height}
          decoding="async"
          loading="lazy"
        />
      </a>
    </div>
  );
}

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      email: "info@redbearpublishing.com",
      telephone: "+1-323-620-2327",
      sameAs: [
        "https://www.facebook.com/redbeartv/",
        "https://twitter.com/redbeartv",
        "https://www.linkedin.com/company/3854074/",
        "https://redbear.tv",
      ],
      logo: `${SITE_URL}${originalPath("redbear.-logo-whiteloutline.png")}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "Book",
      name: homeContent.book2.title,
      author: { "@type": "Person", name: homeContent.author },
      image: `${SITE_URL}${webpSrc(homeContent.book2.image, 800)}`,
      url: homeContent.book2.amazon,
      description: homeContent.book2.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "Book",
      name: homeContent.book1.title,
      author: { "@type": "Person", name: homeContent.author },
      image: `${SITE_URL}${webpSrc(homeContent.book1.image, 800)}`,
      url: homeContent.book1.amazon,
      description: homeContent.book1.description,
    },
  ];

  return (
    <>
      <Seo
        title={homeContent.title}
        description={homeContent.description}
        path="/"
        type="website"
        image={homeContent.ogImage}
        imageWidth={800}
        imageHeight={1201}
        jsonLd={jsonLd}
      />
      <section className="page-band home-band">
        <div className="section-inner home-inner">
          <div className="home-card">
            <Picture
              src="big-roupe@2x.png"
              alt="Readers gathered around a table of books"
              width={1986}
              height={570}
              kind="full"
              className="crowd-image"
            />
            <h1 className="heading-one">{homeContent.welcome}</h1>
            <p className="home-intro">{homeContent.intro}</p>

            <h2 className="heading-three">{homeContent.book2Heading}</h2>
            <div className="book-row">
              <div className="book-cover">
                <Picture
                  src={homeContent.book2.image}
                  alt={homeContent.book2.alt}
                  width={homeContent.book2.width}
                  height={homeContent.book2.height}
                  kind="hero"
                  priority
                />
              </div>
              <div className="book-copy">
                <h2 className="book-title">{homeContent.book2.title}</h2>
                <h2 className="book-subtitle">{homeContent.book2.subtitle}</h2>
                <p className="book-body">{homeContent.book2.description}</p>
                <AmazonButton href={homeContent.book2.amazon} />
              </div>
            </div>

            <h2 className="heading-three">{homeContent.firstReleaseHeading}</h2>
            <div className="book-row book-row-first">
              <div className="book-cover">
                <Picture
                  src={homeContent.book1.image}
                  alt={homeContent.book1.alt}
                  width={homeContent.book1.width}
                  height={homeContent.book1.height}
                  kind="hero"
                />
              </div>
              <div className="book-copy">
                <h2 className="book-title">{homeContent.book1.title}</h2>
                <h2 className="book-subtitle">{homeContent.book1.subtitle}</h2>
                <div className="book-body">
                  <p>{homeContent.book1.description}</p>
                  <p
                    className="foreword"
                    dangerouslySetInnerHTML={{ __html: homeContent.book1.forewordHtml }}
                  />
                </div>
                <AmazonButton href={homeContent.book1.amazon} />
              </div>
            </div>

            <div className="awards-wrap">
              <div
                className="awards-col"
                dangerouslySetInnerHTML={{ __html: homeContent.awardsHtml }}
              />
              <div
                className="awards-col"
                dangerouslySetInnerHTML={{ __html: homeContent.reviewsHtml }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="home-spacer" aria-hidden="true" />
    </>
  );
}
