import { defineField, defineType } from "sanity";

// Duži tekst na dva jezika, jedan pasus. Za više pasusa koristi lokalniBlok.
export const lokalniTekst = defineType({
  name: "lokalniTekst",
  title: "Tekst",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({
      name: "sr",
      title: "Srpski",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "en",
      title: "Engleski",
      type: "text",
      rows: 4,
      description:
        "Ako ostavite prazno, posetilac na engleskoj verziji sajta vidi srpski tekst.",
    }),
  ],
});
