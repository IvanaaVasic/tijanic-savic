import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is built into plain files — there is no Node server in production.
  // Hence no middleware, no route handlers and no API routes.
  output: "export",

  // With trailingSlash the export writes /en/index.html instead of /en.html.
  // That is the shape both Cloudflare Pages and Vercel serve without an extra
  // rule, and the rewrite for /studio/* then points at one concrete index.html.
  trailingSlash: true,

  // Images go through the Sanity CDN and @sanity/image-url. next/image
  // optimisation does not work in a static export anyway.
  images: { unoptimized: true },

  // app/global-not-found.tsx renders the whole 404 document, <html lang> and
  // all. Without this flag Next wraps the 404 in a generated root layout that
  // has no lang attribute — and this site has no app/layout.tsx of its own,
  // because (site) and (studio) are two separate roots.
  experimental: { globalNotFound: true },
};

export default nextConfig;
