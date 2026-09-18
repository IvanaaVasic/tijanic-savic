// The label that opens a section on the green background: "02 / ADVOKATI" in
// gold mono, then a thin gold rule across the remaining width. The Lawyers and
// the Practice areas sections both open with it.
//
// A server component — it only renders what it is given.

import { Reveal } from "@/components/Reveal/Reveal";

import styles from "./SectionHead.module.css";

type Props = {
  /** "02" — decoration, a screen reader does not hear it. */
  number: string;
  /** The section name from Settings, already in the right locale. */
  name: string;
};

export function SectionHead({ number, name }: Props) {
  // The label is the only heading of such a section, so it is an h2. The number
  // and the slash are decoration — a screen reader hears only the name.
  return (
    <Reveal className={styles.head}>
      <h2 className={styles.label}>
        <span aria-hidden="true">{number}</span>
        <span aria-hidden="true">/</span>
        <span>{name}</span>
      </h2>

      <span className={styles.rule} aria-hidden="true" />
    </Reveal>
  );
}
