"use client";

// The row of three photographs at the top of the About panel. From 768px up
// it is a plain row of three equal columns. Below that the same list scrolls
// sideways with scroll-snap — each slide narrower than the column, so the edge
// of the next one shows — with a counter and three thin lines under it.
//
// The photographs themselves are rendered here, but their URLs are built on
// the server (photoSource in sanity/lib/image.ts) and arrive as plain props, so
// nothing from Sanity reaches the browser bundle. All that is client-side is
// the active index and the scroll to a slide when a line is tapped.
//
// Not a fourth animation: the slider moves only because the visitor swiped or
// tapped, and with prefers-reduced-motion even the tap jumps instead of
// gliding.

import { useRef, useState } from "react";

import type { Locale } from "@/lib/locale";
import type { PhotoSource } from "@/sanity/lib/image";

import styles from "./AboutGallery.module.css";

export type GalleryPhoto = PhotoSource & { key: string; alt: string };

const LABELS = {
  sr: {
    region: "Fotografije kancelarije",
    go: (n: number, total: number) => `Fotografija ${n} od ${total}`,
  },
  en: {
    region: "Photographs of the office",
    go: (n: number, total: number) => `Photograph ${n} of ${total}`,
  },
} as const;

// Matches the layout in AboutGallery.module.css: a slide is 84% of the column
// below 768px, the full column a third of the row above it.
const SIZES =
  "(min-width: 1440px) 376px, (min-width: 900px) calc((100vw - 312px) / 3), (min-width: 768px) calc((100vw - 128px) / 3), calc(84vw - 74px)";

const pad = (n: number) => String(n).padStart(2, "0");

type Props = {
  locale: Locale;
  photos: GalleryPhoto[];
};

export function AboutGallery({ locale, photos }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const labels = LABELS[locale];
  const total = photos.length;

  // The active slide is the one whose left edge is closest to the scroll
  // position. The last one can never reach the left edge — there is nothing
  // behind it to scroll into — so the end of the track counts as the last.
  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(
      track.firstElementChild?.children ?? [],
    ) as HTMLElement[];
    const first = slides[0]?.offsetLeft ?? 0;
    const left = track.scrollLeft;

    if (left >= track.scrollWidth - track.clientWidth - 2) {
      setActive(total - 1);
      return;
    }

    let nearest = 0;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - first - left);
      const best = Math.abs(slides[nearest].offsetLeft - first - left);
      if (distance < best) nearest = index;
    });
    setActive(nearest);
  }

  function goTo(index: number) {
    const track = trackRef.current;
    const slides = track?.firstElementChild?.children;
    const slide = slides?.[index] as HTMLElement | undefined;
    if (!track || !slides || !slide) return;
    const first = (slides[0] as HTMLElement).offsetLeft;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: slide.offsetLeft - first,
      behavior: still ? "auto" : "smooth",
    });
  }

  return (
    <div className={styles.gallery}>
      {/* tabIndex makes the strip reachable from the keyboard, so the arrow
          keys can scroll it; role and label tell a screen reader what it is. */}
      <div
        ref={trackRef}
        className={styles.track}
        onScroll={onScroll}
        role="region"
        aria-label={labels.region}
        tabIndex={0}
      >
        <ul className={styles.slides}>
          {photos.map((photo) => (
            <li className={styles.slide} key={photo.key}>
              {/* next/image brings nothing here: the build is static, the
                Sanity CDN does the resizing. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.photo}
                src={photo.src}
                srcSet={photo.srcSet}
                sizes={SIZES}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                style={{ objectPosition: photo.position }}
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>
      </div>

      {total > 1 ? (
        <div className={styles.indicator}>
          {/* The counter is for the eye; the buttons beside it say the same to
              a screen reader, with aria-current on the one that is showing. */}
          <p className={styles.counter} aria-hidden="true">
            <span className={styles.current}>{pad(active + 1)}</span> /{" "}
            {pad(total)}
          </p>

          <div className={styles.lines}>
            {photos.map((photo, index) => (
              <button
                key={photo.key}
                type="button"
                className={styles.line}
                aria-label={labels.go(index + 1, total)}
                aria-current={index === active ? "true" : undefined}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
