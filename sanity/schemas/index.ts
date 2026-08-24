import { advokat } from "./dokumenti/advokat";
import { kontakt } from "./dokumenti/kontakt";
import { oNama } from "./dokumenti/oNama";
import { pocetna } from "./dokumenti/pocetna";
import { podesavanja } from "./dokumenti/podesavanja";
import { lokalniBlok } from "./tipovi/lokalniBlok";
import { lokalniNaslov } from "./tipovi/lokalniNaslov";
import { lokalniTekst } from "./tipovi/lokalniTekst";
import { seo } from "./tipovi/seo";

export const schemaTypes = [
  // Tipovi koji se ugrađuju u dokumente
  lokalniNaslov,
  lokalniTekst,
  lokalniBlok,
  seo,

  // Dokumenti
  podesavanja,
  pocetna,
  oNama,
  advokat,
  kontakt,
];
