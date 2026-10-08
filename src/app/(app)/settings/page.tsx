import type { Metadata } from "next";
import { List, ListRow, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="Settings" />
      <List label="Settings sections">
        <ListRow title="Canvas" meta="Connect your Canvas account to import classes" trailing="Soon" />
        <ListRow title="Calendar feed" meta="A backup way to load assignments" trailing="Soon" />
        <ListRow title="Account" meta="Your email and log out" trailing="Soon" />
      </List>
    </>
  );
}
