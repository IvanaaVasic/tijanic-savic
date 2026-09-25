"use client";

// The header has to be a client component: the mobile menu holds state, the gold
// item in the navigation follows the section the visitor is in, and the SR / EN
// switch reads the current address. The data arrives as plain strings from
// SiteShell, so the bundle is negligible.
//
// Every item is a plain link to its section, the practice areas included. The
// dropdown that used to hang off that one item — and the list that unfolded
// under it in the mobile menu — were taken out on 24.9.2026 at the lawyers'
// request. An area is reached from the section itself.

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
  LANG_TAG,
  LOCALE_LABEL,
  localePath,
  otherLocale,
  pageSegment,
  type Locale,
} from "@/lib/locale";
import { telHref } from "@/lib/phone";
import { isAreaPath } from "@/lib/practiceAreas";
import { SECTIONS } from "@/lib/sections";

import styles from "./Header.module.css";

// Labels the visitor does not see, but a screen reader reads out.
const LABELS = {
  sr: {
    navigation: "Glavna navigacija",
    openMenu: "Otvorite meni",
    closeMenu: "Zatvorite meni",
    language: "Jezik",
    home: "početna strana",
    call: "Pozovite kancelariju",
  },
  en: {
    navigation: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    home: "home page",
    call: "Call the office",
  },
} as const;

// Must match the min-width query in Header.module.css.
const MENU_BREAKPOINT = "(max-width: 1139px)";

const AREAS_ANCHOR = SECTIONS.practiceAreas.anchor;

type Props = {
  locale: Locale;
  /** podesavanja.nazivKancelarije — the logo's accessible name. */
  name: string;
  /** podesavanja.opstiTelefon — without it the phone button is left out. */
  phone?: string | null;
  /** The sections of the page, from lib/sections.ts — names come from Settings. */
  nav: { anchor: string; label: string }[];
};

export function Header({ locale, name, phone, nav }: Props) {
  const t = LABELS[locale];
  const other = otherLocale(locale);
  const menuId = useId();

  const pathname = usePathname() ?? localePath(locale);
  // On an area page no section is in view, so the practice areas item takes the
  // gold instead — that is where the visitor came from.
  const onAreaPage = isAreaPath(pathname);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // A string, not the array: the array is a new object on every render, and the
  // observer below only has to start over when the anchors themselves change.
  const anchors = nav.map(({ anchor }) => anchor).join(" ");

  // ── The gold item follows the scroll ────────────────────────────────────
  // Only the home page has the sections. Anywhere else there is nothing for
  // the observer to watch and no item is active — a tidy state, not an error.
  useEffect(() => {
    const sections = anchors
      .split(" ")
      .map((anchor) => document.getElementById(anchor))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // The upper bound sits exactly below the bar, so a section is not "active"
    // while the header still covers it. The bottom 55% does not count, so the
    // last section does not claim the gold the moment its top edge appears.
    const barHeight = barRef.current?.offsetHeight ?? 0;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const highest = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActive(highest.target.id);
      },
      { rootMargin: `-${barHeight + 1}px 0px -55% 0px`, threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [anchors]);

  // ── Mobile menu: Escape, locked scroll, focus returned ──────────────────
  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      // The menu covers the whole page, so focus must not wander onto the
      // content behind it. Tab cycles through the header alone.
      const root = headerRef.current;
      if (!root) return;

      const targets = Array.from(
        root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((target) => target.offsetParent !== null);
      if (targets.length === 0) return;

      const first = targets[0];
      const last = targets[targets.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [open]);

  // Once the window grows past the breakpoint the menu no longer makes sense —
  // the hamburger disappears, so an open menu would be left hanging with no
  // button to close it.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia(MENU_BREAKPOINT);
    const check = () => {
      if (!query.matches) setOpen(false);
    };
    query.addEventListener("change", check);
    return () => query.removeEventListener("change", check);
  }, [open]);

  // The sections live on the home page, so from any other page the link has to
  // lead there first. On the home page itself "/#kontakt" is the same document
  // and the browser only scrolls.
  const sectionHref = (anchor: string) => `${localePath(locale)}#${anchor}`;

  const links = nav.map(({ anchor, label }) => ({
    anchor,
    label,
    href: sectionHref(anchor),
    active: onAreaPage ? anchor === AREAS_ANCHOR : active === anchor,
  }));

  const localeSwitch = (
    <p className={styles.locale}>
      <span className={styles.srOnly}>{t.language}:</span>
      <span className={styles.localeActive} lang={LANG_TAG[locale]}>
        {LOCALE_LABEL[locale]}
      </span>
      <span className={styles.localeSlash} aria-hidden="true">
        /
      </span>
      {/* A real <a href>, not a button — a search engine has to be able to
          follow it to the other locale of the same page. */}
      <a
        className={styles.localeLink}
        href={localePath(other, pageSegment(pathname, locale))}
        hrefLang={LANG_TAG[other]}
        lang={LANG_TAG[other]}
      >
        {LOCALE_LABEL[other]}
      </a>
    </p>
  );

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles.bar} ref={barRef}>
        <a
          className={styles.logo}
          href={localePath(locale)}
          aria-label={`${name} — ${t.home}`}
        >
          {/* Below 768px the mockup drops the "advokatska kancelarija" line, so
              there are two files. <picture> picks exactly one.

              Both were exported from docs/design/Logo-horizontal.png — the
              compact one by deleting the strip with the tagline. Replace them
              with a real SVG when it arrives; only src and srcSet below change.

              Two traps for that day: in this lockup the office name is gold as
              well, while in the mockup it is cream; and the .svg files in the
              design folder are not vectors but text elements set in Playfair
              Display, so without that font they render in Georgia. What is
              needed is an SVG with outlines. */}
          <picture>
            <source media="(min-width: 768px)" srcSet="/logo-horizontal.png" />
            {/* A plain <img>, not next/image: next/image cannot sit inside
                <picture>, and the logo is a static file that does not go
                through optimisation under a static export anyway. */}
            <img
              className={styles.logoImage}
              src="/logo-compact.png"
              alt=""
              width={642}
              height={160}
            />
          </picture>
        </a>

        <div className={styles.right}>
          <nav aria-label={t.navigation}>
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={link.anchor}>
                  <a
                    className={link.active ? styles.linkActive : styles.link}
                    href={link.href}
                    aria-current={link.active ? "true" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {localeSwitch}

          {phone ? (
            <a
              className={styles.phone}
              href={telHref(phone)}
              aria-label={`${t.call}: ${phone}`}
            >
              {phone}
            </a>
          ) : null}
        </div>

        <button
          className={styles.hamburger}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((was) => !was)}
        >
          <span
            className={open ? styles.barsClose : styles.bars}
            aria-hidden="true"
          />
          <span className={styles.srOnly}>
            {open ? t.closeMenu : t.openMenu}
          </span>
        </button>
      </div>

      {/* The menu stays in the DOM even when closed, so aria-controls always has
          something to point at. Above the breakpoint the CSS hides it
          regardless of state. */}
      <div className={styles.menu} id={menuId} hidden={!open}>
        <nav aria-label={t.navigation}>
          <ul className={styles.menuLinks}>
            {links.map((link) => (
              <li key={link.anchor}>
                <a
                  className={
                    link.active ? styles.menuLinkActive : styles.menuLink
                  }
                  href={link.href}
                  aria-current={link.active ? "true" : undefined}
                  onClick={close}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.menuFooter}>
          {localeSwitch}

          {phone ? (
            <a
              className={styles.menuPhone}
              href={telHref(phone)}
              aria-label={`${t.call}: ${phone}`}
              onClick={close}
            >
              {phone}
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
