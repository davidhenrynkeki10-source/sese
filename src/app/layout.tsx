import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "./globals.css";
export const metadata: Metadata = { title: "Sésé — Shop wearables, textiles and objects.", description: "Shop Sésé wearables, textiles and objects." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
