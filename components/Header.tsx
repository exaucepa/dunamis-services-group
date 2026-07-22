"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import { getCartCount } from "../app/lib/cart"; // <-- Importe

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateCartCount = () => {
    setCartCount(getCartCount()); // <-- Utilise la fonction
  };

  useEffect(() => {
    updateCartCount(); 
    
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount); // <-- Pour onglet 2
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
        <Link href="/" className="font-bold text-2xl text-purple-600">DUNAMIS</Link>
        
        <div className="hidden md:block flex-1">
          <SearchBar />
        </div>

        <nav className="hidden md:flex gap-6 items-center font-medium">
          <Link href="/" className="hover:text-purple-600">Accueil</Link>
          <Link href="/catalogue" className="hover:text-purple-600">Catalogue</Link>
          <Link href="/a-propos" className="hover:text-purple-600">À propos</Link>
          
          <Link href="/panier" className="relative p-2">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
          {mobileOpen ? <X/> : <Menu/>}
        </button>
      </div>

      <div className="md:hidden px-4 pb-4">
        <SearchBar />
      </div>

      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
          <Link href="/" onClick={() => setMobileOpen(false)}>Accueil</Link>
          <Link href="/catalogue" onClick={() => setMobileOpen(false)}>Catalogue</Link>
          <Link href="/a-propos" onClick={() => setMobileOpen(false)}>À propos</Link>
        </div>
      )}
    </header>
  );
}