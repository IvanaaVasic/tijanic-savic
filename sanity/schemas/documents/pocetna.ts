import { defineField, defineType } from "sanity";

export const pocetna = defineType({
  name: "pocetna",
  title: "Početna",
  type: "document",
  fields: [
    defineField({
      name: "nadnaslov",
      title: "Nadnaslov",
      type: "lokalniNaslov",
      description:
        "Sitan zlatan tekst iznad velikog naslova, na samom vrhu strane. Na primer: BEOGRAD · OSNOVANA 2016.",
    }),

    defineField({
      name: "naslov",
      title: "Glavni naslov",
      type: "lokalniNaslov",
      description:
        "Veliki naslov na vrhu početne strane, prvo što posetilac pročita. Dva reda su taman.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "uvodniTekst",
      title: "Uvodni tekst",
      type: "lokalniTekst",
      description:
        "Jedna do dve rečenice ispod naslova, iznad dugmeta. Ukratko čime se kancelarija bavi i za koga radi.",
    }),

    defineField({
      name: "tekstDugmeta",
      title: "Tekst na dugmetu",
      type: "lokalniNaslov",
      description:
        "Zlatno dugme ispod uvodnog teksta. Na primer: Zakažite konsultaciju.",
    }),

    defineField({
      name: "linkDugmeta",
      title: "Gde dugme vodi",
      type: "string",
      description:
        "Ostavite prazno i dugme poziva telefon kancelarije iz Podešavanja — tako treba u većini slučajeva. Upišite #kontakt ako radije želite da dugme spusti posetioca na sekciju Kontakt, ili tel:+38111123456 za neki drugi broj.",
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],

  preview: {
    select: { subtitle: "naslov.sr" },
    prepare: ({ subtitle }) => ({
      title: "Početna",
      subtitle,
    }),
  },
});
