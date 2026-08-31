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
import { fetchSettings } from "@/sanity/lib/fetch";

type Props = {
  locale: Locale;
  children: React.ReactNode;
};

export async function SiteShell({ locale, children }: Props) {
  // The header and the footer sit on every page and only draw from Settings, so
  // this is where the fetch belongs, not in the page.
  const settings = await fetchSettings();

  return (
    <html lang={LANG_TAG[locale]} className={fontVariables}>
      <body>
        <Header
          locale={locale}
          name={settings?.nazivKancelarije ?? ""}
          phone={settings?.opstiTelefon}
        />
        {children}
        <Footer locale={locale} settings={settings} />
      </body>
    </html>
  );
}
