import { getPost, posts } from "../content/posts";
import { contact, SITE_NAME, SITE_TAGLINE, SITE_URL } from "../content/site";

type ToolInput = Record<string, unknown>;

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: ToolInput) => Promise<string> | string;
};

type ModelContext = {
  registerTool: (tool: WebMcpTool) => Promise<unknown> | unknown;
};

const PAGES = {
  home: "/",
  comics: "/comics",
  actionopolis: "/category/actionopolis",
} as const;

function getModelContext(): ModelContext | undefined {
  const fromDocument = (document as Document & { modelContext?: ModelContext }).modelContext;
  if (fromDocument) {
    return fromDocument;
  }
  return (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function summarizePost(slug: string) {
  const post = getPost(slug);
  if (!post) {
    return null;
  }
  return {
    title: post.title,
    subtitle: post.subtitle,
    slug: post.slug,
    url: `${SITE_URL}/${post.slug}/`,
    category: post.category,
    date: post.date,
    formats: post.formats,
    purchaseUrl: post.purchaseUrl || null,
    excerpt: post.excerpt,
  };
}

const tools: WebMcpTool[] = [
  {
    name: "list_titles",
    description:
      "List Redbear Publishing books and comics. Filter with category: actionopolis, comics, or komikwerks.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["all", "actionopolis", "comics", "komikwerks"],
          description: "Catalog to list. Defaults to all titles.",
        },
      },
      additionalProperties: false,
    },
    execute({ category }) {
      const filter = asText(category) || "all";
      const matches = posts.filter((post) => filter === "all" || post.category === filter);
      return JSON.stringify(
        matches.map((post) => ({
          title: post.title,
          slug: post.slug,
          url: `${SITE_URL}/${post.slug}/`,
          category: post.category,
        })),
      );
    },
  },
  {
    name: "get_title",
    description:
      "Get details for one Redbear title by slug, including description, formats, and purchase URL.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Title slug such as evolver or spectrum-0.",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
    execute({ slug }) {
      const details = summarizePost(asText(slug));
      if (!details) {
        return `No title found for slug "${asText(slug)}".`;
      }
      return JSON.stringify(details);
    },
  },
  {
    name: "go_to_page",
    description:
      "Open a Redbear Publishing page in this browser tab. Use home, comics, actionopolis, or a title slug.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "string",
          description: "home, comics, actionopolis, or a title slug.",
        },
      },
      required: ["page"],
      additionalProperties: false,
    },
    execute({ page }) {
      const key = asText(page).toLowerCase();
      const path = key in PAGES ? PAGES[key as keyof typeof PAGES] : `/${key}`;
      window.location.assign(path);
      return `Navigating to ${path}`;
    },
  },
  {
    name: "get_publisher_info",
    description: `Return ${SITE_NAME} contact details, tagline, and primary catalog URLs.`,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    execute() {
      return JSON.stringify({
        name: SITE_NAME,
        tagline: SITE_TAGLINE,
        email: contact.emailDisplay,
        phone: contact.phoneDisplay,
        home: `${SITE_URL}/`,
        actionopolis: `${SITE_URL}/category/actionopolis/`,
        comics: `${SITE_URL}/comics/`,
        llms: `${SITE_URL}/llms.txt`,
      });
    },
  },
];

export function registerWebMcpTools(): void {
  const modelContext = getModelContext();
  if (!modelContext) {
    return;
  }

  for (const tool of tools) {
    try {
      void modelContext.registerTool(tool);
    } catch {
      // Older or incomplete WebMCP implementations should not break the site.
    }
  }
}
