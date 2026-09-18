// "U PRIPREMI" — what a section shows while its content does not exist yet. The
// navigation still offers the section, so a visitor who clicks it lands on a
// calm frame that says so, instead of on nothing.
//
// A status, not content: it reads the same whatever the lawyers enter, so it is
// not edited in Sanity. It disappears on its own once the section has content.

import { Reveal } from "@/components/Reveal/Reveal";
import type { Locale } from "@/lib/locale";

import styles from "./ComingSoon.module.css";

const LABELS = {
  sr: "U pripremi",
  en: "Coming soon",
} as const;

export function ComingSoon({ locale }: { locale: Locale }) {
  return (
    <Reveal className={styles.frame}>
      <p className={styles.text}>{LABELS[locale]}</p>
    </Reveal>
  );
}
