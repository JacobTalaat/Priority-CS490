import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <section>
      <p className="eyebrow">Account</p>
      <h1 className="page-title">Settings</h1>
      <p className="page-note">Canvas connection and account settings will live here.</p>
    </section>
  );
}
