import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
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
      <body>
        <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-in">
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
