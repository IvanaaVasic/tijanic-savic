import type { Metadata } from "next";

import { HomePage, homeMetadata } from "@/components/HomePage/HomePage";

export function generateMetadata(): Promise<Metadata> {
  return homeMetadata("sr");
}

export default function SerbianHome() {
  return <HomePage locale="sr" />;
}
