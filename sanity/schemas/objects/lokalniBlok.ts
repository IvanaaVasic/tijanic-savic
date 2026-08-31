import { defineArrayMember, defineField, defineType } from "sanity";

// Multi-paragraph text in both locales.
// Deliberately without headings or lists inside the text — the heading
// hierarchy on the site is set by the design, not by editing content.
//
// The type name and the field names are stored in the dataset, so they stay in
// Serbian; the titles are what the lawyers read in the Studio.
const paragraphs = [
  defineArrayMember({
    type: "block",
    styles: [{ title: "Pasus", value: "normal" }],
    lists: [],
    marks: {
      decorators: [
        { title: "Podebljano", value: "strong" },
        { title: "Kurziv", value: "em" },
      ],
      annotations: [],
    },
  }),
];

export const lokalniBlok = defineType({
  name: "lokalniBlok",
  title: "Tekst u više pasusa",
  type: "object",
  fields: [
    defineField({
      name: "sr",
      title: "Srpski",
      type: "array",
      of: paragraphs,
    }),
    defineField({
      name: "en",
      title: "Engleski",
      type: "array",
      of: paragraphs,
      description:
        "Ako ostavite prazno, posetilac na engleskoj verziji sajta vidi srpski tekst.",
    }),
  ],
});
