// Hero — section 1 from docs/design/design.md. The first thing a visitor sees
// below the header: eyebrow, large title with its subtitle, gold divider, lead
// text, button.
//
// A server component: everything comes from Sanity at build time, no state.

import { Divider } from "@/components/Divider/Divider";
import { CALL_LABEL, consultationLink } from "@/lib/cta";
import type { Locale } from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import type { CONTENT_QUERYResult } from "@/sanity/types";

import styles from "./Hero.module.css";

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
  const subtitle = inLocale(home?.podnaslov, locale);
  const lead = inLocale(home?.uvodniTekst, locale);
  const buttonText = inLocale(home?.tekstDugmeta, locale);

  const link = consultationLink({
    locale,
    configured: home?.linkDugmeta,
    phone,
  });

  return (
    <section className={styles.hero}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}

      {/* <hgroup> is the element for a heading with a subtitle: the translation
          of the Latin maxim belongs to the title, but it is not a heading of
          its own. It sits right under the title, closer than the 40px gap the
          rest of the column keeps. */}
      {subtitle ? (
        <hgroup className={styles.heading}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </hgroup>
      ) : (
        <h1 className={styles.title}>{title}</h1>
      )}

      <Divider variant="hero" />

      {lead ? <p className={styles.lead}>{lead}</p> : null}

      {buttonText && link ? (
        <a
          className={styles.button}
          href={link.href}
          aria-label={
            link.spokenNumber
              ? `${buttonText} — ${CALL_LABEL[locale]} ${link.spokenNumber}`
              : undefined
          }
        >
          {buttonText}
        </a>
      ) : null}
    </section>
  );
}
