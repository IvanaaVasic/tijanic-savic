import type { StructureBuilder, StructureResolver } from "sanity/structure";

// Dokumenti kojih sme da postoji tačno jedan. Ne mogu se praviti novi,
// brisati ni umnožavati — u meniju stoje kao jedna stavka, ne kao lista.
export const SINGLETONI = [
  "podesavanja",
  "pocetna",
  "oNama",
  "kontakt",
] as const;

type Singleton = (typeof SINGLETONI)[number];

export function jeSingleton(tip: string | undefined): boolean {
  return (SINGLETONI as readonly string[]).includes(tip ?? "");
}

function singleton(S: StructureBuilder, tip: Singleton, naslov: string) {
  return S.listItem()
    .title(naslov)
    .id(tip)
    .child(S.document().schemaType(tip).documentId(tip).title(naslov));
}

export const struktura: StructureResolver = (S) =>
  S.list()
    .title("Sadržaj")
    .items([
      singleton(S, "podesavanja", "Podešavanja"),
      singleton(S, "pocetna", "Početna"),
      singleton(S, "oNama", "O nama"),
      S.listItem()
        .title("Advokati")
        .id("advokat")
        .child(
          S.documentTypeList("advokat")
            .title("Advokati")
            .defaultOrdering([{ field: "redosled", direction: "asc" }])
        ),
      singleton(S, "kontakt", "Kontakt"),
    ]);
