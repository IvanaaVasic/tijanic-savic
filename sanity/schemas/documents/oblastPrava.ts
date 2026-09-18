import { defineArrayMember, defineField, defineType } from "sanity";

// Serbian letters that have no plain-Latin twin. The address of a page is
// written without diacritics — "porodicno-pravo", not "porodično-pravo".
const PLAIN: Record<string, string> = {
  č: "c",
  ć: "c",
  š: "s",
  ž: "z",
  đ: "dj",
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[čćšžđ]/g, (letter) => PLAIN[letter] ?? letter)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export const oblastPrava = defineType({
  name: "oblastPrava",
  title: "Oblast prava",
  type: "document",
  fields: [
    defineField({
      name: "naziv",
      title: "Naziv oblasti",
      type: "lokalniNaslov",
      description:
        "Naslov kartice na početnoj, stavka u meniju pod Oblasti prava i veliki naslov na stranici oblasti. Na primer: Porodično pravo.",
      // The Serbian side is what everything falls back to, so it is the one that
      // must exist. The type is given because Rule.custom on a nested object
      // otherwise only sees {}.
      validation: (Rule) =>
        Rule.custom<{ sr?: string } | undefined>((value) =>
          value?.sr?.trim() ? true : "Naziv na srpskom je obavezan.",
        ),
    }),

    defineField({
      name: "slug",
      title: "Adresa stranice",
      type: "slug",
      description:
        "Poslednji deo adrese stranice ove oblasti, na primer porodicno-pravo u tijanicsaviclegal.rs/oblasti-prava/porodicno-pravo. Kliknite Generate i adresa se sama napravi od naziva. Kad je sajt jednom objavljen, ne menjajte je — stari linkovi bi prestali da rade.",
      options: {
        source: "naziv.sr",
        slugify,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "kratakOpis",
      title: "Kratak opis",
      type: "lokalniTekst",
      description:
        "Jedna do dve rečenice na kartici na početnoj, ispod naziva. Ukratko šta sve oblast obuhvata.",
    }),

    defineField({
      name: "opis",
      title: "Opis",
      type: "lokalniBlok",
      description:
        "Tekst na stranici oblasti, ispod naslova: kako teče postupak, koliko traje, kako radite sa klijentom. Ako ostane prazno, na stranici stoji kratak opis.",
    }),

    defineField({
      name: "usluge",
      title: "Usluge u ovoj oblasti",
      type: "array",
      description:
        "Spisak ispod opisa na stranici oblasti, svaka usluga u svom redu. Na primer: Sporazumni razvod braka. Ako ostane prazno, spiska nema.",
      of: [
        defineArrayMember({
          type: "lokalniNaslov",
          title: "Usluga",
        }),
      ],
    }),

    defineField({
      name: "redosled",
      title: "Redosled prikaza",
      type: "number",
      description:
        "Određuje mesto u meniju i među karticama na početnoj. Manji broj ide prvi: 1, 2, 3…",
      validation: (Rule) => Rule.required().integer().positive(),
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
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
    select: { title: "naziv.sr", subtitle: "slug.current" },
  },
});
