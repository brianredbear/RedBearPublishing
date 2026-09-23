import { actionopolisContent } from "../content/comics";
import { actionopolisSlugs, postsBySlug } from "../content/posts";
import { actionopolisSeo } from "../content/seo";
import { Picture } from "../components/Picture";
import { PostGrid } from "../components/PostGrid";
import { Seo } from "../components/Seo";

export default function Actionopolis() {
  const books = actionopolisSlugs.map((slug) => postsBySlug[slug]);

  return (
    <>
      <Seo {...actionopolisSeo()} />
      <section className="page-band archive-band">
        <div className="section-inner archive-logo-inner">
          <Picture
            src="action_logo_final_full_color.png"
            alt="Actionopolis logo"
            width={1000}
            height={470}
            kind="full"
            className="imprint-logo actionopolis-logo"
            priority
          />
        </div>
      </section>
      <section className="archive-intro-section">
        <div className="section-inner">
          <p
            className="archive-quote"
            dangerouslySetInnerHTML={{ __html: actionopolisContent.quoteHtml }}
          />
        </div>
      </section>
      <section className="archive-grid-section">
        <div className="section-inner">
          <PostGrid posts={books} cta="See More" />
        </div>
      </section>
    </>
  );
}
