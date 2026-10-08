import type { Metadata } from "next";

export const metadata: Metadata = { title: "Today" };

export default function TodayPage() {
  return (
    <section>
      <p className="eyebrow">Due soon</p>
      <h1 className="page-title">Today</h1>
      <p className="page-note">Your assignments for today will show up here.</p>
    </section>
  );
}
