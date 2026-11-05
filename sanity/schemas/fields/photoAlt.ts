import { defineField } from "sanity";

/**
 * The alt field every photograph on the site carries: a lokalniNaslov, so the
 * English page gets its own description, with only the Serbian side required —
 * the English one falls back to it when left empty.
 *
 * A function rather than a shared object type, so the stored data stays exactly
 * what it was: `alt` is a lokalniNaslov directly on the image, as it has been on
 * the lawyer portrait from the start.
 */
export function photoAlt() {
  return defineField({
    name: "alt",
    title: "Opis fotografije",
    type: "lokalniNaslov",
    description:
      "Kratak opis onoga što se vidi na fotografiji. Čita ga čitač ekrana, a prikazuje se i ako se slika ne učita.",
    // Rule.required() na objektu prošlo bi i kad su oba jezika prazna, pa
    // se traži srpska strana — engleska se na nju vraća kad ostane prazna.
    // Tip se navodi jer Rule.custom za ugnežđeni objekat vidi samo {}.
    validation: (Rule) =>
      Rule.custom<{ sr?: string } | undefined>((value) =>
        value?.sr?.trim() ? true : "Opis fotografije je obavezan.",
      ),
  });
}
