"use client";

// The only animation on the site: a block rises 16px into its place and fades
// in as it enters the viewport, once, and never again. No parallax and nothing
// tied to the scroll position — the design has no shadows and no gradients, and
// an effect that runs on every frame would fight it as well as cost frames.
//
// Three rules the implementation follows:
//
//   1. The resting state is visible. Hiding is added by this effect and by
//      nothing else, so without JavaScript — and for a crawler — the page reads
//      exactly as it does now.
//   2. A block already on screen when the page loads is left alone. Hiding it
//      after paint would be a flash of an empty page.
//   3. prefers-reduced-motion means no hiding at all, not a faster animation.
//
// The state is written straight to the DOM node rather than held in React
// state: it is a purely visual flag, it must land in the same frame the element
// is measured in, and a re-render would buy nothing.

import { useEffect, useRef } from "react";

import styles from "./Reveal.module.css";

type Props = {
  /**
   * The element to render. `li` is there for the row of lawyer cards, which
   * sits in a <ul> and must not gain a wrapper.
   */
  as?: "div" | "li";
  /**
   * Milliseconds before this block starts, for staggering a row. The caller
   * passes the index; the step itself is --reveal-stagger.
   */
  index?: number;
  /** The caller's own class — Reveal renders the element, it does not wrap it. */
  className?: string;
  children: React.ReactNode;
};

/**
 * Where across the viewport the reveal fires, measured from the top: a block
 * starts once its top edge has risen past 88% of the height. A line rather than
 * a threshold, because a threshold is a share of the element and the cream
 * panels are tall enough that waiting for 15% of one would fire far too late.
 */
const LINE = 0.88;

/** The same line, written the way IntersectionObserver wants it. */
const ROOT_MARGIN = `0px 0px -${(1 - LINE) * 100}% 0px`;

export function Reveal({
  as: Tag = "div",
  index = 0,
  className,
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Rule 2: already past the line the reveal fires on, so there is nothing
    // left to reveal — the same measurement the observer below makes, only
    // taken once, now.
    if (node.getBoundingClientRect().top < window.innerHeight * LINE) return;

    node.dataset.reveal = "hidden";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        delete node.dataset.reveal;
        observer.disconnect();
      },
      { rootMargin: ROOT_MARGIN },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      className={className ? `${styles.reveal} ${className}` : styles.reveal}
      style={
        index
          ? ({
              "--reveal-delay": `calc(${index} * var(--reveal-stagger))`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
