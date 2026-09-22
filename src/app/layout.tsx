import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "Sésé — Heritage, Reimagined.",
  description:
    "A contemporary African heritage design house. Discover a considered world of wearables, objects and textiles.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
