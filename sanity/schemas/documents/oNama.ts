import { defineArrayMember, defineField, defineType } from "sanity";

import { photoAlt } from "../fields/photoAlt";

export const oNama = defineType({
  name: "oNama",
  title: "O nama",
  type: "document",
  fields: [
    defineField({
      name: "fotografijeIznad",
      title: "Fotografije iznad teksta (3)",
      type: "array",
      description:
        "Tri fotografije u redu na vrhu svetlog polja, iste visine. Na telefonu se listaju prstom. Redosled ovde je redosled na sajtu. Tačkom fokusa (ikonica olovke na slici) označite lica.",
      // Ne i required: dok fotografija nema, sekcija stoji bez reda slika.
      validation: (Rule) =>
        Rule.length(3).error("Potrebne su tačno tri fotografije."),
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [photoAlt()],
        }),
      ],
    }),

    defineField({
      name: "sirokaFotografija",
      title: "Široka fotografija ispod teksta",
      type: "image",
      options: { hotspot: true },
      description:
        "Jedna položena fotografija preko cele širine, na dnu svetlog polja, ispod zlatne linije.",
      fields: [photoAlt()],
    }),

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
