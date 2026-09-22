import { useParams } from "react-router-dom";
import { coverAlt, getPost, relatedPosts } from "../content/posts";
import { Picture } from "../components/Picture";
import { PostGrid } from "../components/PostGrid";
import { Seo } from "../components/Seo";
import NotFound from "./NotFound";

export default function PostPage() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  if (!post) {
    return <NotFound />;
  }

  const related = relatedPosts(post);

  return (
    <>
      <Seo
        title={post.ogTitle}
        description={post.ogDescription}
        path={`/${post.slug}`}
        type="article"
        image={post.image}
        imageWidth={post.width}
        imageHeight={post.height}
      />
      <section className="page-band post-band">
        <div className="section-inner post-inner">
          <div className="post-layout">
            <div className="post-cover">
              <Picture
                src={post.image}
                alt={coverAlt(post)}
                width={post.width}
                height={post.height}
                kind="cover"
                priority
              />
            </div>
            <div className="post-copy">
              <h1 className="post-title">{post.title}</h1>
              <p className="post-subtitle">{post.subtitle}</p>
              <div className="post-body">
                {post.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="post-meta-row">
                <span className="post-meta-label">Date Published:</span>
                <span className="post-meta-value">{post.date}</span>
              </div>
              <div className="post-meta-row">
                <span className="post-meta-label">Formats:</span>
                <span className="post-meta-value">{post.formats.join(" | ")}</span>
              </div>
              {post.purchaseUrl ? (
                <a
                  className="purchase-button"
                  href={post.purchaseUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {post.buttonLabel}
                </a>
              ) : (
                <span className="purchase-button is-disabled">{post.buttonLabel}</span>
              )}
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 ? (
        <section className="related-section">
          <div className="section-inner">
            <p className="related-heading">{post.relatedHeading}</p>
            <PostGrid posts={related} cta="See More" />
          </div>
        </section>
      ) : null}
    </>
  );
}
