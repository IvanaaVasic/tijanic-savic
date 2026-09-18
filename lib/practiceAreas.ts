import { localePath, type Locale } from "./locale";

// Every practice area has a page of its own under this segment, in both
// locales: /oblasti-prava/porodicno-pravo/ and /en/oblasti-prava/porodicno-pravo/.
// The segment stays in Serbian in English too, for the same reason the anchors
// do — one address per page, differing only in the /en prefix, so the SR / EN
// switch never has to translate a path.
export const AREAS_SEGMENT = "oblasti-prava";

/** The address of one practice area page, relative to the site root. */
export function areaPath(locale: Locale, slug: string): string {
  return localePath(locale, `${AREAS_SEGMENT}/${slug}`);
}

/** The segment for localePath() and languageAlternates(). */
export function areaSegment(slug: string): string {
  return `${AREAS_SEGMENT}/${slug}`;
}

/** Whether an address belongs to a practice area page. */
export function isAreaPath(pathname: string): boolean {
  return pathname.split("/").includes(AREAS_SEGMENT);
}

// How many cards the home page shows before "Vidi više". The CSS in
// PracticeAreas.module.css hides the rest by the same numbers — keep them in
// step.
export const VISIBLE_AREAS = { mobile: 3, desktop: 6 } as const;
