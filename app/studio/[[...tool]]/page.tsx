import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

// Studio je klijentska aplikacija — Next samo isporuči jednu statičku stranicu,
// a Studio dalje sam rešava svoje podrute u browseru.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ tool: [] as string[] }];
}

// Nosi robots: "noindex" — Studio ne sme u pretragu.
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
