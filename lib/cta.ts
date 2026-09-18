// Where the "Zakažite konsultaciju" button leads. The hero and the practice area
// pages both carry it, with the same text and the same destination.

import { localePath, type Locale } from "./locale";
import { telHref } from "./phone";

// Not visible, but a screen reader reads it out: the text "Zakažite
// konsultaciju" does not say that the button places a phone call.
export const CALL_LABEL = {
  sr: "pozovite",
  en: "call",
} as const;

type Input = {
  locale: Locale;
  /** pocetna.linkDugmeta — what the lawyers entered, if anything. */
  configured?: string | null;
  /** podesavanja.opstiTelefon — the fallback destination. */
  phone?: string | null;
};

/**
 * The "Gde dugme vodi" field wins when it is filled in — that is how the
 * lawyers can point it at #kontakt or at a different number. When it is empty
 * the button calls the office on the general number from Settings: somebody
 * looking for a lawyer usually wants to talk right away.
 *
 * An anchor is tied to the home page of the locale, so "#kontakt" still works
 * from a practice area page. Returns null when there is nowhere to lead.
 */
export function consultationLink({ locale, configured, phone }: Input) {
  const entered = configured?.trim();
  const target = entered || (phone ? telHref(phone) : null);

  if (!target) return null;

  const href = target.startsWith("#") ? `${localePath(locale)}${target}` : target;

  // Whether the button calls decides the screen-reader label: the visible text
  // does not say that it places a phone call.
  const spokenNumber = href.startsWith("tel:")
    ? entered?.startsWith("tel:")
      ? entered.slice("tel:".length)
      : phone
    : null;

  return { href, spokenNumber: spokenNumber ?? null };
}
