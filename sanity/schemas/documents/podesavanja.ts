import { defineField, defineType } from "sanity";

export const podesavanja = defineType({
  name: "podesavanja",
  title: "Podešavanja",
  type: "document",
  fields: [
    defineField({
      name: "nazivKancelarije",
      title: "Naziv kancelarije",
      type: "string",
      description:
        "Ime kancelarije uz logo u zaglavlju i u podnožju sajta. Ne prevodi se.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "adresa",
      title: "Adresa",
      type: "object",
      description: "Prikazuje se u sekciji Kontakt, ispod naslova.",
      fields: [
        defineField({
          name: "ulica",
          title: "Ulica i broj",
          type: "string",
          description: "Na primer: Kneza Miloša 12. Ne prevodi se.",
        }),
        defineField({
          name: "grad",
          title: "Poštanski broj i grad",
          type: "lokalniNaslov",
          description:
            "Na primer: 11000 Beograd. Na engleskom: 11000 Belgrade.",
        }),
        defineField({
          name: "drzava",
          title: "Država",
          type: "lokalniNaslov",
          description: "Na primer: Srbija. Na engleskom: Serbia.",
        }),
      ],
    }),

    defineField({
      name: "koordinate",
      title: "Koordinate za mapu",
      type: "object",
      description:
        "Određuju gde stoji pin na mapi u sekciji Kontakt. Na Google mapama kliknite desnim tasterom na tačnu lokaciju kancelarije i kopirajte dva broja koja se pojave.",
      fields: [
        defineField({
          name: "lat",
          title: "Geografska širina",
          type: "number",
          description: "Prvi broj, za Beograd oko 44.8.",
          validation: (Rule) => Rule.min(-90).max(90),
        }),
        defineField({
          name: "lng",
          title: "Geografska dužina",
          type: "number",
          description: "Drugi broj, za Beograd oko 20.4.",
          validation: (Rule) => Rule.min(-180).max(180),
        }),
      ],
    }),

    defineField({
      name: "linkMape",
      title: "Link ka kancelariji na Google mapama",
      type: "url",
      description:
        "Kuda vodi dugme „Otvorite u Google mapi“ ispod mape u sekciji Kontakt. Na Google mapama pronađite kancelariju po imenu, kliknite „Podeli“ (Share) i kopirajte link — izgleda kao https://maps.app.goo.gl/… Tada se otvara kartica kancelarije sa imenom, ocenama i radnim vremenom. Ako ostane prazno, dugme otvara samo tačku sa koordinatama.",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    }),

    defineField({
      name: "nazivNaMapi",
      title: "Naziv kancelarije na Google mapama",
      type: "string",
      description:
        "Po ovom imenu mapa u sekciji Kontakt pronalazi kancelariju i ispisuje ga pored pina, uz karticu sa adresom i ocenama. Prepišite ga tačno kako stoji na Google mapama, na primer: Advokatska kancelarija Tijanić Savić. Ako ostane prazno, mapa pokazuje samo pin na koordinatama. Ne prevodi se.",
    }),

    defineField({
      name: "opstiTelefon",
      title: "Telefon kancelarije",
      type: "string",
      description:
        "Broj u dugmetu u zaglavlju sajta. Pišite ga sa pozivnim brojem, na primer: +381 11 123 456.",
    }),

    defineField({
      name: "opstiMejl",
      title: "Mejl kancelarije",
      type: "string",
      description:
        "Opšta adresa, na primer info@tijanicsaviclegal.rs. Prikazuje se u podnožju sajta.",
      validation: (Rule) => Rule.email(),
    }),

    defineField({
      name: "adresaSajta",
      title: "Adresa sajta",
      type: "string",
      description:
        "Stoji u podnožju, pored mejla, i vodi na početnu stranu. Pišite je onako kako želite da se vidi, bez https:// i bez www, na primer: tijanicsaviclegal.rs.",
    }),

    defineField({
      name: "radnoVreme",
      title: "Radno vreme",
      type: "lokalniTekst",
      description:
        "Poslednji podatak u sekciji Kontakt. Pišite svaki termin u zaseban red, u obliku „dani od—do“ — na primer: Radnim danima 09—17. U novom redu: Subota 09—13. Tako Google može da pročita radno vreme i prikaže ga uz sajt u pretrazi. Redove koji nisu u tom obliku (na primer „Nedelja — ne radimo“ ili „Sastanci van radnog vremena po dogovoru“) posetilac vidi normalno, ali ih Google preskače.",
    }),

    defineField({
      name: "pib",
      title: "PIB",
      type: "string",
      description: "Poreski identifikacioni broj, u pravnoj liniji u podnožju.",
    }),

    defineField({
      name: "advokatskaKomora",
      title: "Advokatska komora",
      type: "lokalniNaslov",
      description:
        "Stoji u pravnoj liniji u podnožju, pored godine i PIB-a. Na primer: Advokatska komora Srbije.",
    }),
  ],

  preview: {
    select: { title: "nazivKancelarije" },
    prepare: ({ title }) => ({
      title: "Podešavanja",
      subtitle: title,
    }),
  },
});
