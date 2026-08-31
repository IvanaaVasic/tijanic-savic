import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The Studio is an editing tool, not content — it stays out of search.
      disallow: "/studio/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
