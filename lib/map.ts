// Google Maps without an API key. One piece of data produces two URLs: one for
// the iframe in the Contact section, one for the "Open in Google Maps" link.
//
// The best point is the office's own listing, found by the "Naziv kancelarije na
// Google mapama" field: the map then writes the name next to the pin and opens
// the card with the address and reviews. It has to be the full name from Google
// — the short "Tijanić Savić" returns several results and the map shows them
// all. Google's place ID would be exact, but this keyless embed does not accept
// it.
//
// Without the name the point is the "Koordinate za mapu" field — accurate to the
// metre, but a bare pin. If that stays empty too it falls back to the address,
// which Google resolves itself.

import { LANG_TAG, type Locale } from "./locale";

/** The zoom level that shows the block around the office, not the whole city. */
const ZOOM = 16;

type Coordinates = {
  lat?: number | null;
  lng?: number | null;
} | null;

/**
 * What goes into the `q` parameter — the name from Google with the address, then
 * the coordinates, then the address alone. Returns null when there is nothing;
 * the caller then skips the map.
 */
export function mapQuery(
  coordinates: Coordinates,
  address: string | null,
  placeName?: string | null,
): string | null {
  const name = placeName?.trim();
  if (name) {
    return [name, address?.trim()].filter(Boolean).join(", ");
  }

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
 *
 * The share link from the "Link ka kancelariji na Google mapama" field wins when
 * it is entered: a bare point opens as a pair of coordinates, the share link
 * opens the office's own card — name, reviews, opening hours.
 */
export function googleMapsUrl(query: string, link?: string | null): string {
  const shared = link?.trim();
  if (shared) return shared;

  const params = new URLSearchParams({ api: "1", query });

  return `https://www.google.com/maps/search/?${params}`;
}
