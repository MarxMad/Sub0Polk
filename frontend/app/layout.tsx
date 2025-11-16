import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/web3-provider";
import { PolkadotProvider } from "@/components/providers/polkadot-provider";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DotGo - Student Portfolio Platform",
  description: "Cross-chain student portfolio platform built on Polkadot and Base with pay-to-unlock reviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <PolkadotProvider>
            <Navbar />
            {children}
          </PolkadotProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
