// Hero — section 1 from docs/design/design.md. The first thing a visitor sees
// below the header: eyebrow, large title with its subtitle, gold divider, lead
// text, button.
//
// A server component: everything comes from Sanity at build time, no state.

import { Fragment } from "react";

import { Divider } from "@/components/Divider/Divider";
import { CALL_LABEL, consultationLink } from "@/lib/cta";
import type { Locale } from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import type { CONTENT_QUERYResult } from "@/sanity/types";

import styles from "./Hero.module.css";

/**
 * A dash or a middle dot with space around it — how the lawyers separate the
 * words of the motto in Sanity. A real sentence uses an em dash without
 * spaces or no dash at all, so prose is not caught by this.
 */
const SEPARATOR = /\s+[-–—·]\s+/;

/**
 * The lead, read as the motto it has become: every line of the field is a row,
 * and the words within a row are split by a dash. Rendered, the dashes turn
 * into the gold diamond and every word opens with a larger initial.
 *
 * Returns null when the text carries no separator at all — then it is an
 * ordinary lead paragraph and gets none of this.
 */
function parseMotto(lead: string) {
  const rows = lead
    .split(/\r?\n/)
    .map((row) =>
      row
        .split(SEPARATOR)
        .map((word) => word.trim())
        .filter(Boolean),
    )
    .filter((row) => row.length > 0);

  const hasSeparator = rows.some((row) => row.length > 1);
  return hasSeparator ? rows : null;
}

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
  const motto = lead ? parseMotto(lead) : null;
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

      {motto ? (
        // One paragraph still — the motto is a single thought, the rows are
        // only how it is set. The diamonds are decoration and carry
        // aria-hidden, so a screen reader reads the words and nothing else.
        <p className={styles.motto}>
          {motto.map((row, rowIndex) => (
            <span className={styles.row} key={rowIndex}>
              {row.map((word, wordIndex) => {
                const [initial, ...rest] = Array.from(word);
                return (
                  // The space before the word is the row's only break point,
                  // and the diamond travels inside the word that follows it —
                  // so a separator is never stranded at the edge of a line.
                  <Fragment key={wordIndex}>
                    {wordIndex > 0 ? " " : null}
                    <span className={styles.word}>
                      {wordIndex > 0 ? (
                        <span className={styles.diamond} aria-hidden="true" />
                      ) : null}
                      <span className={styles.initial}>{initial}</span>
                      {rest.join("")}
                    </span>
                  </Fragment>
                );
              })}
            </span>
          ))}
        </p>
      ) : lead ? (
        <p className={styles.lead}>{lead}</p>
      ) : null}

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
