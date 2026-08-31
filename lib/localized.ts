import { DEFAULT_LOCALE, type Locale } from "./locale";

/**
 * The shape that lokalniNaslov, lokalniTekst and lokalniBlok have in Sanity:
 * one document, two fields side by side.
 */
export type Localized<T> = {
  sr?: T | null;
  en?: T | null;
};

function hasValue<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * The only way components read bilingual fields — nothing touches .sr and .en
 * directly.
 *
 * Order: requested locale -> Serbian -> null. An empty string and an empty
 * array count as unfilled, because the lawyers often leave the English side
 * untouched.
 *
 * When this returns null the caller skips the whole element. An empty section
 * is never rendered.
 */
export function inLocale<T>(
  field: Localized<T> | null | undefined,
  locale: Locale,
): T | null {
  if (!field) return null;

  const requested = field[locale];
  if (hasValue(requested)) return requested;

  const fallback = field[DEFAULT_LOCALE];
  if (hasValue(fallback)) return fallback;

  return null;
}

/**
 * For when the text has to end up in an attribute (alt, title, aria-label) and
 * null is not usable. An empty string is still the signal to skip the element.
 */
export function textInLocale(
  field: Localized<string> | null | undefined,
  locale: Locale,
): string {
  return inLocale(field, locale) ?? "";
}
