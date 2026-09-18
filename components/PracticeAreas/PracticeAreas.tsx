// Practice areas on the home page — docs/design/oblasti/1 and 4. A cream panel
// like About: the section label, the title and a short intro, then a grid of
// cards, one per area, each leading to the area's own page. Until the first
// area is published the section stands as "U pripremi".
//
// A server component; the grid inside it is the only part with state (the
// "Vidi više" button).

import { AreaGrid } from "@/components/AreaGrid/AreaGrid";
import { PendingSection } from "@/components/PendingSection/PendingSection";
import { Reveal } from "@/components/Reveal/Reveal";
import type { Locale } from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import { areaPath } from "@/lib/practiceAreas";
import { SECTIONS } from "@/lib/sections";
import type { CONTENT_QUERYResult } from "@/sanity/types";

import styles from "./PracticeAreas.module.css";

type Props = {
  locale: Locale;
  /** The section name from Settings, the same one the navigation shows. */
  name: string;
  section: CONTENT_QUERYResult["oblastiPrava"];
  areas: CONTENT_QUERYResult["oblasti"];
};

export function PracticeAreas({ locale, name, section, areas }: Props) {
  // An area is recognised by its name and needs an address to lead to — the
  // query already drops the ones without one.
  const cards = (areas ?? []).flatMap((area) => {
    const title = inLocale(area.naziv, locale);
    if (!title || !area.slug) return [];

    return [
      {
        id: area._id,
        title,
        description: inLocale(area.kratakOpis, locale),
        href: areaPath(locale, area.slug),
      },
    ];
  });

  if (cards.length === 0) {
    return <PendingSection locale={locale} section="practiceAreas" name={name} />;
  }

  const title = inLocale(section?.naslovSekcije, locale);
  const intro = inLocale(section?.uvod, locale);
  const { anchor, number } = SECTIONS.practiceAreas;

  // The label is decoration next to a title, but when there is no title it is
  // the only heading of the section — then it becomes the h2, so the card names
  // below it still sit one level down.
  const Label = title ? "p" : "h2";

  return (
    <section className={styles.wrapper} id={anchor}>
      <Reveal className={styles.panel}>
        <div className={styles.head}>
          {/* The number and the slash are decoration — a screen reader hears
              only the name. */}
          <Label className={styles.label}>
            <span aria-hidden="true">{number}</span>
            <span className={styles.slash} aria-hidden="true">
              /
            </span>
            <span className={styles.name}>{name}</span>
          </Label>

          {title || intro ? (
            <div className={styles.intro}>
              {title ? <h2 className={styles.title}>{title}</h2> : null}
              {intro ? <p className={styles.text}>{intro}</p> : null}
            </div>
          ) : null}
        </div>

        <AreaGrid locale={locale} cards={cards} />
      </Reveal>
    </section>
  );
}
