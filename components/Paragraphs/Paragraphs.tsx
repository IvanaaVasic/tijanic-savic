// Portable text from Sanity — the lokalniBlok type. The schema only allows
// paragraphs, bold and italic, so the renderer is only this big: no headings, no
// lists, no links. The heading hierarchy is set by the design, not by editing.
//
// PortableText comes from next-sanity, which re-exports @portabletext/react.
// We do not add it to package.json separately — that would mean two versions of
// the same library in the tree.
//
// This component has no .module.css of its own: the paragraph size depends on
// the section (17px in About, 16px in the lawyer card), so the caller supplies
// the classes.

import { PortableText, type PortableTextComponents } from "next-sanity";

import type { LokalniBlok } from "@/sanity/types";

/** The block array for one locale, already picked out by inLocale(). */
export type Blocks = NonNullable<LokalniBlok["sr"]>;

type Props = {
  blocks: Blocks | null | undefined;
  /** Class for the wrapper; it carries the spacing between paragraphs. */
  wrapperClassName?: string;
  /** Class applied to every <p>. */
  paragraphClassName?: string;
};

export function Paragraphs({
  blocks,
  wrapperClassName,
  paragraphClassName,
}: Props) {
  if (!blocks || blocks.length === 0) return null;

  // An empty line in the Studio arrives as a block with no text. If it got
  // through it would get its own <p> and the spacing around it — a hole in the
  // text that nobody asked for.
  const filled = blocks.filter((block) =>
    block.children?.some((child) => (child.text ?? "").trim() !== ""),
  );

  if (filled.length === 0) return null;

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className={paragraphClassName}>{children}</p>
      ),
    },
  };

  return (
    <div className={wrapperClassName}>
      <PortableText value={filled} components={components} />
    </div>
  );
}

/**
 * The same blocks as one line of plain text — for the JSON-LD and the meta
 * description, where no markup can go. Paragraphs are joined by a space, so
 * the sentences do not run into each other.
 */
export function blocksToText(blocks: Blocks | null | undefined): string {
  if (!blocks) return "";

  return blocks
    .map((block) =>
      (block.children ?? []).map((child) => child.text ?? "").join(""),
    )
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
}
