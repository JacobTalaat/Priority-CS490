import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Classes" };

export default function ClassesPage() {
  return (
    <PageHeader
      eyebrow="This term"
      title="Classes"
      description="Your classes will show up here once Canvas is connected."
    />
  );
}
