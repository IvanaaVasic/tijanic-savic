import { defineCliConfig } from "sanity/cli";

// Vrednosti su ovde upisane, a ne uvezene iz sanity/env.ts, jer sanity CLI
// ne učitava .env.local pre nego što pročita ovaj fajl. projectId i dataset
// nisu tajna — ionako završe u klijentskom bundlu.
export default defineCliConfig({
  api: {
    projectId: "0crkldl6",
    dataset: "production",
  },
});
