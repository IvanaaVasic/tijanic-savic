// The <head> of a page: title, description, canonical, hreflang, Open Graph.
// The home page and the practice area pages build it the same way, so it is
// written once.

import type { Metadata } from "next";

import {
  languageAlternates,
  localePath,
  OG_LOCALE,
  otherLocale,
  type Locale,
} from "./locale";
import { absoluteUrl } from "./site";
import {
  DEFAULT_SHARE_IMAGE,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
  shareImageUrl,
} from "@/sanity/lib/image";

// Google cuts the description off at roughly 160 characters. The SEO field in
// the Studio says so and the lawyers keep to it — but the text that stands in
// when they leave it empty was written for the page, not for a search result,
// and it runs longer. Cutting on a word boundary and closing with an ellipsis
// is better than letting Google cut mid-word.
const DESCRIPTION_LIMIT = 155;

export function shorten(text: string | null | undefined): string | undefined {
  const trimmed = text?.trim();
  if (!trimmed) return undefined;
  if (trimmed.length <= DESCRIPTION_LIMIT) return trimmed;

  const cut = trimmed.slice(0, DESCRIPTION_LIMIT - 1);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:—-]$/, "")}…`;
}

/** An image field as Sanity returns it — only one with an uploaded file counts. */
type ShareImage = Parameters<typeof shareImageUrl>[0] & { asset?: unknown };

type Input = {
  locale: Locale;
  /** The path after the locale prefix — "" for home, "oblasti-prava/x" for an area. */
  segment?: string;
  title?: string;
  description?: string;
  /** podesavanja.nazivKancelarije */
  siteName?: string;
  /** seo.ogSlika — the first one that has an uploaded file wins. */
  images?: (ShareImage | null | undefined)[];
};

export function pageMetadata({
  locale,
  segment = "",
  title,
  description,
  siteName,
  images = [],
}: Input): Metadata {
  const url = absoluteUrl(localePath(locale, segment));

  // The image the link carries when it is shared in a message or on a social
  // network. public/og-default.png steps in until the lawyers upload a real
  // one: the horizontal lockup on the page background, drawn at the card's own
  // 1200 x 630. A smaller file would be scaled up by whoever renders the card,
  // and a different ratio would be cropped where we would not have cropped it.
  const uploaded = images.find((image) => image?.asset);
  const share = {
    url: uploaded ? shareImageUrl(uploaded) : absoluteUrl(DEFAULT_SHARE_IMAGE),
    width: SHARE_IMAGE_WIDTH,
    height: SHARE_IMAGE_HEIGHT,
    alt: siteName ?? "",
  };

  return {
    title,
    description,
    // The canonical link points at this locale's own version, not at Serbian,
    // and the hreflang map ties the two versions together in both directions.
    alternates: {
      canonical: url,
      languages: languageAlternates(segment),
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName,
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[otherLocale(locale)],
      images: [share],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [share],
    },
  };
}
