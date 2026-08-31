// All three fonts in one place, because two root layouts and the 404 page all
// need them. next/font deduplicates by module, so importing this from several
// files still loads each face once.
//
// Every one of them carries latin-ext, otherwise there is no ć, č, š, ž or đ —
// and the caps "TIJANIĆ SAVIĆ" and "PODRUČJE RADA" need them.
//
// The display face is EB Garamond and not Cormorant Garamond, which the mockups
// originally named. Asking for latin-ext is not enough on its own: in Cormorant
// Garamond — and in Cormorant, which was checked as well — the caron and acute
// on the lower-case č, š, ž and ć float high above the letter and sit shifted to
// the right, so at 76px in the hero the marks came off the letters and were
// clipped by the top of the line box. Upper-case ČŠŽĆ and đ were fine, which is
// what made it easy to miss. EB Garamond carries the same Garamond skeleton and
// draws all of them correctly.
//
// One consequence: EB Garamond starts at 400, it has no 300. --weight-hero moved
// from 300 to 400 — see app/tokens.css.

import { EB_Garamond, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  display: "swap",
});

/** Goes on <html>; the custom properties cascade to everything below it. */
export const fontVariables = `${ebGaramond.variable} ${plexSans.variable} ${plexMono.variable}`;
