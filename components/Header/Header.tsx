"use client";

// The header has to be a client component: the mobile menu holds state, and the
// gold item in the navigation follows the section the visitor is in. The data
// arrives as plain strings from layout.tsx, so the bundle is negligible.

import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
  LANG_TAG,
  LOCALE_LABEL,
  localePath,
  otherLocale,
  type Locale,
} from "@/lib/locale";
import { telHref } from "@/lib/phone";

import styles from "./Header.module.css";

// The only text on the site that does not come from Sanity. The navigation is
// three fixed sections of a single page, so there is nothing for the lawyers to
// edit here.
//
// The anchors stay in Serbian: they are part of the address the visitor sees,
// and the "Gde dugme vodi" field in the Studio points at #kontakt. Renaming them
// would break whatever the lawyers have already typed in there.
const NAV_ITEMS = [
  { anchor: "o-nama", label: { sr: "O NAMA", en: "ABOUT" } },
  { anchor: "tim", label: { sr: "TIM", en: "TEAM" } },
  { anchor: "kontakt", label: { sr: "KONTAKT", en: "CONTACT" } },
] as const;

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

const MENU_BREAKPOINT = "(max-width: 767px)";

type Props = {
  locale: Locale;
  /** podesavanja.nazivKancelarije — the logo's accessible name. */
  name: string;
  /** podesavanja.opstiTelefon — without it the phone button is left out. */
  phone?: string | null;
};

export function Header({ locale, name, phone }: Props) {
  const t = LABELS[locale];
  const other = otherLocale(locale);
  const menuId = useId();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // ── The gold item follows the scroll ────────────────────────────────────
  // If the sections are missing from the page there is nothing for the observer
  // to watch and no item is active — that is a tidy state, not an error.
  useEffect(() => {
    const sections = NAV_ITEMS.map(({ anchor }) =>
      document.getElementById(anchor),
    ).filter((el): el is HTMLElement => el !== null);

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
  }, []);

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

  const links = NAV_ITEMS.map(({ anchor, label }) => ({
    anchor,
    label: label[locale],
    active: active === anchor,
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
        href={localePath(other)}
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
              {links.map(({ anchor, label, active: isActive }) => (
                <li key={anchor}>
                  <a
                    className={isActive ? styles.linkActive : styles.link}
                    href={`#${anchor}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {label}
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
          something to point at. Above 768px the CSS hides it regardless of
          state. */}
      <div className={styles.menu} id={menuId} hidden={!open}>
        <nav aria-label={t.navigation}>
          <ul className={styles.menuLinks}>
            {links.map(({ anchor, label, active: isActive }) => (
              <li key={anchor}>
                <a
                  className={isActive ? styles.menuLinkActive : styles.menuLink}
                  href={`#${anchor}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={close}
                >
                  {label}
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
