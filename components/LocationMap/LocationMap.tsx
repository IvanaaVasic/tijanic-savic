// The map in the Contact section — Google Maps in an iframe, with a button laid
// over the lower part of it that opens the same point in the real application.
//
// The iframe brings Google's own look, which is not ours. So a gold hairline
// sits around it, and a CSS filter over it calms the colours down and pulls them
// towards dark green — see LocationMap.module.css.
//
// A server component: the coordinates come from Sanity at build time, no state.

import type { Locale } from "@/lib/locale";
import { googleMapsUrl, mapEmbedUrl, mapQuery } from "@/lib/map";

import styles from "./LocationMap.module.css";

// `title` on the iframe is not decoration: without it a screen reader says only
// "frame".
const LABELS = {
  sr: {
    title: "Mapa sa lokacijom kancelarije",
    open: "Otvorite u Google mapi",
  },
  en: {
    title: "Map showing the office location",
    open: "Open in Google Maps",
  },
} as const;

type Props = {
  locale: Locale;
  coordinates: {
    lat?: number | null;
    lng?: number | null;
  } | null;
  /** The address on one line — the fallback point and an addition to the title. */
  address: string | null;
  /** The caller's class; the map height depends on the section it sits in. */
  className?: string;
};

export function LocationMap({ locale, coordinates, address, className }: Props) {
  const query = mapQuery(coordinates, address);

  // With neither coordinates nor an address the map has nothing to show. An
  // empty grey box is worse than nothing — the whole map drops out and the data
  // on the left stays.
  if (!query) return null;

  const t = LABELS[locale];
  const title = address ? `${t.title} — ${address}` : t.title;

  return (
    <div className={className ? `${styles.wrapper} ${className}` : styles.wrapper}>
      {/* The frame is position: relative and the iframe inside it absolute — so
          the map fills whatever height the section gives it, with no empty band
          below. */}
      <div className={styles.frame}>
        <iframe
          className={styles.map}
          src={mapEmbedUrl(query, locale)}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Inside the frame, not below it: the button sits over the lower edge
            of the map, so the invitation is where the eye already is. It comes
            after the iframe in the markup as well, so it is painted above it
            and reached next by the keyboard. */}
        <a
          className={styles.button}
          href={googleMapsUrl(query)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.open}
        </a>
      </div>
    </div>
  );
}
