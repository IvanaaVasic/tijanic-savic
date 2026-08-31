// The Studio is its own root — hence two route groups, (site) and (studio), and
// no shared app/layout.tsx. The Studio gets neither the tokens nor the site
// reset; it carries its own styles and must not share them with the public part.
import { DEFAULT_LOCALE, LANG_TAG } from "@/lib/locale";

// The lang below is the same tag the site uses — Serbian in Latin script,
// not a bare "sr", which is read as Cyrillic. The Studio is noindex, so this
// is for the screen reader of whoever is editing, not for search.
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={LANG_TAG[DEFAULT_LOCALE]}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
