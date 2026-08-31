import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Content is read at build time, so we want the freshest data, not the CDN
  // cache — the webhook fires a build right after publish and the CDN would
  // happily hand back the previous version.
  useCdn: false,
  // Drafts must never end up in a static build.
  perspective: "published",
});
