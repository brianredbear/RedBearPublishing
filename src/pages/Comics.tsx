import { comicsContent } from "../content/comics";
import { komikwerksSlugs, postsBySlug, spectrumSlugs } from "../content/posts";
import { Picture } from "../components/Picture";
import { PostGrid } from "../components/PostGrid";
import { Seo } from "../components/Seo";

export default function Comics() {
  const spectrum = spectrumSlugs.map((slug) => postsBySlug[slug]);
  const komikwerks = komikwerksSlugs.map((slug) => postsBySlug[slug]);

  return (
    <>
      <Seo
        title={comicsContent.title}
        description={comicsContent.description}
        path="/comics"
        type="article"
        image={comicsContent.ogImage}
        imageWidth={900}
        imageHeight={153}
      />
      <section className="page-band archive-band">
        <div className="section-inner archive-logo-inner">
          <Picture
            src="Spectrum-Logo-web.png"
            alt="Spectrum logo"
            width={900}
            height={153}
            kind="full"
            className="imprint-logo spectrum-logo"
            priority
          />
        </div>
      </section>
      <section className="archive-intro-section">
        <div className="section-inner">
          <p
            className="comics-intro"
            dangerouslySetInnerHTML={{ __html: comicsContent.introHtml }}
          />
        </div>
      </section>
      <section className="archive-grid-section">
        <div className="section-inner">
          <PostGrid posts={spectrum} cta="Read More" />
        </div>
      </section>
      <section className="archive-grid-section">
        <div className="section-inner">
          <PostGrid posts={komikwerks} cta="See More" />
        </div>
      </section>
    </>
  );
}
