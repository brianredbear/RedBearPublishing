export const SITE_URL = "https://redbearpublishing.com";
export const SITE_NAME = "Redbear Publishing";
export const SITE_TAGLINE = "Fantastic Stories. Fantastic Worlds.";

export const nav = [
  { label: "HOME", to: "/" },
  { label: "ACTIONOPOLIS", to: "/category/actionopolis" },
  { label: "COMICS", to: "/comics" },
] as const;

export const footerNav = [
  { label: "COMICS", to: "/comics", external: false },
  { label: "BOOKS", to: "/category/actionopolis", external: false },
  { label: "REDBEAR.TV", to: "https://redbear.tv", external: true },
] as const;

export const contact = {
  phoneDisplay: "(323) 620-2327",
  phoneHref: "tel:+13236202327",
  emailDisplay: "info@redbearpublishing.com",
  emailHref: "mailto:info@redbearpublishing.com",
};

export const social = [
  {
    label: "Visit our Facebook",
    href: "https://www.facebook.com/redbeartv/",
    name: "facebook" as const,
  },
  {
    label: "Visit our Twitter",
    href: "https://twitter.com/redbeartv?lang=en",
    name: "twitter" as const,
  },
  {
    label: "Visit our LinkedIn",
    href: "https://www.linkedin.com/company/3854074/",
    name: "linkedin" as const,
  },
];
