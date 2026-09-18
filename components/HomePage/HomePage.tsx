// The one page of the site, in whichever locale it is asked for. Serbian sits at
// the root and English under /en, and both routes render this.
//
// A server component: everything comes from Sanity at build time, no state.

import type { Metadata } from "next";

import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";
import { Hero } from "@/components/Hero/Hero";
import { blocksToText } from "@/components/Paragraphs/Paragraphs";
import { PracticeAreas } from "@/components/PracticeAreas/PracticeAreas";
import { StructuredData } from "@/components/StructuredData/StructuredData";
import { Team } from "@/components/Team/Team";
import type { Locale } from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import { pageMetadata, shorten } from "@/lib/metadata";
import { sectionName } from "@/lib/sections";
import { fetchContent } from "@/sanity/lib/fetch";

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

  return pageMetadata({
    locale,
    title,
    description,
    siteName: officeName,
    images: [pocetna?.seo?.ogSlika],
  });
}

export async function HomePage({ locale }: { locale: Locale }) {
  const content = await fetchContent();
  const {
    podesavanja,
    pocetna,
    oNama,
    advokati,
    oblastiPrava,
    oblasti,
    kontakt,
  } = content;

  // The same names the navigation in the header shows, so a visitor who clicks
  // ADVOKATI lands on ADVOKATI.
  const names = podesavanja?.naziviSekcija;

  return (
    <main>
      <Hero locale={locale} home={pocetna} phone={podesavanja?.opstiTelefon} />

      <About
        locale={locale}
        name={sectionName(names, "about", locale)}
        about={oNama}
      />

      <Team
        locale={locale}
        name={sectionName(names, "lawyers", locale)}
        lawyers={advokati}
      />

      <PracticeAreas
        locale={locale}
        name={sectionName(names, "practiceAreas", locale)}
        section={oblastiPrava}
        areas={oblasti}
      />

      <Contact
        locale={locale}
        name={sectionName(names, "contact", locale)}
        contact={kontakt}
        settings={podesavanja}
      />

      {/* Invisible: the same data the sections above show, in the form a search
          engine reads. It sits at the end of the page so it never comes between
          two sections while reading the markup. */}
      <StructuredData locale={locale} content={content} />
    </main>
  );
}
