// The JSON-LD for the home page: the office as a LegalService, each lawyer as a
// Person who works for it. Nothing here is visible — it is the machine-readable
// copy of what the sections already say, and it is what a search engine reads to
// build a knowledge panel with the address, the phone and the opening hours.
//
// Why the lawyers are not schema.org's Attorney, even though the name fits:
// Attorney is deprecated ("LegalService is more inclusive and less ambiguous")
// and it is a kind of LocalBusiness, not a kind of person — it describes a law
// firm, not somebody who works in one. A Person with jobTitle and worksFor says
// what is actually true, and the office keeps LegalService.
//
// A server component: everything comes from Sanity at build time, no state.
//
// Every locale renders its own graph and every node is identified by that
// locale's address, so the Serbian and the English version describe the same
// office without claiming to be one and the same node.

import { blocksToText } from "@/components/Paragraphs/Paragraphs";
import { LANG_TAG, localePath, type Locale } from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import { googleMapsUrl, mapQuery } from "@/lib/map";
import { readOpeningHours } from "@/lib/openingHours";
import { telNumber } from "@/lib/phone";
import { absoluteUrl } from "@/lib/site";
import { DEFAULT_SHARE_IMAGE, shareImageUrl } from "@/sanity/lib/image";
import type { CONTENT_QUERYResult } from "@/sanity/types";

/** Whatever JSON can hold — the shape of one value in the graph. */
type JsonValue =
  | string
  | number
  | boolean
  | JsonValue[]
  | { [key: string]: JsonValue };

type Node = { [key: string]: JsonValue | undefined };

/**
 * Drops every property that was left empty in Sanity. An empty string in
 * JSON-LD is not neutral — it is a claim that the office has no telephone,
 * which is worse than saying nothing about the telephone at all.
 */
function filled(node: Node): { [key: string]: JsonValue } {
  const kept: { [key: string]: JsonValue } = {};

  for (const [key, value] of Object.entries(node)) {
    if (value === undefined) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    kept[key] = value;
  }

  return kept;
}

/** A trimmed field, or undefined when it was never filled in. */
function text(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * "11000 Beograd" is one field in the Studio, because that is how an address is
 * written on an envelope — but schema.org keeps the post code and the town
 * apart. A leading group of digits is the post code; everything else is town.
 */
function splitPlace(place: string | null): {
  postalCode?: string;
  addressLocality?: string;
} {
  const trimmed = place?.trim();
  if (!trimmed) return {};

  const match = /^(\d{4,6})\s+(.+)$/.exec(trimmed);
  if (!match) return { addressLocality: trimmed };

  return { postalCode: match[1], addressLocality: match[2] };
}

type Props = {
  locale: Locale;
  content: CONTENT_QUERYResult;
};

export function StructuredData({ locale, content }: Props) {
  const { podesavanja, pocetna, oNama, advokati, kontakt } = content;

  const pageUrl = absoluteUrl(localePath(locale));
  const officeId = `${pageUrl}#kancelarija`;

  const name = text(podesavanja?.nazivKancelarije);

  // Without a name there is nothing to describe. It should never happen — the
  // field is required in the schema — but a nameless LegalService would be
  // worse than no JSON-LD at all.
  if (!name) return null;

  const street = text(podesavanja?.adresa?.ulica);
  const city = inLocale(podesavanja?.adresa?.grad, locale);
  const place = splitPlace(city);
  const country = text(inLocale(podesavanja?.adresa?.drzava, locale));

  const address = filled({
    "@type": "PostalAddress",
    streetAddress: street,
    postalCode: place.postalCode,
    addressLocality: place.addressLocality,
    addressCountry: country,
  });

  const coordinates = podesavanja?.koordinate ?? null;
  const geo =
    typeof coordinates?.lat === "number" && typeof coordinates?.lng === "number"
      ? {
          "@type": "GeoCoordinates",
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        }
      : undefined;

  // The same point the map in the Contact section uses, so the link in the
  // JSON-LD and the one on the page never land in two different places.
  const query = mapQuery(
    coordinates,
    [street, city, country].filter(Boolean).join(", ") || null,
  );

  // The office number from Settings first, then whatever the Contact section
  // lists — the same order the visitor meets them in.
  const phones = [
    podesavanja?.opstiTelefon,
    ...(kontakt?.telefoni ?? []).map((entry) => entry.broj),
  ]
    .map((number) => text(number))
    .filter((number): number is string => Boolean(number))
    .map(telNumber);

  const hours = readOpeningHours(inLocale(podesavanja?.radnoVreme, locale)).map(
    (entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.dayOfWeek,
      opens: entry.opens,
      closes: entry.closes,
    }),
  );

  // The share image doubles as the office's image, and falls back to the same
  // file the og:image tag falls back to — so a search engine and a messaging
  // app never show two different pictures of the same office. `logo` stays the
  // vertical lockup: that property wants the mark itself, not a card.
  const logo = absoluteUrl("/logo-vertical.png");
  const image = pocetna?.seo?.ogSlika?.asset
    ? shareImageUrl(pocetna.seo.ogSlika)
    : absoluteUrl(DEFAULT_SHARE_IMAGE);

  // The description a search engine shows is the SEO one; the About text is the
  // fuller sentence to fall back on when that field was left empty.
  const description =
    text(inLocale(pocetna?.seo?.opis, locale)) ??
    text(blocksToText(inLocale(oNama?.tekst, locale)));

  const lawyers = (advokati ?? [])
    .filter((lawyer) => text(lawyer.ime))
    .map((lawyer) => {
      const phone = text(lawyer.telefon);

      return filled({
        "@type": "Person",
        "@id": `${pageUrl}#advokat-${lawyer._id}`,
        name: text(lawyer.ime),
        // The title is what the lawyers wrote themselves — "advokat" — so it is
        // content, not a label the code invents.
        jobTitle: text(inLocale(lawyer.titula, locale)),
        description: text(blocksToText(inLocale(lawyer.biografija, locale))),
        image: lawyer.fotografija?.asset
          ? shareImageUrl(lawyer.fotografija)
          : undefined,
        email: text(lawyer.mejl),
        telephone: phone ? telNumber(phone) : undefined,
        // A card is not a page of its own, so the anchor of the Team section is
        // the closest thing to an address this person has.
        url: `${pageUrl}#tim`,
        worksFor: { "@id": officeId },
      });
    });

  const office = filled({
    "@type": "LegalService",
    "@id": officeId,
    name,
    url: pageUrl,
    description,
    inLanguage: LANG_TAG[locale],
    image,
    logo,
    address,
    geo,
    hasMap: query ? googleMapsUrl(query) : undefined,
    telephone: phones[0],
    email: text(podesavanja?.opstiMejl),
    // The country in the address is where the office sits, and for a law office
    // that is also the jurisdiction it works in.
    areaServed: country ? { "@type": "Country", name: country } : undefined,
    openingHoursSpecification: hours,
    // The PIB from the footer — the tax number the office is registered under.
    taxID: text(podesavanja?.pib),
    employee: lawyers.map((lawyer) => ({ "@id": lawyer["@id"] as string })),
  });

  const graph = {
    "@context": "https://schema.org",
    "@graph": [office, ...lawyers],
  };

  return (
    <script
      type="application/ld+json"
      // The value is built here out of typed data and serialised by
      // JSON.stringify, so it is JSON and nothing else. The one character that
      // could still close the tag early is "<", and it is escaped below.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
