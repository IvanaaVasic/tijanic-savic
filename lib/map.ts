// Google Maps without an API key. One piece of data produces two URLs: one for
// the iframe in the Contact section, one for the "Open in Google Maps" link.
//
// The point is chosen by the "Koordinate za mapu" field in Settings — that one
// is accurate to the metre and the lawyers get it by right-clicking on Google
// Maps. If it stays empty it falls back to the address, which Google resolves
// itself: the pin then sits wherever Google thinks the street is, which is good
// enough until the coordinates arrive.

import { LANG_TAG, type Locale } from "./locale";

/** The zoom level that shows the block around the office, not the whole city. */
const ZOOM = 16;

type Coordinates = {
  lat?: number | null;
  lng?: number | null;
} | null;

/**
 * What goes into the `q` parameter — the coordinates if there are any, the
 * address otherwise. Returns null when there is neither; the caller then skips
 * the map.
 */
export function mapQuery(
  coordinates: Coordinates,
  address: string | null,
): string | null {
  const lat = coordinates?.lat;
  const lng = coordinates?.lng;

  if (typeof lat === "number" && typeof lng === "number") {
    return `${lat},${lng}`;
  }

  const text = address?.trim();
  return text ? text : null;
}

/**
 * The iframe URL. `output=embed` is Google's form that works without an API key
 * and without an account, so no secret ends up in the repository.
 *
 * `hl` follows the language of the page — Serbian goes in as "sr-Latn", so the
 * labels on the map are in Latin script, like the rest of the site.
 */
export function mapEmbedUrl(query: string, locale: Locale): string {
  const params = new URLSearchParams({
    q: query,
    z: String(ZOOM),
    hl: LANG_TAG[locale],
    output: "embed",
  });

  return `https://www.google.com/maps?${params}`;
}

/**
 * The URL for "Open in Google Maps". This is Google's documented sharing scheme
 * (`api=1`) — it works in the phone app too, not just in the browser.
 */
export function googleMapsUrl(query: string): string {
  const params = new URLSearchParams({ api: "1", query });

  return `https://www.google.com/maps/search/?${params}`;
}
