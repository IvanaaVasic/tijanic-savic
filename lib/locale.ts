// The site's locales and everything that follows from them: routes, <html lang>,
// hreflang. This is the only place where "sr" and "en" appear as literals.

import { absoluteUrl } from "./site";

export const LOCALES = ["sr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** Serbian is primary. It carries the translation fallback and the site root. */
export const DEFAULT_LOCALE: Locale = "sr";

/**
 * The value for the lang attribute. Serbian is written in Latin script, so
 * "sr" alone is not enough — without the script subtag, screen readers and
 * search engines assume Cyrillic. The same tag doubles as hreflang.
 */
export const LANG_TAG: Record<Locale, string> = {
  sr: "sr-Latn",
  en: "en",
};

/** How the locale is spelled out in the header switch. */
export const LOCALE_LABEL: Record<Locale, string> = {
  sr: "SR",
  en: "EN",
};

/**
 * The URL segment a locale occupies. Serbian is the default and lives at the
 * site root with no prefix at all; only English is prefixed. The route folders
 * mirror this: app/(sr)/page.tsx and app/(en)/en/page.tsx.
 */
const SEGMENT: Record<Locale, string> = {
  sr: "",
  en: "en",
};

/**
 * Path to a page in the given locale. Always with a trailing slash, because
 * next.config.ts sets trailingSlash: true — the static export then writes
 * /en/index.html, which hosting serves without an extra redirect.
 */
export function localePath(locale: Locale, segment = ""): string {
  const parts = [SEGMENT[locale], segment.replace(/^\/+|\/+$/g, "")];
  const path = parts.filter(Boolean).join("/");
  return path ? `/${path}/` : "/";
}

/** The same content in the other locale — for the SR / EN switch. */
export function otherLocale(locale: Locale): Locale {
  return locale === "sr" ? "en" : "sr";
}

/**
 * The hreflang map for one page: every locale's own address plus x-default on
 * Serbian. The page metadata and the sitemap both emit it, and they must not
 * drift apart — a hreflang that points one way but not back is ignored.
 */
export function languageAlternates(segment = ""): Record<string, string> {
  return Object.fromEntries([
    ...LOCALES.map((locale) => [
      LANG_TAG[locale],
      absoluteUrl(localePath(locale, segment)),
    ]),
    ["x-default", absoluteUrl(localePath(DEFAULT_LOCALE, segment))],
  ]);
}

/**
 * og:locale wants a language_TERRITORY pair and knows nothing about script
 * subtags, so "sr-Latn" cannot go in as it stands. This is the only place where
 * the site claims a territory — everywhere else the language alone is enough.
 */
export const OG_LOCALE: Record<Locale, string> = {
  sr: "sr_RS",
  en: "en_US",
};
