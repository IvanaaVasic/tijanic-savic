// Phone numbers are written out readably on the site — with spaces, the way
// the lawyers type them into Settings. Neither the `tel:` scheme nor JSON-LD
// tolerates that, so this is the single place that strips a displayed number
// down to its digits.

/** "+381 63 123 456" -> "+38163123456". */
export function telNumber(number: string): string {
  return number.replace(/[^\d+]/g, "");
}

/** "+381 63 123 456" -> "tel:+38163123456". */
export function telHref(number: string): string {
  return `tel:${telNumber(number)}`;
}
