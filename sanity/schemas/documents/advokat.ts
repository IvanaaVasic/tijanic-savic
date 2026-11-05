import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { photoAlt } from "../fields/photoAlt";

export const advokat = defineType({
  name: "advokat",
  title: "Advokat",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "ime",
      title: "Ime i prezime",
      type: "string",
      description: "Naslov kartice u sekciji Advokati. Ne prevodi se.",
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
      title: "Portret",
      type: "image",
      options: { hotspot: true },
      description:
        "Portret u kartici, između imena i titule. Uspravan. Tačkom fokusa (ikonica olovke na slici) označite lice — ono ostaje u kadru i na telefonu.",
      fields: [photoAlt()],
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
        "Određuje ko stoji levo, a ko desno u sekciji Advokati. Manji broj ide prvi: 1, pa 2.",
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
