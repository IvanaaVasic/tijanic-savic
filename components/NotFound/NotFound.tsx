// The 404 page. It is a single static file for the whole site, so it cannot
// know which locale the visitor came from — a request for /nesto and one for
// /en/something both land here. That is why both languages are on the page, with
// Serbian first, and why there are two links home instead of one.
//
// It carries the vertical lockup and the gold divider so a visitor who ends up
// here still sees they are on the office's site, not on a blank error page.

import { Divider } from "@/components/Divider/Divider";
import { localePath } from "@/lib/locale";

import styles from "./NotFound.module.css";

export function NotFound() {
  return (
    <main className={styles.page}>
      {/* Same file as in the footer — see Footer.tsx for the note about the
          temporary export. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.logo}
        src="/logo-vertical.png"
        alt="Tijanić Savić"
        width={372}
        height={264}
      />

      <Divider variant="footer" />

      <p className={styles.code}>404</p>

      <h1 className={styles.title}>Stranica nije pronađena.</h1>

      <p className={styles.text}>
        Adresa koju ste otvorili ne postoji ili je promenjena.
      </p>

      <p className={styles.textEn} lang="en">
        The page you were looking for does not exist or has moved.
      </p>

      <div className={styles.actions}>
        <a className={styles.primary} href={localePath("sr")}>
          Na početnu
        </a>
        <a className={styles.secondary} href={localePath("en")} lang="en">
          Home
        </a>
      </div>
    </main>
  );
}
