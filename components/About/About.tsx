// About — section 2 from docs/design/design.md. A cream panel inside the green
// band: a narrow column with the section label on the left, and on the right the
// title, the paragraphs, the gold divider and a row of stats.
//
// A server component: everything comes from Sanity at build time, no state.

import { Divider } from "@/components/Divider/Divider";
import { Paragraphs } from "@/components/Paragraphs/Paragraphs";
import { Reveal } from "@/components/Reveal/Reveal";
import type { Locale } from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import type { CONTENT_QUERYResult } from "@/sanity/types";

import styles from "./About.module.css";

// The section label is not content but part of the design — the number and the
// name are the same on every section. The English label follows the navigation
// in the header, so a visitor who clicks ABOUT lands on ABOUT.
const LABELS = {
  sr: { label: "O NAMA" },
  en: { label: "ABOUT" },
} as const;

const SECTION_NUMBER = "01";

type Props = {
  locale: Locale;
  about: CONTENT_QUERYResult["oNama"];
};

export function About({ locale, about }: Props) {
  const title = inLocale(about?.naslovSekcije, locale);

  // The title is the only required part of the section. Without it the panel has
  // nothing to show and the whole section drops out — we never render an empty
  // one.
  if (!title) return null;

  const text = inLocale(about?.tekst, locale);

  // The schema allows up to three stats, but the lawyers can enter fewer, and
  // can leave one without a value. The ones with no headline value drop out
  // here — a label on its own means nothing.
  const stats = (about?.statistike ?? [])
    .map((stat) => ({
      key: stat._key,
      value: inLocale(stat.vrednost, locale),
      caption: inLocale(stat.labela, locale),
    }))
    .filter(
      (stat): stat is typeof stat & { value: string } => stat.value !== null,
    );

  return (
    <section className={styles.wrapper} id="o-nama">
      {/* Reveal renders the panel itself rather than wrapping it — the fade and
          the rise belong to the cream block, and the gold divider inside it
          draws itself once the panel has arrived. */}
      <Reveal className={styles.panel}>
        {/* The number and the slash are decoration — a screen reader hears only
            "O nama". */}
        <p className={styles.label}>
          <span className={styles.number} aria-hidden="true">
            {SECTION_NUMBER}
          </span>
          <span className={styles.slash} aria-hidden="true">
            /
          </span>
          <span className={styles.name}>{LABELS[locale].label}</span>
        </p>

        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>

          <Paragraphs
            blocks={text}
            wrapperClassName={styles.body}
            paragraphClassName={styles.paragraph}
          />

          {/* The divider sits at the bottom of the cream panel even when there
              are no stats — that is how "Recurring elements" describes it. */}
          <Divider variant="panel" className={styles.divider} />

          {stats.length > 0 ? (
            <ul className={styles.stats}>
              {stats.map((stat) => (
                <li className={styles.stat} key={stat.key}>
                  <span className={styles.value}>{stat.value}</span>
                  {stat.caption ? (
                    <span className={styles.caption}>{stat.caption}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
