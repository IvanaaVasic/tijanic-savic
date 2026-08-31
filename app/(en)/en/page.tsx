import type { Metadata } from "next";

import { HomePage, homeMetadata } from "@/components/HomePage/HomePage";

export function generateMetadata(): Promise<Metadata> {
  return homeMetadata("en");
}

export default function EnglishHome() {
  return <HomePage locale="en" />;
}
