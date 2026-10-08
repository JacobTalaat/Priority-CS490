import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Priority — Make room for what matters",
  description: "A little clarity goes a long way. Make room for what matters.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'const savedTheme = localStorage.getItem("priority-theme"); if (savedTheme === "light" || savedTheme === "dark") document.documentElement.dataset.theme = savedTheme;',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
