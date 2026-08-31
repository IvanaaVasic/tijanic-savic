// The Studio is a client application — without this directive Next tries to
// render it on the server and the build fails on createContext.
"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { isSingleton, structure } from "./sanity/structure";

export default defineConfig({
  name: "default",
  title: "Tijanić Savić",
  basePath: "/studio",

  projectId,
  dataset,

  schema: {
    types: schemaTypes,
  },

  plugins: [structureTool({ structure })],

  document: {
    // Singletons are never duplicated, deleted or taken off the site.
    actions: (previous, context) =>
      isSingleton(context.schemaType)
        ? previous.filter(
            ({ action }) =>
              action !== "duplicate" &&
              action !== "delete" &&
              action !== "unpublish"
          )
        : previous,

    // They cannot be duplicated from the "Create new" button either.
    newDocumentOptions: (previous) =>
      previous.filter((template) => !isSingleton(template.templateId)),
  },
});
