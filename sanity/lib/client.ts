import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Sadržaj se čita u build-time, pa hoćemo najsvežije podatke, ne CDN keš —
  // webhook okida build odmah po objavi i CDN bi umeo da vrati staru verziju.
  useCdn: false,
  // Nacrti nikad ne smeju da završe u statičkom buildu.
  perspective: "published",
});
