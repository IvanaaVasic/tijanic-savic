// 02 Team — section 3 from docs/design/design.md. On the green background: the
// section label with a thin rule across the remaining width, then a row of
// lawyer cards.
//
// A server component: everything comes from Sanity at build time, no state.

import { LawyerCard } from "@/components/LawyerCard/LawyerCard";
import { Reveal } from "@/components/Reveal/Reveal";
import type { Locale } from "@/lib/locale";
import type { CONTENT_QUERYResult } from "@/sanity/types";

import styles from "./Team.module.css";

// The section label is not content but part of the design — the number and the
// name are the same on every section. The English label follows the navigation
// in the header, so a visitor who clicks TEAM lands on TEAM.
const LABELS = {
  sr: { label: "TIM" },
  en: { label: "TEAM" },
} as const;

const SECTION_NUMBER = "02";

type Props = {
  locale: Locale;
  /** Already ordered by the "Redosled prikaza" field — the GROQ query sorts. */
  lawyers: CONTENT_QUERYResult["advokati"];
};

export function Team({ locale, lawyers }: Props) {
  // The name is the only thing a card is recognised by. A document without one
  // is an unfinished entry and is not rendered — an empty card in the row shows.
  const listed = (lawyers ?? []).filter((lawyer) => lawyer.ime?.trim());

  if (listed.length === 0) return null;

  return (
    <section className={styles.section} id="tim">
      {/* The label is the only heading in this section, so it is an h2, and the
          lawyers' names are h3. The number and the slash are decoration — a
          screen reader hears only "Tim". */}
      <Reveal className={styles.head}>
        <h2 className={styles.label}>
          <span className={styles.number} aria-hidden="true">
            {SECTION_NUMBER}
          </span>
          <span className={styles.slash} aria-hidden="true">
            /
          </span>
          <span>{LABELS[locale].label}</span>
        </h2>

        <span className={styles.rule} aria-hidden="true" />
      </Reveal>

      {/* A list, not a stack of divs: a screen reader announces how many
          lawyers there are. Reveal renders the <li> itself so the grid keeps its
          children — the cards arrive one after the other, --reveal-stagger
          apart, rather than all at once. */}
      <ul className={styles.cards}>
        {listed.map((lawyer, index) => (
          <Reveal as="li" className={styles.item} index={index} key={lawyer._id}>
            <LawyerCard lawyer={lawyer} locale={locale} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
