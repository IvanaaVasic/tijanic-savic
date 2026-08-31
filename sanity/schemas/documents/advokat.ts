import { defineField, defineType } from "sanity";

export const advokat = defineType({
  name: "advokat",
  title: "Advokat",
  type: "document",
  fields: [
    defineField({
      name: "ime",
      title: "Ime i prezime",
      type: "string",
      description: "Naslov kartice u sekciji Tim. Ne prevodi se.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "titula",
      title: "Titula",
      type: "lokalniNaslov",
      description:
        "Sitan zlatan tekst ispod imena, pored kratke linije. Na primer: advokat.",
    }),

    defineField({
      name: "biografija",
      title: "Biografija",
      type: "lokalniBlok",
      description:
        "Tekst na kartici ispod titule: obrazovanje, godina advokatskog ispita i oblasti kojima se bavi. Dve do tri rečenice.",
    }),

    defineField({
      name: "fotografija",
      title: "Fotografija",
      type: "image",
      options: { hotspot: true },
      description:
        "Portret na vrhu kartice. Uspravan, odnos stranica 4:5, snimljen na tamnoj pozadini.",
      fields: [
        defineField({
          name: "alt",
          title: "Opis fotografije",
          type: "lokalniNaslov",
          description:
            "Kratak opis za posetioce koji koriste čitač ekrana i za slučaj da se slika ne učita. Na primer: Ana Tijanić, advokat.",
          // Rule.required() na objektu prošlo bi i kad su oba jezika prazna, pa
          // se traži srpska strana — engleska se na nju vraća kad ostane prazna.
          // Tip se navodi jer Rule.custom za ugnežđeni objekat vidi samo {}.
          validation: (Rule) =>
            Rule.custom<{ sr?: string } | undefined>((value) =>
              value?.sr?.trim() ? true : "Opis fotografije je obavezan.",
            ),
        }),
      ],
    }),

    defineField({
      name: "mejl",
      title: "Mejl",
      type: "string",
      description: "Prikazuje se u dnu kartice. Ne prevodi se.",
      validation: (Rule) => Rule.email(),
    }),

    defineField({
      name: "telefon",
      title: "Telefon",
      type: "string",
      description:
        "Prikazuje se u dnu kartice, ispod mejla. Sa pozivnim brojem, na primer: +381 63 123 456.",
    }),

    defineField({
      name: "redosled",
      title: "Redosled prikaza",
      type: "number",
      description:
        "Određuje ko stoji levo, a ko desno u sekciji Tim. Manji broj ide prvi: 1, pa 2.",
      validation: (Rule) => Rule.required().integer().positive(),
    }),
  ],

  orderings: [
    {
      name: "redosledPrikaza",
      title: "Redosled prikaza",
      by: [{ field: "redosled", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      title: "ime",
      subtitle: "titula.sr",
      media: "fotografija",
    },
  },
});
