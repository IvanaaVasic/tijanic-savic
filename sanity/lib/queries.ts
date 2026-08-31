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
  "kontakt": *[_type == "kontakt"][0]{...}
}`);

// The header and the footer sit on every page and only draw from Settings.
export const SETTINGS_QUERY = defineQuery(`
  *[_type == "podesavanja"][0]{...}
`);
