import { client } from "./client";
import { CONTENT_QUERY, SETTINGS_QUERY } from "./queries";

// The return types are not written out here. `sanity typegen` widens
// client.fetch through sanity/types.ts, so the return value follows the schemas.
// After a schema change: yarn typegen.

/** All the content of one page, in a single round trip to Sanity. */
export function fetchContent() {
  return client.fetch(CONTENT_QUERY);
}

/** Settings only — for metadata and JSON-LD, where the rest is not needed. */
export function fetchSettings() {
  return client.fetch(SETTINGS_QUERY);
}
