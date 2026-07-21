"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Menu, X, Shield } from "lucide-react"; // <-- Shield ajouté
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import MenuDrawer from "./MenuDrawer";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount } = useCart();
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md shadow-sm dark:bg-zinc-950/95">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <motion.div whileHover={{ rotate:360 }} className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-xl font-bold text-white">D</motion.div>
            <div><h1 className="text-lg font-bold">DUNAMIS</h1><p className="text-xs tracking-widest text-gray-500">SERVICES GROUP</p></div>
          </Link>
          <nav className="hidden gap-8 lg:flex">
            <Link href="/" className="font-medium hover:text-blue-700">Accueil</Link>
            <Link href="/catalogue" className="font-medium hover:text-blue-700">Catalogue</Link>
            <Link href="/groupages" className="font-medium hover:text-blue-700">Groupages</Link>
            <Link href="/admin" className="font-medium text-red-600 hover:text-red-700 flex items-center gap-1"> {/* <-- AJOUT ADMIN */}
              <Shield size={16}/> Admin
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale:0.9 }} onClick={() => setCartOpen(true)} className="relative p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800">
              <ShoppingCart size={24}/>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">{cartCount}</span>}
            </motion.button>
            <button onClick={() => setMenuOpen(true)} className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 lg:hidden"><Menu size={24}/></button>
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}