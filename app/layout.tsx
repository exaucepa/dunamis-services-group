import type { Metadata, Viewport } from "next"; // <- AJOUTE Viewport
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DUNAMIS SERVICES GROUP",
  description: "DUNAMIS SERVICES-GROUP - Vos solutions de services professionnelles. Qualité, Fiabilité, Proximité.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DUNAMIS SERVICES GROUP",
  },
};

export const viewport: Viewport = { // <- AJOUTE LE TYPE ICI
  themeColor: "#0000aa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* SUPPRIME les meta en double, Next les gère déjà avec metadata + viewport */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}