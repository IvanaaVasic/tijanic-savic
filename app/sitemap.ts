import type { MetadataRoute } from "next";

import { languageAlternates, localePath, LOCALES } from "@/lib/locale";
import { areaSegment } from "@/lib/practiceAreas";
import { absoluteUrl } from "@/lib/site";
import { fetchAreaSlugs } from "@/sanity/lib/fetch";

export const dynamic = "force-static";

// Every page in both locale versions, each linking to the other: the home page
// and one page per practice area. The alternates come from the same helper the
// page metadata uses, so the sitemap and the <head> cannot end up claiming
// different things.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = (await fetchAreaSlugs()).filter(
    (slug): slug is string => Boolean(slug),
  );
  const segments = ["", ...slugs.map(areaSegment)];

  return segments.flatMap((segment) => {
    const languages = languageAlternates(segment);

    return LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, segment)),
      alternates: { languages },
    }));
  });
}
