import type { Metadata } from "next";

import { AreaPage, areaMetadata, areaParams } from "@/components/AreaPage/AreaPage";

// One page per practice area, written at build time. An address that is not in
// the list is not a page — with a static export there is nothing to render it
// on request, so it goes to 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return areaParams();
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return areaMetadata("en", slug);
}

export default async function EnglishArea({ params }: Props) {
  const { slug } = await params;
  return <AreaPage locale="en" slug={slug} />;
}
