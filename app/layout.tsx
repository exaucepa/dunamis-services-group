import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DUNAMIS SERVICES GROUP",
  description: "DUNAMIS SERVICES-GROUP - Vos solutions de services professionnelles. Qualité, Fiabilité, Proximité.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "DUNAMIS SERVICES GROUP" },
};

export const viewport: Viewport = { 
  themeColor: "#0000aa",
  width: "device-width", // <- AJOUTÉ
  initialScale: 1, // <- AJOUTÉ
  maximumScale: 1, // <- AJOUTÉ
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}