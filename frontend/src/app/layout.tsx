import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { CartProvider } from "@/contexts/CartContext";
import { RootShell } from "@/components/layout/RootShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <RootShell>{children}</RootShell>
        </CartProvider>
      </body>
    </html>
  );
}
