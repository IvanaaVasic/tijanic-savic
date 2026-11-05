// The card for one lawyer in the Team section — described in
// docs/design/design.md, part "3 — 02 Tim", with the portrait moved as in
// tim-desktop.png. One framed block, top to bottom: name, portrait inside the
// padding, role next to a gold dash, bio, then email and phone separated by a
// rule.
//
// A server component: everything comes from Sanity at build time, no state.

import { LawyerBio } from "@/components/LawyerBio/LawyerBio";
import { Paragraphs } from "@/components/Paragraphs/Paragraphs";
import type { Locale } from "@/lib/locale";
import { inLocale, textInLocale } from "@/lib/localized";
import { telHref } from "@/lib/phone";
import { photoSource } from "@/sanity/lib/image";
import type { CONTENT_QUERYResult } from "@/sanity/types";

import styles from "./LawyerCard.module.css";

// Labels that are not visible but a screen reader reads out: the address alone
// does not say whether it is an email or a phone number, and they are read one
// after the other.
const LABELS = {
  sr: { email: "mejl", phone: "telefon" },
  en: { email: "email", phone: "phone" },
} as const;

// The portrait is as wide as the card's text column: half the row less the
// card's padding on desktop, the page less the band and the padding on mobile.
const PORTRAIT_SIZES =
  "(min-width: 1440px) 564px, (min-width: 900px) calc(50vw - 156px), (min-width: 685px) calc(50vw - 81px), calc(100vw - 86px)";

type Props = {
  locale: Locale;
  lawyer: CONTENT_QUERYResult["advokati"][number];
};

export function LawyerCard({ locale, lawyer }: Props) {
  const role = inLocale(lawyer.titula, locale);
  const bio = inLocale(lawyer.biografija, locale);

  // The frame is a fixed height and the card's width, so the CDN sends the
  // whole photograph and the hotspot from the Studio becomes object-position.
  const portrait = photoSource(lawyer.fotografija, "center 18%");

  const email = lawyer.mejl?.trim();
  const phone = lawyer.telefon?.trim();

  return (
    <article className={styles.card}>
      <h3 className={styles.name}>{lawyer.ime}</h3>

      {/* Without a photograph the card simply goes from the name to the role —
          no placeholder stands in for the missing image. */}
      {portrait ? (
        // next/image brings nothing here: the build is static, images.unoptimized
        // is on, and the Sanity CDN does the transformations.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.portrait}
          src={portrait.src}
          srcSet={portrait.srcSet}
          sizes={PORTRAIT_SIZES}
          alt={textInLocale(lawyer.fotografija?.alt, locale)}
          width={portrait.width}
          height={portrait.height}
          style={{ objectPosition: portrait.position }}
          loading="lazy"
          decoding="async"
        />
      ) : null}

      {role ? (
        <p className={styles.role}>
          <span className={styles.dash} aria-hidden="true" />
          <span className={styles.roleLabel}>{role}</span>
        </p>
      ) : null}

      {/* The bio is folded by LawyerBio, a client component. The text is
            rendered here, on the server, and handed over as children — so the
            Portable Text renderer never reaches the browser. */}
      {bio && bio.length > 0 ? (
        <LawyerBio locale={locale} name={lawyer.ime ?? ""}>
          <Paragraphs
            blocks={bio}
            wrapperClassName={styles.bio}
            paragraphClassName={styles.paragraph}
          />
        </LawyerBio>
      ) : null}

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
    </article>
  );
}
