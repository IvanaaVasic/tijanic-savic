import { defineField, defineType } from "sanity";

// Ne vidi se na samoj stranici — vidi se u Google pretrazi i kad se link deli.
export const seo = defineType({
  name: "seo",
  title: "SEO — kako se stranica vidi u pretrazi",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "naslov",
      title: "Naslov u pretrazi",
      type: "lokalniNaslov",
      description:
        "Naslov koji Google prikazuje u rezultatima pretrage i pregledač u kartici. Najbolje do 60 znakova.",
    }),
    defineField({
      name: "opis",
      title: "Opis u pretrazi",
      type: "lokalniTekst",
      description:
        "Dve rečenice ispod naslova u rezultatima Google pretrage. Najbolje do 155 znakova.",
    }),
    defineField({
      name: "ogSlika",
      title: "Slika za deljenje",
      type: "image",
      description:
        "Slika koja se pojavi kad se link na sajt pošalje porukom ili podeli na društvenoj mreži. Vodoravna, najbolje 1200 × 630 piksela.",
    }),
  ],
});
