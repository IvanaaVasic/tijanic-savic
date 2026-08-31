import { defineCliConfig } from "sanity/cli";

// The values are written out here rather than imported from sanity/env.ts,
// because the sanity CLI does not load .env.local before it reads this file.
// projectId and dataset are not secrets — they end up in the client bundle
// anyway.
export default defineCliConfig({
  api: {
    projectId: "0crkldl6",
    dataset: "production",
  },
});
