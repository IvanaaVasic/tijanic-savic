import { defineArrayMember, defineField, defineType } from "sanity";

export const kontakt = defineType({
  name: "kontakt",
  title: "Kontakt",
  type: "document",
  fields: [
    defineField({
      name: "naslovSekcije",
      title: "Naslov sekcije",
      type: "lokalniNaslov",
      description:
        "Naslov na svetlom polju pored mape. Na primer: Kancelarija se nalazi u centru Beograda.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "telefoni",
      title: "Telefoni",
      type: "array",
      description:
        "Brojevi u sekciji Kontakt, jedan ispod drugog. Adresa i radno vreme se ne upisuju ovde — oni se povlače iz Podešavanja.",
      of: [
        defineArrayMember({
          type: "object",
          name: "telefon",
          title: "Telefon",
          fields: [
            defineField({
              name: "broj",
              title: "Broj",
              type: "string",
              description:
                "Sa pozivnim brojem, na primer: +381 63 123 456. Ne prevodi se.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "oznaka",
              title: "Čiji je broj",
              type: "lokalniNaslov",
              description:
                "Sitan tekst pored broja, da posetilac zna koga zove. Na primer: Tijanić ili kancelarija.",
            }),
          ],
          preview: {
            select: { title: "broj", subtitle: "oznaka.sr" },
          },
        }),
      ],
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],

  preview: {
    select: { subtitle: "naslovSekcije.sr" },
    prepare: ({ subtitle }) => ({
      title: "Kontakt",
      subtitle,
    }),
  },
});
