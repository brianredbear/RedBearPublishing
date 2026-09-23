import { posts } from "./posts";

export const INDEXABLE_PATHS = [
  "/",
  "/comics/",
  "/category/actionopolis/",
  ...posts.map((post) => `/${post.slug}/`),
] as const;

export const VISUAL_CHECK_PATHS = [...INDEXABLE_PATHS, "/this-page-does-not-exist/"] as const;
