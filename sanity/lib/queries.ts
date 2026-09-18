import { defineQuery } from "next-sanity";

// defineQuery is not decoration — sanity typegen only recognises queries marked
// this way, and generates the types in sanity/types.ts from them.
//
// The site is one page per locale, so a single query brings in all the content:
// at build time that is one round trip to Sanity instead of five.
//
// The field names below are the ones stored in the dataset, so they stay in
// Serbian. Everything the code names itself is in English.
export const CONTENT_QUERY = defineQuery(`{
  "podesavanja": *[_type == "podesavanja"][0]{...},
  "pocetna": *[_type == "pocetna"][0]{...},
  "oNama": *[_type == "oNama"][0]{...},
  "advokati": *[_type == "advokat"] | order(redosled asc){...},
  "oblastiPrava": *[_type == "oblastiPrava"][0]{...},
  "oblasti": *[_type == "oblastPrava" && defined(slug.current)] | order(redosled asc){
    _id,
    naziv,
    "slug": slug.current,
    kratakOpis
  },
  "kontakt": *[_type == "kontakt"][0]{...}
}`);

// The header and the footer sit on every page and only draw from Settings.
export const SETTINGS_QUERY = defineQuery(`
  *[_type == "podesavanja"][0]{...}
`);

// The practice areas for the header menu — the header sits on every page, so it
// is fetched next to Settings, not with the page content. An area without an
// address has no page to lead to and is left out.
export const NAV_AREAS_QUERY = defineQuery(`
  *[_type == "oblastPrava" && defined(slug.current)] | order(redosled asc){
    naziv,
    "slug": slug.current
  }
`);

// Every area address, for generateStaticParams and the sitemap.
export const AREA_SLUGS_QUERY = defineQuery(`
  *[_type == "oblastPrava" && defined(slug.current)].slug.current
`);

// One area page: the area itself plus what its side column borrows — both
// lawyers' numbers and emails from Kontakt, the button text from Početna, the
// office phone and the section names from Settings.
export const AREA_PAGE_QUERY = defineQuery(`{
  "oblast": *[_type == "oblastPrava" && slug.current == $slug][0]{
    ...,
    "slug": slug.current
  },
  "podesavanja": *[_type == "podesavanja"][0]{...},
  "pocetna": *[_type == "pocetna"][0]{tekstDugmeta, linkDugmeta, seo},
  "kontakt": *[_type == "kontakt"][0]{telefoni}
}`);
