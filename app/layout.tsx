import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mobile Ecommerce App",
  description: "Created by Nityam for a Client.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-900">
      <body className={inter.className}>
        <main className="bg-gray-900">
        {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
