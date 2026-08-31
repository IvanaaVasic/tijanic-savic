import { advokat } from "./documents/advokat";
import { kontakt } from "./documents/kontakt";
import { oNama } from "./documents/oNama";
import { pocetna } from "./documents/pocetna";
import { podesavanja } from "./documents/podesavanja";
import { lokalniBlok } from "./objects/lokalniBlok";
import { lokalniNaslov } from "./objects/lokalniNaslov";
import { lokalniTekst } from "./objects/lokalniTekst";
import { seo } from "./objects/seo";

// The schema type names are stored in the dataset, so they stay in Serbian —
// renaming them would orphan the content the lawyers have already entered.
export const schemaTypes = [
  // Object types embedded in documents
  lokalniNaslov,
  lokalniTekst,
  lokalniBlok,
  seo,

  // Documents
  podesavanja,
  pocetna,
  oNama,
  advokat,
  kontakt,
];
