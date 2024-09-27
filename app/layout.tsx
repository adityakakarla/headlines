import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import Navbar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "headlines",
  description: "ai-powered headline generator",
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-light2 to-light1`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
