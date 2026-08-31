import { defineField, defineType } from "sanity";

// Short text in both locales. Used for headings, labels and anything that fits on one line.
export const lokalniNaslov = defineType({
  name: "lokalniNaslov",
  title: "Kratak tekst",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({
      name: "sr",
      title: "Srpski",
      type: "string",
    }),
    defineField({
      name: "en",
      title: "Engleski",
      type: "string",
      description:
        "Ako ostavite prazno, posetilac na engleskoj verziji sajta vidi srpski tekst.",
    }),
  ],
});
