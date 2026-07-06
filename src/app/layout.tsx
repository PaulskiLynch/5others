import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "5others",
  description:
    "Weekly anonymous circles for encouragement, persistence, and quiet accountability.",
  metadataBase: new URL("https://5others.com")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
