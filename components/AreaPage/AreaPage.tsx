// A practice area page — docs/design/oblasti/3 and 6, with three parts of the
// mockup deliberately left out: the photograph, the "lawyer for this area" card
// and the related areas. In their place the side column carries both lawyers'
// contacts and the consultation button.
//
// Top to bottom: breadcrumb on the green, then a cream panel — title, gold
// divider, description, the list of services on the left; contacts on the right
// (below, on a phone).
//
// A server component: everything comes from Sanity at build time, no state.

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Divider } from "@/components/Divider/Divider";
import { blocksToText, Paragraphs } from "@/components/Paragraphs/Paragraphs";
import { CALL_LABEL, consultationLink } from "@/lib/cta";
import { localePath, type Locale } from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import { pageMetadata, shorten } from "@/lib/metadata";
import { telHref } from "@/lib/phone";
import { areaSegment } from "@/lib/practiceAreas";
import { SECTIONS, sectionName } from "@/lib/sections";
import { fetchAreaPage, fetchAreaSlugs } from "@/sanity/lib/fetch";

import styles from "./AreaPage.module.css";

// Captions that are part of the design, not content. "phone" and "email" are
// never seen — a screen reader reads them out in front of a number or an
// address.
const LABELS = {
  sr: {
    breadcrumb: "Putanja",
    services: "Usluge u ovoj oblasti",
    phone: "telefon",
    email: "mejl",
  },
  en: {
    breadcrumb: "Breadcrumb",
    services: "Services in this area",
    phone: "phone",
    email: "email",
  },
} as const;

/**
 * The addresses the build writes, one per area. A static export needs at least
 * one: with none at all Next refuses to build the route, so until the first area
 * is published a single placeholder is written, and it renders the 404 page.
 */
export const NO_AREAS = "u-pripremi";

export async function areaParams() {
  const slugs = (await fetchAreaSlugs()).filter(
    (slug): slug is string => Boolean(slug),
  );
  const list = slugs.length > 0 ? slugs : [NO_AREAS];
  return list.map((slug) => ({ slug }));
}

/** The <head> of one area page. Both locale routes call it. */
export async function areaMetadata(
  locale: Locale,
  slug: string,
): Promise<Metadata> {
  const { oblast, podesavanja, pocetna } = await fetchAreaPage(slug);
  if (!oblast) return {};

  const officeName = podesavanja?.nazivKancelarije?.trim() || undefined;
  const name = inLocale(oblast.naziv, locale);

  // The area's name alone would be a thin title in a search result, so the
  // office follows it — "Porodično pravo · Advokatska kancelarija Tijanić
  // Savić". The name is translated, so the two locales still differ.
  const title =
    inLocale(oblast.seo?.naslov, locale) ??
    ([name, officeName].filter(Boolean).join(" · ") || undefined);

  const description =
    inLocale(oblast.seo?.opis, locale)?.trim() ||
    shorten(inLocale(oblast.kratakOpis, locale)) ||
    shorten(blocksToText(inLocale(oblast.opis, locale))) ||
    undefined;

  return pageMetadata({
    locale,
    segment: areaSegment(slug),
    title,
    description,
    siteName: officeName,
    // The area's own image first; the home page's image is the fallback.
    images: [oblast.seo?.ogSlika, pocetna?.seo?.ogSlika],
  });
}

type Props = {
  locale: Locale;
  slug: string;
};

export async function AreaPage({ locale, slug }: Props) {
  const { oblast, podesavanja, pocetna, kontakt } = await fetchAreaPage(slug);
  const t = LABELS[locale];

  const name = inLocale(oblast?.naziv, locale);
  if (!oblast || !name) notFound();

  const names = podesavanja?.naziviSekcija;
  const sectionHref = `${localePath(locale)}#${SECTIONS.practiceAreas.anchor}`;

  // The description; while it is empty the short text from the card stands in,
  // so the page never opens on a title alone.
  const body = inLocale(oblast.opis, locale);
  const summary = inLocale(oblast.kratakOpis, locale);

  const services = (oblast.usluge ?? [])
    .map((service) => ({
      key: service._key,
      text: inLocale(service, locale),
    }))
    .filter((service): service is typeof service & { text: string } =>
      Boolean(service.text),
    );

  // Both lawyers, from the Kontakt document — the same entries the Contact
  // section on the home page lists. The number is what an entry is recognised
  // by; the name and the email are optional.
  const contacts = (kontakt?.telefoni ?? [])
    .map((entry) => ({
      key: entry._key,
      name: inLocale(entry.oznaka, locale),
      number: entry.broj?.trim(),
      email: entry.mejl?.trim() || null,
    }))
    .filter((entry): entry is typeof entry & { number: string } =>
      Boolean(entry.number),
    );

  const buttonText = inLocale(pocetna?.tekstDugmeta, locale);
  const link = consultationLink({
    locale,
    configured: pocetna?.linkDugmeta,
    phone: podesavanja?.opstiTelefon,
  });

  const hasAside = contacts.length > 0 || Boolean(buttonText && link);

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label={t.breadcrumb}>
        <ol className={styles.trail}>
          <li>
            <a className={styles.crumb} href={sectionHref}>
              {sectionName(names, "practiceAreas", locale)}
            </a>
          </li>
          <li className={styles.current} aria-current="page">
            {name}
          </li>
        </ol>
      </nav>

      <article className={hasAside ? styles.panel : styles.panelSingle}>
        <div className={styles.main}>
          <h1 className={styles.title}>{name}</h1>

          <Divider variant="page" />

          {body && body.length > 0 ? (
            <Paragraphs
              blocks={body}
              wrapperClassName={styles.body}
              paragraphClassName={styles.paragraph}
            />
          ) : summary ? (
            <div className={styles.body}>
              <p className={styles.paragraph}>{summary}</p>
            </div>
          ) : null}

          {services.length > 0 ? (
            <section className={styles.services} aria-labelledby="usluge">
              <h2 className={styles.caption} id="usluge">
                {t.services}
              </h2>
              <ul className={styles.list}>
                {services.map((service) => (
                  <li className={styles.service} key={service.key}>
                    {service.text}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {hasAside ? (
          <aside className={styles.aside} aria-labelledby="kontakt-oblasti">
            <h2 className={styles.caption} id="kontakt-oblasti">
              {sectionName(names, "contact", locale)}
            </h2>

            {contacts.length > 0 ? (
              <ul className={styles.contacts}>
                {contacts.map((entry) => (
                  <li className={styles.contact} key={entry.key}>
                    {entry.name ? (
                      <p className={styles.name}>{entry.name}</p>
                    ) : null}

                    {entry.email ? (
                      <a
                        className={styles.mono}
                        href={`mailto:${entry.email}`}
                        aria-label={
                          entry.name
                            ? `${t.email} ${entry.name}: ${entry.email}`
                            : `${t.email}: ${entry.email}`
                        }
                      >
                        {entry.email}
                      </a>
                    ) : null}

                    <a
                      className={styles.mono}
                      href={telHref(entry.number)}
                      aria-label={
                        entry.name
                          ? `${t.phone} ${entry.name}: ${entry.number}`
                          : `${t.phone}: ${entry.number}`
                      }
                    >
                      {entry.number}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            {buttonText && link ? (
              <a
                className={styles.button}
                href={link.href}
                aria-label={
                  link.spokenNumber
                    ? `${buttonText} — ${CALL_LABEL[locale]} ${link.spokenNumber}`
                    : undefined
                }
              >
                {buttonText}
              </a>
            ) : null}
          </aside>
        ) : null}
      </article>
    </main>
  );
}
