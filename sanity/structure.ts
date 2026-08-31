import type { StructureBuilder, StructureResolver } from "sanity/structure";

// Document types that may exist exactly once. They cannot be created, deleted
// or duplicated — in the menu they appear as a single entry, not as a list.
//
// The identifiers are the schema type names, which are stored in the dataset,
// so they stay as they are.
export const SINGLETONS = [
  "podesavanja",
  "pocetna",
  "oNama",
  "kontakt",
] as const;

type Singleton = (typeof SINGLETONS)[number];

export function isSingleton(type: string | undefined): boolean {
  return (SINGLETONS as readonly string[]).includes(type ?? "");
}

function singleton(S: StructureBuilder, type: Singleton, title: string) {
  return S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title));
}

// The titles are what the lawyers read in the Studio, so they stay in Serbian.
export const structure: StructureResolver = (S) =>
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
