// Vrednosti dolaze iz .env.local (lokalno) i iz podešavanja hostinga (build).
// NEXT_PUBLIC_ prefiks je nužan jer iste vrednosti koristi i Studio u browseru.

function obavezna(vrednost: string | undefined, ime: string): string {
  if (!vrednost) {
    throw new Error(
      `Nedostaje env varijabla ${ime}. Prepiši .env.example u .env.local i popuni je.`
    );
  }
  return vrednost;
}

export const projectId = obavezna(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID"
);

export const dataset = obavezna(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET"
);

// Sanity API se verzioniše datumom. Zaključan je namerno — ako se ne dira,
// odgovori sa API-ja se ne menjaju ispod nogu.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-08-21";
