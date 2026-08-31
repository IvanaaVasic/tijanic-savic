// Hero — section 1 from docs/design/design.md. The first thing a visitor sees
// below the header: eyebrow, large title, gold divider, lead text, button.
//
// A server component: everything comes from Sanity at build time, no state.

import { Divider } from "@/components/Divider/Divider";
import type { Locale } from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import { telHref } from "@/lib/phone";
import type { CONTENT_QUERYResult } from "@/sanity/types";

import styles from "./Hero.module.css";

// A label that is not visible but a screen reader reads out: the text "Zakažite
// konsultaciju" does not say that the button places a phone call.
const LABELS = {
  sr: { call: "pozovite" },
  en: { call: "call" },
} as const;

type Props = {
  locale: Locale;
  home: CONTENT_QUERYResult["pocetna"];
  /** podesavanja.opstiTelefon — the button's fallback destination. */
  phone?: string | null;
};

export function Hero({ locale, home, phone }: Props) {
  const title = inLocale(home?.naslov, locale);

  // The title is the only required part. Without it the hero has nothing to
  // show and the whole section drops out — we never render an empty one.
  if (!title) return null;

  const eyebrow = inLocale(home?.nadnaslov, locale);
  const lead = inLocale(home?.uvodniTekst, locale);
  const buttonText = inLocale(home?.tekstDugmeta, locale);

  // The "Gde dugme vodi" field wins when it is filled in — that is how the
  // lawyers can point it at #contact or at a different number. When it is
  // empty the button calls the office on the general number from Settings:
  // somebody looking for a lawyer usually wants to talk right away.
  const configuredHref = home?.linkDugmeta?.trim();
  const href = configuredHref || (phone ? telHref(phone) : null);

  // Whether the button calls or leads somewhere else decides the screen-reader
  // label. When it points at an anchor the visible text says enough on its own.
  const calls = href?.startsWith("tel:") ?? false;
  const spokenNumber = calls
    ? configuredHref?.startsWith("tel:")
      ? configuredHref.slice("tel:".length)
      : phone
    : null;

  return (
    <section className={styles.hero}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}

      <h1 className={styles.title}>{title}</h1>

      <Divider variant="hero" />

      {lead ? <p className={styles.lead}>{lead}</p> : null}

      {buttonText && href ? (
        <a
          className={styles.button}
          href={href}
          aria-label={
            spokenNumber
              ? `${buttonText} — ${LABELS[locale].call} ${spokenNumber}`
              : undefined
          }
        >
          {buttonText}
        </a>
      ) : null}
    </section>
  );
}
