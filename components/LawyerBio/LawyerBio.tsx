"use client";

// The biography in a lawyer card, folded down to a fixed height with a "Vidi
// više" under it. Asked for on 24.9.2026: the two bios run to thirteen and
// eight paragraphs, which on a phone means scrolling through the whole of the
// first lawyer before the second one appears.
//
// The text is rendered on the server and arrives here as children, so the
// Portable Text renderer and everything Sanity stays out of the browser
// bundle. All that is client-side is one boolean and the opening animation.
//
// The whole text is in the HTML from the start and the CSS hides the overflow,
// so a search engine reads the entire biography even though a visitor first
// sees part of it — the same shape as the button in AreaGrid.

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import type { Locale } from "@/lib/locale";

import styles from "./LawyerBio.module.css";

const LABELS = {
  sr: { more: "Vidi više", less: "Vidi manje", of: "biografija" },
  en: { more: "Show more", less: "Show less", of: "biography" },
} as const;

/** Breathing room between the header and the card we scroll back to. */
const SCROLL_GAP = 16;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A CSS time as a number of milliseconds. Both units have to be handled:
 * tokens.css writes --menu-duration as 360ms, but the compiler hands it back
 * as ".36s", and reading that as a bare number would run the animation in a
 * third of a millisecond.
 */
function milliseconds(value: string, fallback: number) {
  const time = value.trim();
  const number = parseFloat(time);
  if (!Number.isFinite(number)) return fallback;
  return time.endsWith("ms") ? number : number * 1000;
}

/**
 * The height of the sticky bar, measured rather than read from
 * --header-height: the bar changes height at its own breakpoint and the
 * measurement is right at every width. The menu inside <header> is `hidden`
 * while closed and adds nothing.
 */
function headerHeight() {
  const header = document.querySelector("header");
  return header ? header.getBoundingClientRect().height : 0;
}

type Props = {
  locale: Locale;
  /** Whose biography this is — a screen reader hears it on the button. */
  name: string;
  /** The rendered biography, from the server. */
  children: React.ReactNode;
};

export function LawyerBio({ locale, name, children }: Props) {
  const t = LABELS[locale];
  const bioId = useId();
  const bioRef = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState(false);
  // A biography that fits inside the fold needs no button, and no fade over
  // text that is whole. It cannot be known before the text is laid out, so the
  // button starts out present — without JavaScript that is the honest state —
  // and goes once it turns out there is nothing under the fold.
  const [overflows, setOverflows] = useState(true);

  // The height the box had at the moment of the click. The animation below
  // runs from it; null means the change did not come from the button (the
  // first render) and nothing should animate.
  const fromHeight = useRef<number | null>(null);

  useEffect(() => {
    const bio = bioRef.current;
    if (!bio) return;

    // Only while folded. Open, the box is as tall as its text and the measure
    // below would always come out false — which would take away the very
    // button that closes it again.
    if (expanded) return;

    // scrollHeight is the full text, clientHeight the part the fold leaves. A
    // pixel of slack: at some zoom levels the two differ by rounding even when
    // everything fits.
    const check = () => setOverflows(bio.scrollHeight - bio.clientHeight > 1);

    check();

    // The fold is a fixed height, so a narrower card means more lines — a
    // biography that fits on a wide screen may not fit on a phone.
    const observer = new ResizeObserver(check);
    observer.observe(bio);
    return () => observer.disconnect();
  }, [expanded]);

  // ── Opening and closing ─────────────────────────────────────────────────
  // max-height cannot be transitioned to `none`, so the two ends are measured
  // and animated between. useLayoutEffect, not useEffect: it runs after the
  // DOM has the new height but before the browser paints it, so the jump is
  // never seen.
  useLayoutEffect(() => {
    const bio = bioRef.current;
    const from = fromHeight.current;
    if (!bio || from === null) return;
    fromHeight.current = null;

    const to = bio.getBoundingClientRect().height;
    const reduced = prefersReducedMotion();

    if (!reduced && Math.abs(to - from) > 1) {
      // The two animation tokens, read off the element so the numbers live in
      // tokens.css and not here.
      const css = getComputedStyle(bio);
      const duration = milliseconds(
        css.getPropertyValue("--menu-duration"),
        360,
      );
      const easing = css.getPropertyValue("--reveal-ease").trim();

      bio.animate([{ maxHeight: `${from}px` }, { maxHeight: `${to}px` }], {
        duration,
        easing: easing || "ease",
      });
    }

    // Closing a thirteen-paragraph biography takes more than a screenful out
    // from under the reader, who would otherwise be left staring at whatever
    // section had moved up into view. So we go back to the top of the card.
    //
    // Nothing above the card moves, so its position in the document is the
    // same before and after — the target stays valid while the height animates
    // underneath. Already in view below the bar: nothing to do.
    if (expanded) return;

    const card = bio.closest("article");
    if (!card) return;

    const offset = headerHeight() + SCROLL_GAP;
    const top = card.getBoundingClientRect().top;
    if (top >= offset) return;

    window.scrollBy({
      top: top - offset,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [expanded]);

  const folded = !expanded && overflows;

  return (
    <>
      <div
        className={styles.bio}
        id={bioId}
        ref={bioRef}
        data-expanded={expanded}
        // Drives the fade: it belongs over a cut, not over a biography that
        // ends where it ends.
        data-folded={folded}
      >
        {children}
      </div>

      {overflows ? (
        <button
          className={styles.toggle}
          type="button"
          aria-expanded={expanded}
          aria-controls={bioId}
          onClick={() => {
            fromHeight.current =
              bioRef.current?.getBoundingClientRect().height ?? null;
            setExpanded((was) => !was);
          }}
        >
          {expanded ? t.less : t.more}
          {/* Two cards mean two identical buttons; the name tells them apart
              for a screen reader. */}
          <span className={styles.srOnly}>
            : {t.of}, {name}
          </span>
          <span className={styles.chevron} aria-hidden="true" />
        </button>
      ) : null}
    </>
  );
}
