import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { CartProvider } from "@/contexts/CartContext";
import { RootShell } from "@/components/layout/RootShell";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RYVEN — Modern Fragrances That Last",
  description: "RYVEN PERFUMES — Clean, bold, long-lasting fragrances made in India. Shop by occasion, explore fragrance notes, and find your signature scent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          <RootShell>{children}</RootShell>
        </CartProvider>
      </body>
    </html>
  );
}
