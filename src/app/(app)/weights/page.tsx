import type { Metadata } from "next";

export const metadata: Metadata = { title: "Weights" };

export default function WeightsPage() {
  return (
    <section>
      <p className="eyebrow">Grade weights</p>
      <h1 className="page-title">Weights</h1>
      <p className="page-note">Category weights for each class will show up here.</p>
    </section>
  );
}
