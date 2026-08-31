// The card for one lawyer in the Team section — described in
// docs/design/design.md, part "3 — 02 Tim". Top to bottom: portrait, name, role
// next to a gold dash, bio, then email and phone separated by a rule.
//
// A server component: everything comes from Sanity at build time, no state.

import { Paragraphs } from "@/components/Paragraphs/Paragraphs";
import type { Locale } from "@/lib/locale";
import { inLocale, textInLocale } from "@/lib/localized";
import { telHref } from "@/lib/phone";
import { imageUrl } from "@/sanity/lib/image";
import type { CONTENT_QUERYResult } from "@/sanity/types";

import styles from "./LawyerCard.module.css";

// Labels that are not visible but a screen reader reads out: the address alone
// does not say whether it is an email or a phone number, and they are read one
// after the other.
const LABELS = {
  sr: { email: "mejl", phone: "telefon" },
  en: { email: "email", phone: "phone" },
} as const;

// The portrait is 2x the desktop frame (556 x 380). The same crop covers the
// narrower mobile frame too — the image is framed inside it through object-fit.
const PORTRAIT_WIDTH = 1112;
const PORTRAIT_HEIGHT = 760;

type Props = {
  locale: Locale;
  lawyer: CONTENT_QUERYResult["advokati"][number];
};

export function LawyerCard({ locale, lawyer }: Props) {
  const role = inLocale(lawyer.titula, locale);
  const bio = inLocale(lawyer.biografija, locale);

  const portrait = lawyer.fotografija?.asset
    ? {
        // fit("crop") overrides the default fit("max") from sanity/lib/image.ts:
        // the frame is fixed, so the image has to be cropped rather than fitted
        // into it. The hotspot from the Studio then decides what stays in frame.
        url: imageUrl(lawyer.fotografija)
          .width(PORTRAIT_WIDTH)
          .height(PORTRAIT_HEIGHT)
          .fit("crop")
          .url(),
        alt: textInLocale(lawyer.fotografija.alt, locale),
      }
    : null;

  const email = lawyer.mejl?.trim();
  const phone = lawyer.telefon?.trim();

  return (
    <article className={styles.card}>
      {portrait ? (
        // next/image brings nothing here: the build is static, images.unoptimized
        // is on, and the Sanity CDN does the transformations through imageUrl.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.portrait}
          src={portrait.url}
          alt={portrait.alt}
          width={PORTRAIT_WIDTH}
          height={PORTRAIT_HEIGHT}
          loading="lazy"
          decoding="async"
        />
      ) : (
        // The photographs arrive in mid-September. Until then a calm hatched
        // surface from the mockup sits at the top — no icon and no note saying
        // the image is missing. The card looks finished before the portrait
        // arrives.
        <div
          className={`${styles.portrait} ${styles.hatching}`}
          aria-hidden="true"
        />
      )}

      <div className={styles.body}>
        <h3 className={styles.name}>{lawyer.ime}</h3>

        {role ? (
          <p className={styles.role}>
            <span className={styles.dash} aria-hidden="true" />
            <span className={styles.roleLabel}>{role}</span>
          </p>
        ) : null}

        <Paragraphs
          blocks={bio}
          wrapperClassName={styles.bio}
          paragraphClassName={styles.paragraph}
        />

        {/* margin-top: auto in the CSS keeps this block at the bottom of the
            card, so the email and phone line up even when one bio is longer
            than the other. */}
        {email || phone ? (
          <div className={styles.contact}>
            {email ? (
              <a
                className={styles.link}
                href={`mailto:${email}`}
                aria-label={`${LABELS[locale].email}: ${email}`}
              >
                {email}
              </a>
            ) : null}

            {phone ? (
              <a
                className={styles.link}
                href={telHref(phone)}
                aria-label={`${LABELS[locale].phone}: ${phone}`}
              >
                {phone}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
