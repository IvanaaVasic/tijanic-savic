import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

// Slike idu kroz Sanity CDN, ne kroz next/image optimizaciju.
// Pozivalac dodaje dimenzije: urlZaSliku(slika).width(800).url()
export function urlZaSliku(izvor: SanityImageSource) {
  return builder.image(izvor).auto("format").fit("max");
}
