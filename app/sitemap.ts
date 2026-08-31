import type { MetadataRoute } from "next";

import { languageAlternates, localePath, LOCALES } from "@/lib/locale";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Both locale versions, each linking to the other. The alternates come from the
// same helper the page metadata uses, so the sitemap and the <head> cannot end
// up claiming different things.
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = languageAlternates();

  return LOCALES.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    alternates: { languages },
  }));
}
