// Studio je klijentska aplikacija — bez ove direktive Next pokušava da je
// renderuje na serveru i build puca na createContext.
"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { jeSingleton, struktura } from "./sanity/structure";

export default defineConfig({
  name: "default",
  title: "Tijanić Savić",
  basePath: "/studio",

  projectId,
  dataset,

  schema: {
    types: schemaTypes,
  },

  plugins: [structureTool({ structure: struktura })],

  document: {
    // Singletoni se ne umnožavaju, ne brišu i ne skidaju sa sajta.
    actions: (prethodne, kontekst) =>
      jeSingleton(kontekst.schemaType)
        ? prethodne.filter(
            ({ action }) =>
              action !== "duplicate" &&
              action !== "delete" &&
              action !== "unpublish"
          )
        : prethodne,

    // Ni iz dugmeta „Napravi novo" ne mogu da se dupliraju.
    newDocumentOptions: (prethodne) =>
      prethodne.filter((sablon) => !jeSingleton(sablon.templateId)),
  },
});
