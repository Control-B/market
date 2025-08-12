import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Marketplace - Reverse Lead Generation",
  description:
    "Post your needs, get AI-matched offers from verified sellers. Escrow protection, group buying, and AI concierge included.",
  keywords:
    "AI marketplace, reverse lead generation, RFP, buyer, seller, escrow, group buying",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
