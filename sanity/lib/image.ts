import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

// Images go through the Sanity CDN, not through next/image optimisation.
// The caller adds the dimensions: imageUrl(image).width(800).url()
export function imageUrl(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
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
