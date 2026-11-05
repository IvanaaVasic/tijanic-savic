import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

// Images go through the Sanity CDN, not through next/image optimisation.
// The caller adds the dimensions: imageUrl(image).width(800).url()
export function imageUrl(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

/** A photograph as the queries return it — see PHOTO in queries.ts. */
export type Photo = {
  asset?: {
    _id: string;
    metadata?: {
      dimensions?: { width?: number | null; height?: number | null } | null;
    } | null;
  } | null;
  hotspot?: { x?: number; y?: number } | null;
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  } | null;
};

/** Everything an <img> needs; the caller adds alt, sizes and loading. */
export type PhotoSource = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  /** object-position from the hotspot, or the caller's fallback without one. */
  position: string;
};

const SRCSET_WIDTHS = [400, 800, 1200, 1600, 2000];

/**
 * A photograph laid out by CSS — fixed height, object-fit: cover — rather than
 * cropped to one frame by the CDN. The frames change shape between the phone
 * and the desktop (a slide is narrower than a column), so one fixed crop would
 * be wrong on one of them. Instead the whole image, minus the crop from the
 * Studio, comes in several widths, and the hotspot becomes object-position:
 * whatever the frame, the point the lawyers marked stays in it.
 *
 * Returns null when the photograph has no asset, so the caller can leave it out.
 */
export function photoSource(
  photo: Photo | null | undefined,
  fallbackPosition: string,
): PhotoSource | null {
  if (!photo) return null;
  const asset = photo.asset;
  const original = asset?.metadata?.dimensions;
  if (!asset?._id || !original?.width || !original?.height) return null;

  const crop = {
    top: photo.crop?.top ?? 0,
    bottom: photo.crop?.bottom ?? 0,
    left: photo.crop?.left ?? 0,
    right: photo.crop?.right ?? 0,
  };
  const keptX = 1 - crop.left - crop.right;
  const keptY = 1 - crop.top - crop.bottom;

  // What is left after the crop — the builder applies the crop itself as a rect.
  const width = Math.round(original.width * keptX);
  const height = Math.round(original.height * keptY);

  // The image-url builder reads the crop and hotspot off the object it is given.
  const source = {
    asset: { _ref: asset._id },
    crop: photo.crop ?? undefined,
    hotspot: photo.hotspot ?? undefined,
  } as SanityImageSource;

  // Never ask for more pixels than the photograph has; the largest step is the
  // original width itself.
  const widths = SRCSET_WIDTHS.filter((w) => w < width).concat(
    Math.min(width, SRCSET_WIDTHS[SRCSET_WIDTHS.length - 1]),
  );
  const at = (w: number) => imageUrl(source).width(w).url();

  // The hotspot is stored against the whole image; object-position works on
  // what is left after the crop, so it is moved into that frame.
  const hotspot = photo.hotspot;
  const position =
    hotspot?.x !== undefined && hotspot?.y !== undefined
      ? `${percent((hotspot.x - crop.left) / keptX)} ${percent((hotspot.y - crop.top) / keptY)}`
      : fallbackPosition;

  return {
    src: at(widths[Math.min(1, widths.length - 1)]),
    srcSet: widths.map((w) => `${at(w)} ${w}w`).join(", "),
    width,
    height,
    position,
  };
}

function percent(value: number) {
  return `${Math.round(Math.min(1, Math.max(0, value)) * 1000) / 10}%`;
}

// What Facebook, WhatsApp, Viber and X show when the link is shared. The ratio
// is fixed at 1.91:1 — anything else gets cropped by whoever renders the card,
// and never where we would have cropped it.
export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 630;

/**
 * What is shared when "Slika za deljenje" was never filled in. A file in
 * public/, not the logo: it is drawn at exactly SHARE_IMAGE_WIDTH x
 * SHARE_IMAGE_HEIGHT, so nobody rescales or crops it. The logo files are
 * 642 x 160 and 372 x 264 — either would be blown up by whoever renders the
 * card.
 */
export const DEFAULT_SHARE_IMAGE = "/og-default.png";

/** The "Slika za deljenje" field from Sanity, cropped to the card's ratio. */
export function shareImageUrl(source: SanityImageSource): string {
  return imageUrl(source)
    .width(SHARE_IMAGE_WIDTH)
    .height(SHARE_IMAGE_HEIGHT)
    .fit("crop")
    .url();
}
