import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { CartProvider } from "@/contexts/CartContext";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RYVEN Webstore",
  description: "Premium-youth perfume ecommerce experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <SiteHeader />
          <div className="pt-[64px]">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
