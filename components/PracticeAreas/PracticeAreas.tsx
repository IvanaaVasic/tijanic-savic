// 03 Practice areas — between the Lawyers and the Contact section. Its design is
// not settled yet, so for now it is the section label and a "U pripremi" frame,
// built like the Lawyers section so the two read as a pair. The navigation
// already offers it; the content arrives with the design.
//
// A server component, no state.

import { ComingSoon } from "@/components/ComingSoon/ComingSoon";
import { SectionHead } from "@/components/SectionHead/SectionHead";
import type { Locale } from "@/lib/locale";
import { SECTIONS } from "@/lib/sections";

import styles from "./PracticeAreas.module.css";

type Props = {
  locale: Locale;
  /** The section name from Settings, the same one the navigation shows. */
  name: string;
};

export function PracticeAreas({ locale, name }: Props) {
  const { anchor, number } = SECTIONS.practiceAreas;

  return (
    <section className={styles.section} id={anchor}>
      <SectionHead number={number} name={name} />
      <ComingSoon locale={locale} />
    </section>
  );
}
