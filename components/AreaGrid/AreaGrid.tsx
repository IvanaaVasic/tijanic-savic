"use client";

// The cards of the practice areas section, and the "Vidi više" button under
// them. At most six cards show on a wide screen and three on a phone; the button
// opens the rest. It is not in the mockup — it was asked for separately.
//
// Every card is in the HTML from the start and the CSS hides the extra ones, so
// a search engine sees and follows every area even though a visitor first sees
// only a few. The only state here is whether the rest is open.

import { useEffect, useId, useRef, useState } from "react";

import type { Locale } from "@/lib/locale";
import { VISIBLE_AREAS } from "@/lib/practiceAreas";

import styles from "./AreaGrid.module.css";

const LABELS = {
  sr: { more: "Vidi više", less: "Vidi manje", link: "Više o oblasti" },
  en: { more: "Show more", less: "Show less", link: "More about this area" },
} as const;

// Must match the min-width query in AreaGrid.module.css.
const DESKTOP = "(min-width: 900px)";

export type AreaCard = {
  id: string;
  title: string;
  description: string | null;
  href: string;
};

type Props = {
  locale: Locale;
  cards: AreaCard[];
};

export function AreaGrid({ locale, cards }: Props) {
  const t = LABELS[locale];
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [justOpened, setJustOpened] = useState(false);

  // After "Vidi više" the focus moves to the first card that just appeared, so
  // a keyboard or screen-reader user continues from there instead of having to
  // find their way back up from the button.
  useEffect(() => {
    if (!justOpened) return;
    setJustOpened(false);

    const limit = window.matchMedia(DESKTOP).matches
      ? VISIBLE_AREAS.desktop
      : VISIBLE_AREAS.mobile;
    listRef.current?.querySelectorAll<HTMLAnchorElement>("a")[limit]?.focus();
  }, [justOpened]);

  // Nothing to open when every card already fits: the button is left out on a
  // phone as well as on a wide screen, or only on the wide screen.
  const moreOnMobile = cards.length > VISIBLE_AREAS.mobile;
  const moreOnDesktop = cards.length > VISIBLE_AREAS.desktop;

  return (
    <div className={styles.grid}>
      <ul
        className={styles.cards}
        id={listId}
        ref={listRef}
        data-expanded={expanded}
      >
        {cards.map((card) => (
          <li className={styles.card} key={card.id}>
            <h3 className={styles.title}>{card.title}</h3>

            {card.description ? (
              <p className={styles.description}>{card.description}</p>
            ) : null}

            {/* The link text is the same on every card, so the area's name is
                added for a screen reader — a list of twelve identical "Više o
                oblasti" links says nothing. */}
            <a className={styles.link} href={card.href}>
              {t.link}
              <span className={styles.srOnly}>: {card.title}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      {moreOnMobile ? (
        <button
          className={moreOnDesktop ? styles.more : styles.moreMobileOnly}
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => {
            if (!expanded) setJustOpened(true);
            setExpanded(!expanded);
          }}
        >
          {expanded ? t.less : t.more}
        </button>
      ) : null}
    </div>
  );
}
