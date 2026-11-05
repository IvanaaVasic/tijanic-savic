import { defineQuery } from "next-sanity";

// defineQuery is not decoration — sanity typegen only recognises queries marked
// this way, and generates the types in sanity/types.ts from them.
//
// The site is one page per locale, so a single query brings in all the content:
// at build time that is one round trip to Sanity instead of five.
//
// The field names below are the ones stored in the dataset, so they stay in
// Serbian. Everything the code names itself is in English.
// A photograph with what the page needs to lay it out before it loads: the
// original dimensions give the <img> its width and height, the hotspot and the
// crop come along for the image builder and for object-position.
const PHOTO = `
  alt,
  hotspot,
  crop,
  asset->{_id, metadata{dimensions{width, height}}}
`;

export const CONTENT_QUERY = defineQuery(`{
  "podesavanja": *[_type == "podesavanja"][0]{...},
  "pocetna": *[_type == "pocetna"][0]{...},
  "oNama": *[_type == "oNama"][0]{
    ...,
    fotografijeIznad[]{_key, ${PHOTO}},
    sirokaFotografija{${PHOTO}}
  },
  "advokati": *[_type == "advokat"] | order(redosled asc){
    ...,
    fotografija{${PHOTO}}
  },
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
