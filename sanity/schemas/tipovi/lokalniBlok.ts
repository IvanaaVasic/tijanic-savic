import { defineArrayMember, defineField, defineType } from "sanity";

// Tekst od više pasusa, na dva jezika.
// Namerno bez naslova i lista unutar teksta — hijerarhija naslova na sajtu je
// definisana dizajnom, a ne uređivanjem sadržaja.
const pasusi = [
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
      of: pasusi,
    }),
    defineField({
      name: "en",
      title: "Engleski",
      type: "array",
      of: pasusi,
      description:
        "Ako ostavite prazno, posetilac na engleskoj verziji sajta vidi srpski tekst.",
    }),
  ],
});
