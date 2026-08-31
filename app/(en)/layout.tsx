import type { Metadata } from "next";

import { SiteShell } from "@/components/SiteShell/SiteShell";
import { SITE_URL } from "@/lib/site";

// The same two imports in the same order as in the Serbian layout — the two
// roots do not share a parent, so each brings its own stylesheets.
import "../tokens.css";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

// English is the second locale and is the only one with a prefix: /en.
// This is one of two root layouts — see components/SiteShell/SiteShell.tsx.
export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
