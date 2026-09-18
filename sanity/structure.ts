import {
  CaseIcon,
  CogIcon,
  DocumentsIcon,
  EnvelopeIcon,
  HomeIcon,
  InfoOutlineIcon,
  UsersIcon,
} from "@sanity/icons";
import type { ComponentType } from "react";
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
  "oblastiPrava",
  "kontakt",
] as const;

type Singleton = (typeof SINGLETONS)[number];

export function isSingleton(type: string | undefined): boolean {
  return (SINGLETONS as readonly string[]).includes(type ?? "");
}

function singleton(
  S: StructureBuilder,
  type: Singleton,
  title: string,
  icon: ComponentType,
) {
  return S.listItem()
    .title(title)
    .id(type)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));
}

// The titles are what the lawyers read in the Studio, so they stay in Serbian.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Sadržaj")
    .items([
      singleton(S, "podesavanja", "Podešavanja", CogIcon),
      singleton(S, "pocetna", "Početna", HomeIcon),
      singleton(S, "oNama", "O nama", InfoOutlineIcon),
      S.listItem()
        .title("Advokati")
        .id("advokat")
        .icon(UsersIcon)
        .child(
          S.documentTypeList("advokat")
            .title("Advokati")
            .defaultOrdering([{ field: "redosled", direction: "asc" }])
        ),
      S.divider(),
      singleton(S, "oblastiPrava", "Oblasti prava — sekcija", DocumentsIcon),
      S.listItem()
        .title("Oblasti prava")
        .id("oblastPrava")
        .icon(CaseIcon)
        .child(
          S.documentTypeList("oblastPrava")
            .title("Oblasti prava")
            .defaultOrdering([{ field: "redosled", direction: "asc" }])
        ),
      S.divider(),
      singleton(S, "kontakt", "Kontakt", EnvelopeIcon),
    ]);
