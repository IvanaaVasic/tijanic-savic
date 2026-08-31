// The one page of the site, in whichever locale it is asked for. Serbian sits at
// the root and English under /en, and both routes render this.
//
// A server component: everything comes from Sanity at build time, no state.

import type { Metadata } from "next";

import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";
import { Hero } from "@/components/Hero/Hero";
import { blocksToText } from "@/components/Paragraphs/Paragraphs";
import { StructuredData } from "@/components/StructuredData/StructuredData";
import { Team } from "@/components/Team/Team";
import {
  languageAlternates,
  localePath,
  OG_LOCALE,
  otherLocale,
  type Locale,
} from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import { absoluteUrl } from "@/lib/site";
import { fetchContent } from "@/sanity/lib/fetch";
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

function shorten(text: string | null | undefined): string | undefined {
  const trimmed = text?.trim();
  if (!trimmed) return undefined;
  if (trimmed.length <= DESCRIPTION_LIMIT) return trimmed;

  const cut = trimmed.slice(0, DESCRIPTION_LIMIT - 1);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:—-]$/, "")}…`;
}

/** The <head> for this page in the given locale. Both routes call it. */
export async function homeMetadata(locale: Locale): Promise<Metadata> {
  const { podesavanja, pocetna, oNama } = await fetchContent();

  const officeName = podesavanja?.nazivKancelarije?.trim() || undefined;

  // The office name is the last resort, not the first choice: it is the same
  // string in both locales, so falling straight back to it would put an
  // identical title on two indexed addresses. The hero headline is translated,
  // so it keeps the two versions apart even when the SEO field is empty.
  const title =
    inLocale(pocetna?.seo?.naslov, locale) ??
    inLocale(pocetna?.naslov, locale) ??
    officeName;

  // Without the SEO description the About text stands in — a sentence written
  // for people still reads better in a search result than nothing at all.
  const description =
    inLocale(pocetna?.seo?.opis, locale)?.trim() ||
    shorten(blocksToText(inLocale(oNama?.tekst, locale))) ||
    undefined;

  const url = absoluteUrl(localePath(locale));

  // The image the link carries when it is shared in a message or on a social
  // network. public/og-default.png steps in until the lawyers upload a real
  // one: the horizontal lockup on the page background, drawn at the card's own
  // 1200 x 630. A smaller file would be scaled up by whoever renders the card,
  // and a different ratio would be cropped where we would not have cropped it.
  const share = pocetna?.seo?.ogSlika?.asset
    ? {
        url: shareImageUrl(pocetna.seo.ogSlika),
        width: SHARE_IMAGE_WIDTH,
        height: SHARE_IMAGE_HEIGHT,
        alt: officeName ?? "",
      }
    : {
        url: absoluteUrl(DEFAULT_SHARE_IMAGE),
        width: SHARE_IMAGE_WIDTH,
        height: SHARE_IMAGE_HEIGHT,
        alt: officeName ?? "",
      };

  return {
    title,
    description,
    // The canonical link points at this locale's own version, not at Serbian,
    // and the hreflang map ties the two versions together in both directions.
    alternates: {
      canonical: url,
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: officeName,
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

export async function HomePage({ locale }: { locale: Locale }) {
  const content = await fetchContent();
  const { podesavanja, pocetna, oNama, advokati, kontakt } = content;

  return (
    <main>
      <Hero locale={locale} home={pocetna} phone={podesavanja?.opstiTelefon} />

      <About locale={locale} about={oNama} />

      <Team locale={locale} lawyers={advokati} />

      <Contact locale={locale} contact={kontakt} settings={podesavanja} />

      {/* Invisible: the same data the sections above show, in the form a search
          engine reads. It sits at the end of the page so it never comes between
          two sections while reading the markup. */}
      <StructuredData locale={locale} content={content} />
    </main>
  );
}
