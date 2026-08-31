import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

// The Studio is a client application — Next only ships one static page, and the
// Studio resolves its own subroutes in the browser from there.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ tool: [] as string[] }];
}

// Carries robots: "noindex" — the Studio must not end up in search.
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
