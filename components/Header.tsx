"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import { getCartCount } from "../app/lib/cart";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateCartCount = () => {
    setCartCount(getCartCount());
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Catalogue", href: "/catalogue" },
    { name: "Groupages", href: "/groupages" },
    { name: "À propos", href: "/a-propos" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
        <Link href="/" className="font-bold text-2xl text-blue-700">DUNAMIS</Link>

        <div className="hidden md:block flex-1">
          <SearchBar />
        </div>

        <nav className="hidden md:flex gap-6 items-center font-medium">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-blue-700 transition-colors">
              {link.name}
            </Link>
          ))}
          <Link href="/panier" className="relative p-2">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
          {mobileOpen? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      <div className="md:hidden px-4 pb-4">
        <SearchBar />
      </div>

      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t pt-4">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setMobileOpen(false)} className="py-2">
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}