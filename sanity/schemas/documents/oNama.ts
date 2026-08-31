import { defineArrayMember, defineField, defineType } from "sanity";

export const oNama = defineType({
  name: "oNama",
  title: "O nama",
  type: "document",
  fields: [
    defineField({
      name: "naslovSekcije",
      title: "Naslov sekcije",
      type: "lokalniNaslov",
      description:
        "Naslov na svetlom polju u sekciji O nama. Na primer: Kancelarija je osnovana 2016. godine u Beogradu.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "tekst",
      title: "Tekst",
      type: "lokalniBlok",
      description:
        "Opis kancelarije ispod naslova, u dva kratka pasusa: čime se bavite i kako radite sa klijentima.",
    }),

    defineField({
      name: "statistike",
      title: "Podaci u dnu sekcije",
      type: "array",
      description:
        "Tri kratka podatka u redu ispod teksta, odvojena zlatnom linijom. Na primer: 2016 / osnivanje.",
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: "object",
          name: "statistika",
          title: "Podatak",
          fields: [
            defineField({
              name: "vrednost",
              title: "Vrednost",
              type: "lokalniNaslov",
              description:
                "Krupan tekst, na primer 2016 ili Srbija. Godine i brojevi su isti na oba jezika, pa se engleski ostavlja prazan.",
            }),
            defineField({
              name: "labela",
              title: "Labela",
              type: "lokalniNaslov",
              description:
                "Sitan tekst ispod vrednosti, na primer osnivanje ili područje rada.",
            }),
          ],
          preview: {
            select: { title: "vrednost.sr", subtitle: "labela.sr" },
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
      title: "O nama",
      subtitle,
    }),
  },
});
