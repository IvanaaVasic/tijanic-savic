import { client } from "./client";
import { CONTENT_QUERY, SETTINGS_QUERY } from "./queries";

// The return types are not written out here. `sanity typegen` widens
// client.fetch through sanity/types.ts, so the return value follows the schemas.
// After a schema change: yarn typegen.

// Without an explicit revalidate Next stores the Sanity response for a year,
// and both Vercel and the local .next folder carry that cache into the next
// build — so a fresh build serves the content from before the publish. Thirty
// seconds is long enough to be reused within one build (the same query runs
// for the Serbian and the English page) and short enough that the following
// build goes back to Sanity. Zero is not an option: it makes the route dynamic,
// which output: 'export' rejects.
const FETCH_OPTIONS = { next: { revalidate: 30 } };

/** All the content of one page, in a single round trip to Sanity. */
export function fetchContent() {
  return client.fetch(CONTENT_QUERY, {}, FETCH_OPTIONS);
}

/** Settings only — for metadata and JSON-LD, where the rest is not needed. */
export function fetchSettings() {
  return client.fetch(SETTINGS_QUERY, {}, FETCH_OPTIONS);
}
