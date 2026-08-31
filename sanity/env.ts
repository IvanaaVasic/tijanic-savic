// The values come from .env.local (locally) and from the hosting configuration
// (at build time). The NEXT_PUBLIC_ prefix is required because the Studio uses
// the same values in the browser.

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing env variable ${name}. Copy .env.example to .env.local and fill it in.`
    );
  }
  return value;
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID"
);

export const dataset = required(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET"
);

// The Sanity API is versioned by date. It is pinned deliberately — leave it
// alone and the API responses will not shift underneath you.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-08-21";
