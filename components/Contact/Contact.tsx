// 03 Contact — section 4 from docs/design/design.md. A cream panel split into
// two columns: the section label, the title and three data blocks on the left,
// the map on the right.
//
// The data is not entered in one place: the title and the phone numbers live in
// the Kontakt document, while the address, the opening hours and the coordinates
// live in Settings — the header and the footer draw from there too, so nothing
// is typed twice.
//
// A server component: everything comes from Sanity at build time, no state.

import { LocationMap } from "@/components/LocationMap/LocationMap";
import { Reveal } from "@/components/Reveal/Reveal";
import type { Locale } from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import { telHref } from "@/lib/phone";
import type { CONTENT_QUERYResult } from "@/sanity/types";

import styles from "./Contact.module.css";

// The section label and the block captions are not content but part of the
// design — they read the same no matter what the lawyers enter. The English
// section label follows the navigation in the header, so a visitor who clicks
// CONTACT lands on CONTACT.
const LABELS = {
  sr: {
    label: "KONTAKT",
    address: "ADRESA",
    phones: "TELEFONI I MEJLOVI",
    hours: "RADNO VREME",
    phone: "telefon",
    email: "mejl",
  },
  en: {
    label: "CONTACT",
    address: "ADDRESS",
    phones: "PHONE AND EMAIL",
    hours: "WORKING HOURS",
    phone: "phone",
    email: "email",
  },
} as const;

const SECTION_NUMBER = "03";

/**
 * The address in two parts, so a `<wbr>` can go between them.
 *
 * An email has no space in it and nothing may break it, and the left column is
 * a fixed 358px: zara.tijanic@tijanicsaviclegal.rs does not fit on one line on
 * a 320px phone. Left to itself the line breaks wherever it runs out and leaves
 * a single letter hanging below; with the break offered in front of the @ the
 * name stays on the first line and the domain moves down whole.
 *
 * Returns null when there is no address — the caller then renders no link.
 */
function splitEmail(value: string | undefined) {
  const address = value?.trim();
  if (!address) return null;

  const at = address.indexOf("@");
  if (at < 1) return { address, local: address, domain: null };

  return {
    address,
    local: address.slice(0, at),
    domain: address.slice(at),
  };
}

type Props = {
  locale: Locale;
  contact: CONTENT_QUERYResult["kontakt"];
  settings: CONTENT_QUERYResult["podesavanja"];
};

export function Contact({ locale, contact, settings }: Props) {
  const t = LABELS[locale];

  const title = inLocale(contact?.naslovSekcije, locale);
  const hours = inLocale(settings?.radnoVreme, locale);

  const street = settings?.adresa?.ulica?.trim() || null;
  const city = inLocale(settings?.adresa?.grad, locale);
  const country = inLocale(settings?.adresa?.drzava, locale);

  // The second line of the address: "11000 Beograd, Srbija". If one part is
  // missing the comma must not be left hanging.
  const place = [city, country].filter(Boolean).join(", ") || null;

  // The same address on one line — it goes into the map title and serves as the
  // fallback point when no coordinates are entered.
  const addressOneLine = [street, place].filter(Boolean).join(", ") || null;

  // The number is the only thing an entry is recognised by; one without it is
  // skipped. The email is optional — an entry that has none renders as a bare
  // number, exactly as before it existed.
  const phones = (contact?.telefoni ?? [])
    .map((entry) => ({
      key: entry._key,
      number: entry.broj?.trim(),
      label: inLocale(entry.oznaka, locale),
      email: splitEmail(entry.mejl),
    }))
    .filter((entry): entry is typeof entry & { number: string } =>
      Boolean(entry.number),
    );

  // An empty section is not rendered. If truly nothing was entered the whole
  // panel disappears — but then the #kontakt anchor has nowhere to land, so this
  // is a last line of defence, not an expected state.
  const hasContent =
    title || street || place || phones.length > 0 || hours;

  if (!hasContent) return null;

  return (
    <section className={styles.wrapper} id="kontakt">
      {/* Reveal renders the panel itself rather than wrapping it — the fade and
          the rise belong to the cream block. */}
      <Reveal className={styles.panel}>
        <div className={styles.content}>
          {/* The number and the slash are decoration — a screen reader hears
              only "Kontakt". */}
          <p className={styles.label}>
            <span aria-hidden="true">{SECTION_NUMBER}</span>
            <span aria-hidden="true">/</span>
            <span>{t.label}</span>
          </p>

          {title ? <h2 className={styles.title}>{title}</h2> : null}

          <div className={styles.blocks}>
            {street || place ? (
              <div className={styles.block}>
                <h3 className={styles.caption}>{t.address}</h3>
                {/* <address> belongs here, which is why the CSS puts it back to
                    an upright cut — the browser italicises it by default. */}
                <address className={styles.value}>
                  {street ? <span className={styles.row}>{street}</span> : null}
                  {place ? <span className={styles.row}>{place}</span> : null}
                </address>
              </div>
            ) : null}

            {phones.length > 0 ? (
              <div className={styles.block}>
                <h3 className={styles.caption}>{t.phones}</h3>

                {/* A list, not a stack of rows: a screen reader announces how
                    many entries there are before it reads them out. One item is
                    one lawyer — her number, her name, and below them her
                    email — so the two never come apart. */}
                <ul className={styles.phones}>
                  {phones.map((entry) => (
                    <li className={styles.entry} key={entry.key}>
                      <p className={styles.phoneRow}>
                        {/* The link wraps only the number, so out of context it
                            reads as a bare figure — aria-label gives it back
                            whose it is. */}
                        <a
                          className={styles.number}
                          href={telHref(entry.number)}
                          aria-label={
                            entry.label
                              ? `${t.phone} ${entry.label}: ${entry.number}`
                              : `${t.phone}: ${entry.number}`
                          }
                        >
                          {entry.number}
                        </a>

                        {entry.label ? (
                          <span className={styles.phoneLabel} aria-hidden="true">
                            {entry.label}
                          </span>
                        ) : null}
                      </p>

                      {/* The name is written next to the number only, so the
                          email needs the aria-label to say whose it is too. */}
                      {entry.email ? (
                        <a
                          className={styles.email}
                          href={`mailto:${entry.email.address}`}
                          aria-label={
                            entry.label
                              ? `${t.email} ${entry.label}: ${entry.email.address}`
                              : `${t.email}: ${entry.email.address}`
                          }
                        >
                          {entry.email.local}
                          {entry.email.domain ? (
                            <>
                              <wbr />
                              {entry.email.domain}
                            </>
                          ) : null}
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {hours ? (
              <div className={styles.block}>
                <h3 className={styles.caption}>{t.hours}</h3>
                <p className={styles.value}>{hours}</p>
              </div>
            ) : null}
          </div>
        </div>

        <LocationMap
          locale={locale}
          coordinates={settings?.koordinate ?? null}
          address={addressOneLine}
          className={styles.map}
        />
      </Reveal>
    </section>
  );
}
