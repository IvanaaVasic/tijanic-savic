import type { Locale } from "./locale";
import { inLocale, type Localized } from "./localized";

// The sections of the page, in the order they stand on it. The navigation in
// the header and the "01 / O NAMA" label above each section both read from here,
// so a visitor who clicks ADVOKATI always lands on ADVOKATI.
//
// The names are edited in Settings ("Nazivi sekcija"); the fallbacks below stand
// in while a field is empty. The case does not matter — the navigation and the
// labels are set in mono caps by CSS, whatever the lawyers type.
//
// The anchors stay in Serbian: they are part of the address the visitor sees,
// and the "Gde dugme vodi" field in the Studio points at #kontakt. Renaming them
// would break whatever the lawyers have already typed in there.
export const SECTIONS = {
  about: {
    anchor: "o-nama",
    number: "01",
    fallback: { sr: "O nama", en: "About" },
  },
  lawyers: {
    anchor: "advokati",
    number: "02",
    fallback: { sr: "Advokati", en: "Lawyers" },
  },
  practiceAreas: {
    anchor: "oblasti-prava",
    number: "03",
    fallback: { sr: "Oblasti prava", en: "Practice areas" },
  },
  contact: {
    anchor: "kontakt",
    number: "04",
    fallback: { sr: "Kontakt", en: "Contact" },
  },
} as const;

export type SectionId = keyof typeof SECTIONS;

const ORDER: SectionId[] = ["about", "lawyers", "practiceAreas", "contact"];

/** podesavanja.naziviSekcija — the field names are stored in the dataset. */
export type SectionNames =
  | {
      oNama?: Localized<string>;
      advokati?: Localized<string>;
      oblastiPrava?: Localized<string>;
      kontakt?: Localized<string>;
    }
  | null
  | undefined;

const FIELD: Record<SectionId, "oNama" | "advokati" | "oblastiPrava" | "kontakt"> = {
  about: "oNama",
  lawyers: "advokati",
  practiceAreas: "oblastiPrava",
  contact: "kontakt",
};

/** The name of one section in the given locale, never empty. */
export function sectionName(
  names: SectionNames,
  id: SectionId,
  locale: Locale,
): string {
  return (
    inLocale(names?.[FIELD[id]], locale)?.trim() || SECTIONS[id].fallback[locale]
  );
}

/** Everything the navigation needs, in page order. */
export function navItems(names: SectionNames, locale: Locale) {
  return ORDER.map((id) => ({
    anchor: SECTIONS[id].anchor,
    label: sectionName(names, id, locale),
  }));
}
