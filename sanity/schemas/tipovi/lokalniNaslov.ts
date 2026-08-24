import { defineField, defineType } from "sanity";

// Kratak tekst na dva jezika. Koristi se za naslove, labele i sve što staje u red.
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
