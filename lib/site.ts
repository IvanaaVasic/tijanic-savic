// The site's absolute URL. Canonical links, hreflang, the sitemap and og:image
// all need it — every one of them has to be a full address, not a path.
//
// In production it is set in the hosting configuration (Cloudflare Pages /
// Vercel). If it is missing the build still succeeds, but the sitemap and the
// canonical links point at localhost — so check the variable before the domain
// goes live.

const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (fromEnv || "http://localhost:3000").replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The domain for display — "https://www.tijanicsaviclegal.rs/" becomes
 * "www.tijanicsaviclegal.rs". The scheme and the trailing slash are stripped,
 * everything else (www, port) stays exactly as written in NEXT_PUBLIC_SITE_URL.
 *
 * A fallback for the footer, for when the "Adresa sajta" field in Settings is
 * empty. Locally, without that variable, it prints "localhost:3000" — that is a
 * sign the field was never filled in, not a bug in the footer.
 */
export function siteDomain(): string {
  return SITE_URL.replace(/^https?:\/\//, "");
}
