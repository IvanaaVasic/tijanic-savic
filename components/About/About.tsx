// About — section 2 from docs/design/design.md, with the photographs from
// o-nama-desktop.png. A cream panel inside the green band: three photographs in
// a row on top, then a narrow column with the section label on the left and the
// title, the paragraphs and the stats on the right, then the gold divider and one
// wide photograph across the whole panel.
//
// A server component: everything comes from Sanity at build time, no state.

import {
  AboutGallery,
  type GalleryPhoto,
} from "@/components/AboutGallery/AboutGallery";
import { Divider } from "@/components/Divider/Divider";
import { PendingSection } from "@/components/PendingSection/PendingSection";
import { Paragraphs } from "@/components/Paragraphs/Paragraphs";
import { Reveal } from "@/components/Reveal/Reveal";
import type { Locale } from "@/lib/locale";
import { inLocale, textInLocale } from "@/lib/localized";
import { SECTIONS } from "@/lib/sections";
import { photoSource } from "@/sanity/lib/image";
import type { CONTENT_QUERYResult } from "@/sanity/types";

import styles from "./About.module.css";

type Props = {
  locale: Locale;
  /** The section name from Settings, the same one the navigation shows. */
  name: string;
  about: CONTENT_QUERYResult["oNama"];
};

export function About({ locale, name, about }: Props) {
  const title = inLocale(about?.naslovSekcije, locale);

  // The title is the only required part of the section. Without it the panel has
  // nothing to show, so the section stands as "U pripremi" instead — the
  // navigation offers it, and the link must land somewhere.
  if (!title) {
    return <PendingSection locale={locale} section="about" name={name} />;
  }

  const text = inLocale(about?.tekst, locale);

  // The schema allows up to three stats, but the lawyers can enter fewer, and
  // can leave one without a value. The ones with no headline value drop out
  // here — a label on its own means nothing.
  const stats = (about?.statistike ?? [])
    .map((stat) => ({
      key: stat._key,
      value: inLocale(stat.vrednost, locale),
      caption: inLocale(stat.labela, locale),
    }))
    .filter(
      (stat): stat is typeof stat & { value: string } => stat.value !== null,
    );

  // Photographs without an uploaded file drop out; with none at all the row is
  // left out and the panel opens with the label, as it did before.
  const gallery = (about?.fotografijeIznad ?? []).flatMap(
    (photo): GalleryPhoto[] => {
      const source = photoSource(photo, "center 20%");
      return source
        ? [{ ...source, key: photo._key, alt: textInLocale(photo.alt, locale) }]
        : [];
    },
  );

  const wide = photoSource(about?.sirokaFotografija, "center 40%");

  return (
    <section className={styles.wrapper} id={SECTIONS.about.anchor}>
      {/* Reveal renders the panel itself rather than wrapping it — the fade and
          the rise belong to the cream block, and the gold divider inside it
          draws itself once the panel has arrived. */}
      <Reveal className={styles.panel}>
        {gallery.length > 0 ? (
          <AboutGallery locale={locale} photos={gallery} />
        ) : null}

        <div className={styles.row}>
          {/* The number and the slash are decoration — a screen reader hears only
            "O nama". */}
          <p className={styles.label}>
            <span className={styles.number} aria-hidden="true">
              {SECTIONS.about.number}
            </span>
            <span className={styles.slash} aria-hidden="true">
              /
            </span>
            <span className={styles.name}>{name}</span>
          </p>

          <div className={styles.content}>
            <h2 className={styles.title}>{title}</h2>

            <Paragraphs
              blocks={text}
              wrapperClassName={styles.body}
              paragraphClassName={styles.paragraph}
            />

            {stats.length > 0 ? (
              <ul className={styles.stats}>
                {stats.map((stat) => (
                  <li className={styles.stat} key={stat.key}>
                    <span className={styles.value}>{stat.value}</span>
                    {stat.caption ? (
                      <span className={styles.caption}>{stat.caption}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {/* The divider runs across the whole panel, under both columns — and
            stays even without the photograph below it, closing the panel the
            way "Recurring elements" in design.md describes. */}
        <Divider variant="panel" className={styles.divider} />

        {wide ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.wide}
            src={wide.src}
            srcSet={wide.srcSet}
            sizes="(min-width: 1440px) 1168px, (min-width: 900px) calc(100vw - 272px), calc(100vw - 88px)"
            width={wide.width}
            height={wide.height}
            alt={textInLocale(about?.sirokaFotografija?.alt, locale)}
            style={{ objectPosition: wide.position }}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </Reveal>
    </section>
  );
}
