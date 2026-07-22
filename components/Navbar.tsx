"use client";
import Link from "next/link"; import { Menu, Search, ShoppingCart, X, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react"; import { getAllProducts, getCategories, type Products, type Category } from "../app/lib/products";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [query, setQuery] = useState(""); const [showSearch, setShowSearch] = useState(false); const [openMobile, setOpenMobile] = useState(false);
  const [results, setResults] = useState<{products: Products[], categories: Category[]}>({products: [], categories: []});
  const { cart } = useCart(); const searchRef = useRef<HTMLDivElement>(null); const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => { const fetchResults = async () => { if (query.length < 2) { setResults({products: [], categories: []}); return; }
      const [allProducts, allCategories] = await Promise.all([getAllProducts(), getCategories()]);
      setResults({ products: allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5),
        categories: allCategories.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3) }); }
    const debounce = setTimeout(fetchResults, 300); return () => clearTimeout(debounce); }, [query]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-xl font-bold text-white">D</div><div><h1 className="text-lg font-extrabold text-slate-900">DUNAMIS</h1></div></Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/">Accueil</Link><Link href="/catalogue">Catalogue</Link><Link href="/categories">Catégories</Link><Link href="/about">À propos</Link>
          <Link href="/admin" className="flex items-center gap-1 bg-zinc-800 text-white px-3 py-2 rounded-lg text-sm"><Settings size={16}/>Admin</Link>
        </nav>
        <div className="flex items-center gap-3 relative" ref={searchRef}>
          <button onClick={() => setShowSearch(!showSearch)}><Search size={22} /></button>
          {showSearch && ( <div className="absolute right-0 top-16 w-[90vw] md:w-96 bg-white shadow-2xl rounded-2xl p-4 z-50"><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Recher..." className="w-full p-3 border rounded-lg bg-gray-100"/></div> )}
          <Link href="/cart" className="relative"><ShoppingCart size={22} />{cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">{cartCount}</span>}</Link>
          <button onClick={() => setOpenMobile(!openMobile)} className="rounded-xl p-3 md:hidden">{openMobile? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
      {openMobile && (<div className="md:hidden bg-white dark:bg-zinc-900 border-t p-4 flex flex-col gap-4"><Link href="/" onClick={() => setOpenMobile(false)}>Accueil</Link><Link href="/catalogue" onClick={() => setOpenMobile(false)}>Catalogue</Link><Link href="/admin" onClick={() => setOpenMobile(false)}>Admin</Link></div>)}
    </header>
  );
}