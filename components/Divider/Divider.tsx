// The gold rule with a diamond — the brand's main divider. It appears in three
// places: under the hero title, at the bottom of the cream panel, and above the
// legal line in the footer. Hence a component, rather than the same CSS written
// out three times.
//
// Pure decoration: it carries aria-hidden and has no text content. The divider
// is never built out of characters (———◆———) — a screen reader would read it out.

import styles from "./Divider.module.css";

type Props = {
  /**
   * The width differs per placement and is not the same on mobile:
   * `hero` 340/180px, `footer` 420/200px, `panel` fills the available width
   * because it sits inside the cream panel.
   */
  variant?: "hero" | "footer" | "panel";
  /**
   * The caller's class. The divider's width lives here, but the spacing around
   * it depends on the section it ended up in, so that section supplies it.
   */
  className?: string;
};

export function Divider({ variant = "hero", className }: Props) {
  return (
    <div
      className={className ? `${styles[variant]} ${className}` : styles[variant]}
      aria-hidden="true"
    >
      <span className={styles.diamond} />
    </div>
  );
}
