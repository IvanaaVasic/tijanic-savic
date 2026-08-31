import type { Metadata } from "next";

import { NotFound } from "@/components/NotFound/NotFound";
import { fontVariables } from "@/lib/fonts";
import { DEFAULT_LOCALE, LANG_TAG } from "@/lib/locale";

// The 404 is outside every route group, so no layout wraps it and it renders the
// whole document itself — that is what experimental.globalNotFound is for.
// Tokens first, then the reset, the same order as in the site layouts.
import "./tokens.css";
import "./globals.css";

// One static file serves every unknown address, so the page cannot be canonical
// for anything and must not be indexed. There is no `robots` key here on
// purpose: Next emits <meta name="robots" content="noindex"> on the not-found
// route by itself, and adding our own only put a second, identical tag in the
// <head>. A bare "noindex" already leaves the links followable.
export const metadata: Metadata = {
  title: "Stranica nije pronađena · Tijanić Savić",
};

// The page cannot know which locale the visitor came from — /nesto and
// /en/something both land here — so the document is marked as Serbian and the
// English lines inside carry their own lang attribute.
export default function GlobalNotFound() {
  return (
    <html lang={LANG_TAG[DEFAULT_LOCALE]} className={fontVariables}>
      <body>
        <NotFound />
      </body>
    </html>
  );
}
