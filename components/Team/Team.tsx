// 02 Lawyers — section 3 from docs/design/design.md. On the green background: the
// section label with a thin rule across the remaining width, then a row of
// lawyer cards. Until the lawyers' entries are published, the row is replaced by
// a "U pripremi" frame — the navigation offers the section either way.
//
// A server component: everything comes from Sanity at build time, no state.

import { ComingSoon } from "@/components/ComingSoon/ComingSoon";
import { LawyerCard } from "@/components/LawyerCard/LawyerCard";
import { Reveal } from "@/components/Reveal/Reveal";
import { SectionHead } from "@/components/SectionHead/SectionHead";
import type { Locale } from "@/lib/locale";
import { SECTIONS } from "@/lib/sections";
import type { CONTENT_QUERYResult } from "@/sanity/types";

import styles from "./Team.module.css";

type Props = {
  locale: Locale;
  /** The section name from Settings, the same one the navigation shows. */
  name: string;
  /** Already ordered by the "Redosled prikaza" field — the GROQ query sorts. */
  lawyers: CONTENT_QUERYResult["advokati"];
};

export function Team({ locale, name, lawyers }: Props) {
  // The name is the only thing a card is recognised by. A document without one
  // is an unfinished entry and is not rendered — an empty card in the row shows.
  const listed = (lawyers ?? []).filter((lawyer) => lawyer.ime?.trim());

  const { anchor, number } = SECTIONS.lawyers;

  return (
    <section className={styles.section} id={anchor}>
      <SectionHead number={number} name={name} />

      {/* A list, not a stack of divs: a screen reader announces how many
          lawyers there are. Reveal renders the <li> itself so the grid keeps its
          children — the cards arrive one after the other, --reveal-stagger
          apart, rather than all at once. */}
      {listed.length > 0 ? (
        <ul className={styles.cards}>
          {listed.map((lawyer, index) => (
            <Reveal
              as="li"
              className={styles.item}
              index={index}
              key={lawyer._id}
            >
              <LawyerCard lawyer={lawyer} locale={locale} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <ComingSoon locale={locale} />
      )}
    </section>
  );
}
