import { Link } from "react-router-dom";
import { coverImageAlt } from "../content/seo";
import { type Post } from "../content/posts";
import { Picture } from "./Picture";

type PostGridProps = {
  posts: Post[];
  cta: "Read More" | "See More";
};

export function PostGrid({ posts, cta }: PostGridProps) {
  return (
    <div className="post-grid">
      {posts.map((post) => (
        <article key={post.slug} className="post-card">
          <Link className="post-card-image" to={`/${post.slug}/`} aria-label={coverImageAlt(post)}>
            <Picture
              src={post.image}
              alt={coverImageAlt(post)}
              width={post.width}
              height={post.height}
              kind="cover"
              className="cover-crop"
            />
          </Link>
          <Link className="post-card-title" to={`/${post.slug}/`}>
            {post.title}
          </Link>
          <div className="post-card-excerpt">
            <p>{post.excerpt}</p>
          </div>
          <Link className="read-more" to={`/${post.slug}/`}>
            {cta}
          </Link>
        </article>
      ))}
    </div>
  );
}
