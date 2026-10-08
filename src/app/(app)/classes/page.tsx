import type { Metadata } from "next";

export const metadata: Metadata = { title: "Classes" };

export default function ClassesPage() {
  return (
    <section>
      <p className="eyebrow">This term</p>
      <h1 className="page-title">Classes</h1>
      <p className="page-note">Your classes will show up here once Canvas is connected.</p>
    </section>
  );
}
