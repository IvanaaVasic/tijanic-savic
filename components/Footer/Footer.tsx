// Footer — section 5 from docs/design/design.md. A centred column on the page
// background with a green rule along its top: the vertical lockup, then the gold
// divider with the diamond, then two lines of mono text: the two emails from
// Settings on the first, the year and the site address on the second.
//
// A server component: everything comes from Settings at build time, no state.
//
// The site address is entered in Settings like everything else. If the field is
// left empty, the domain from NEXT_PUBLIC_SITE_URL steps in — the same variable
// the canonical links and the sitemap live off — so the line is never left
// without an address. The link itself does not point at what was entered but at
// this site's home page, so a typo spoils the display at worst, never the
// destination.

import type { ReactNode } from "react";

import { Divider } from "@/components/Divider/Divider";
import { localePath, type Locale } from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import { siteDomain } from "@/lib/site";
import type { SETTINGS_QUERYResult } from "@/sanity/types";

import styles from "./Footer.module.css";

// The captions are not content but part of the design — they are not edited in
// Sanity. "PIB" stays "PIB" in English too: it is the label of the Serbian tax
// number, as it appears on the registration and on invoices.
const LABELS = {
  sr: { email: "Mejl", pib: "PIB", home: "početna strana" },
  en: { email: "Email", pib: "PIB", home: "home page" },
} as const;

type Item = {
  key: string;
  content: ReactNode;
  /**
   * An item that goes on its own line on a narrow screen, with no separator dot
   * in front of it. Without this the line would break by itself and the dot
   * would be left hanging at the end or the start of a line.
   */
  ownLineOnMobile?: boolean;
};

/**
 * Collects the items of one line and drops the ones that were not entered in
 * Settings. The separator dot is then drawn only between what is left, so it
 * never hangs at the end of a line.
 */
function compose(...input: (Item | null)[]): Item[] {
  return input.filter((item): item is Item => item !== null);
}

/** An email link, or null when the field was left empty in Settings. */
function emailItem(
  key: string,
  value: string | null | undefined,
  label: string,
  ownLineOnMobile = false,
): Item | null {
  const email = value?.trim();
  if (!email) return null;

  return {
    key,
    ownLineOnMobile,
    content: (
      <a
        className={styles.link}
        href={`mailto:${email}`}
        aria-label={`${label}: ${email}`}
      >
        {email}
      </a>
    ),
  };
}

/** One line of legal text: items separated by a middle dot. */
function Row({ items }: { items: Item[] }) {
  return (
    <p className={styles.row}>
      {items.map(({ key, content, ownLineOnMobile }, index) => (
        <span
          className={
            ownLineOnMobile ? `${styles.item} ${styles.ownLine}` : styles.item
          }
          key={key}
        >
          {index > 0 ? (
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
          ) : null}
          {content}
        </span>
      ))}
    </p>
  );
}

type Props = {
  locale: Locale;
  settings: SETTINGS_QUERYResult;
};

export function Footer({ locale, settings }: Props) {
  const t = LABELS[locale];

  const name = settings?.nazivKancelarije?.trim() || null;
  const pib = settings?.pib?.trim() || null;
  const bar = inLocale(settings?.advokatskaKomora, locale);

  const domain = settings?.adresaSajta?.trim() || siteDomain();

  // Static export: the year is computed at build time, not in the browser. Every
  // "publish" in Sanity and every push starts a new build, so it moves on its
  // own — but a site left untouched over New Year keeps the old one until
  // somebody rebuilds it.
  const year = new Date().getFullYear();

  // Two full addresses do not fit side by side on a phone, so the second one
  // takes its own line there and drops the dot in front of it.
  const emails = compose(
    emailItem("email", settings?.opstiMejl, t.email),
    emailItem("email2", settings?.drugiMejl, t.email, true),
  );

  // The year leads the second line and the site address follows it; the bar
  // association and the tax number come after, when they are entered. Each of
  // those two takes its own line on a phone.
  const legalItems = compose(
    { key: "year", content: `© ${year}` },
    domain
      ? {
          key: "domain",
          content: (
            <a
              className={styles.link}
              href={localePath(locale)}
              aria-label={`${domain} — ${t.home}`}
            >
              {domain}
            </a>
          ),
        }
      : null,
    bar ? { key: "bar", ownLineOnMobile: true, content: bar } : null,
    pib
      ? { key: "pib", ownLineOnMobile: true, content: `${t.pib} ${pib}` }
      : null,
  );

  return (
    <footer className={styles.footer}>
      {/* Exported from docs/design/Logo-vertical.png, like the logo in the
          header — temporary, until the real SVG with outlines arrives. Only the
          src and the dimensions below change then.

          next/image brings nothing here: the build is static and
          images.unoptimized is on. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.logo}
        src="/logo-vertical.png"
        alt={name ?? ""}
        width={372}
        height={264}
        loading="lazy"
        decoding="async"
      />

      <Divider variant="footer" />

      <div className={styles.text}>
        {emails.length > 0 ? <Row items={emails} /> : null}
        <Row items={legalItems} />
      </div>
    </footer>
  );
}
