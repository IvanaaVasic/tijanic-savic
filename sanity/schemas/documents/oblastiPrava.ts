import { defineField, defineType } from "sanity";

// The section on the home page that lists the practice areas. The areas
// themselves are separate documents (oblastPrava); this holds only the text
// above the cards.
export const oblastiPrava = defineType({
  name: "oblastiPrava",
  title: "Oblasti prava — sekcija",
  type: "document",
  fields: [
    defineField({
      name: "naslovSekcije",
      title: "Naslov sekcije",
      type: "lokalniNaslov",
      description:
        "Naslov na svetlom polju iznad kartica sa oblastima, na početnoj strani. Ako ostane prazno, kartice stoje bez naslova.",
    }),

    defineField({
      name: "uvod",
      title: "Uvodni tekst",
      type: "lokalniTekst",
      description:
        "Jedna do dve rečenice ispod naslova, iznad kartica. Na primer: kako posetilac da pronađe oblast u koju spada njegovo pitanje.",
    }),
  ],

  preview: {
    select: { subtitle: "naslovSekcije.sr" },
    prepare: ({ subtitle }) => ({
      title: "Oblasti prava — sekcija",
      subtitle,
    }),
  },
});
