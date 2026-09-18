// The document every page of the site sits in: <html> with the right lang, the
// font variables, and the header and footer around the content.
//
// It is a component rather than a single layout.tsx because there are two root
// layouts — one for Serbian at the site root, one for English under /en. Both
// call this, so the shell is written once.

import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { fontVariables } from "@/lib/fonts";
import { LANG_TAG, type Locale } from "@/lib/locale";
import { inLocale } from "@/lib/localized";
import { navItems } from "@/lib/sections";
import { fetchNavAreas, fetchSettings } from "@/sanity/lib/fetch";

type Props = {
  locale: Locale;
  children: React.ReactNode;
};

export async function SiteShell({ locale, children }: Props) {
  // The header and the footer sit on every page and draw from Settings and the
  // list of practice areas, so this is where the fetch belongs, not in the page.
  const [settings, navAreas] = await Promise.all([
    fetchSettings(),
    fetchNavAreas(),
  ]);

  // The practice areas in the header menu. One without a name or an address has
  // nothing to show or nowhere to lead, and is left out.
  const areas = navAreas.flatMap((area) => {
    const label = inLocale(area.naziv, locale);
    return label && area.slug ? [{ slug: area.slug, label }] : [];
  });

  return (
    <html lang={LANG_TAG[locale]} className={fontVariables}>
      <body>
        <Header
          locale={locale}
          name={settings?.nazivKancelarije ?? ""}
          phone={settings?.opstiTelefon}
          nav={navItems(settings?.naziviSekcija, locale)}
          areas={areas}
        />
        {children}
        <Footer locale={locale} settings={settings} />
      </body>
    </html>
  );
}
