import type { Metadata } from "next";

import { SiteShell } from "@/components/SiteShell/SiteShell";
import { SITE_URL } from "@/lib/site";

// Tokens first, then the reset. The order is deliberate — globals.css counts on
// var(--gold), var(--text-body) and the rest of the tokens, so it has to come
// after them.
import "../tokens.css";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

// Serbian is the default locale and lives at the site root, with no prefix.
// This is one of two root layouts — see components/SiteShell/SiteShell.tsx.
export default function SerbianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell locale="sr">{children}</SiteShell>;
}
