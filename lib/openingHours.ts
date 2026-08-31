// Google does not read the opening hours off the page — it reads them out of
// the JSON-LD. So the free-text "Radno vreme" field from Settings has to be
// turned into openingHoursSpecification.
//
// The field stays free text on purpose: the lawyers write it the way it should
// read on the site, and nothing is entered twice. What this file does is
// recognise the shape the field description asks for — one interval per line,
// "<days> <from>—<to>" — and ignore every line it does not fully understand.
//
// Ignoring is the point. Wrong opening hours in search results are worse than
// none at all, so a line is either read whole or not read. A day that is not
// listed counts as closed, which is exactly how Google reads a missing day —
// that is why "Nedelja — ne radimo" needs no handling of its own: it carries no
// times, so it drops out, and Sunday ends up closed anyway.

/** One openingHoursSpecification entry, ready to go into the JSON-LD. */
export type OpeningHours = {
  dayOfWeek: string[];
  opens: string;
  closes: string;
};

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const WEEKEND = ["Saturday", "Sunday"];

// The order matters: the first pattern that matches a line wins. Working days
// come first, because "radnim danima" would otherwise have to be excluded from
// every pattern below it.
const DAYS: ReadonlyArray<readonly [RegExp, string[]]> = [
  [
    /radn(im|i|e)\s+dan|week\s?days?|working\s+days?|business\s+days?|pon(edeljak)?\.?\s*[-–—]\s*pet(ak)?|mon(day)?\s*[-–—]\s*fri(day)?/i,
    WEEKDAYS,
  ],
  [/vikend|weekend|sub(ota)?\.?\s*[-–—]\s*ned(elja)?|sat(urday)?\s*[-–—]\s*sun(day)?/i, WEEKEND],
  [/subot|saturday/i, ["Saturday"]],
  [/nedelj|sunday/i, ["Sunday"]],
];

// "09—17", "09:00 - 17:00", "9-13h". The dash may be a hyphen or either en/em
// dash — the lawyers type whichever their keyboard offers.
const TIMES = /(\d{1,2})(?::(\d{2}))?\s*[-–—]\s*(\d{1,2})(?::(\d{2}))?/;

/** "9" -> "09:00", "9" + "30" -> "09:30". Null when it is not a real time. */
function clockTime(hour: string, minute: string | undefined): string | null {
  const h = Number(hour);
  const m = minute === undefined ? 0 : Number(minute);

  if (h > 23 || m > 59) return null;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Splits the field into the lines to be read one by one. The lawyers separate
 * intervals by a new line, but a full stop does the same job — "Radnim danima
 * 09—17h. Subota 09—13h." is two intervals, not one.
 */
function lines(text: string): string[] {
  return text
    .split(/[\n;]+|\.(?=\s|$)/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * The opening hours out of the Settings text, or an empty array when not a
 * single line could be read whole. The caller then leaves the property out
 * altogether rather than publishing half a schedule.
 */
export function readOpeningHours(text: string | null | undefined): OpeningHours[] {
  if (!text) return [];

  const found: OpeningHours[] = [];

  for (const line of lines(text)) {
    const days = DAYS.find(([pattern]) => pattern.test(line))?.[1];
    if (!days) continue;

    const times = TIMES.exec(line);
    if (!times) continue;

    const opens = clockTime(times[1], times[2]);
    const closes = clockTime(times[3], times[4]);

    // An interval that ends before it begins is a typo, not a night shift.
    if (!opens || !closes || opens >= closes) continue;

    // The same day twice would be a contradiction rather than a second shift —
    // the field holds one interval per day, so the first reading stands.
    const taken = new Set(found.flatMap((entry) => entry.dayOfWeek));
    const fresh = days.filter((day) => !taken.has(day));
    if (fresh.length === 0) continue;

    found.push({ dayOfWeek: fresh, opens, closes });
  }

  return found;
}
