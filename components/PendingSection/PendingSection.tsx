// A section whose content does not exist yet: the section label and a
// "U pripremi" frame, built like the Lawyers section so they read as a set. The
// navigation offers every section, so a visitor who clicks one lands on this
// instead of on nothing.
//
// Practice areas uses it until its design is settled; About falls back to it
// while its document is not published.
//
// A server component, no state.

import { ComingSoon } from "@/components/ComingSoon/ComingSoon";
import { SectionHead } from "@/components/SectionHead/SectionHead";
import type { Locale } from "@/lib/locale";
import { SECTIONS, type SectionId } from "@/lib/sections";

import styles from "./PendingSection.module.css";

type Props = {
  locale: Locale;
  section: SectionId;
  /** The section name from Settings, the same one the navigation shows. */
  name: string;
};

export function PendingSection({ locale, section, name }: Props) {
  const { anchor, number } = SECTIONS[section];

  return (
    <section className={styles.section} id={anchor}>
      <SectionHead number={number} name={name} />
      <ComingSoon locale={locale} />
    </section>
  );
}
