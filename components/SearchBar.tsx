"use client"
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { getAllProducts, getCategories, type Products, type Category } from "../app/lib/products";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{products: Products[], categories: Category[]}>({products: [], categories: []});
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) { setResults({products: [], categories: []}); return; }
      
      const [allProducts, allCategories] = await Promise.all([getAllProducts(), getCategories()]);
      const term = query.toLowerCase();
      
      const filteredProducts = allProducts
       .filter(p => (p.name || "").toLowerCase().includes(term)) // <-- CORRIGÉ
       .slice(0, 5); // Max 5 produits
      
      const filteredCategories = allCategories
       .filter(c => (c.name || "").toLowerCase().includes(term)) // <-- CORRIGÉ
       .slice(0, 3); // Max 3 catégories

      setResults({products: filteredProducts, categories: filteredCategories});
      setShowResults(true);
    }

    const debounce = setTimeout(fetchResults, 300); // Attend 300ms
    return () => clearTimeout(debounce);
  }, [query]);

  // Ferme si on clique dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(searchRef.current &&!searchRef.current.contains(e.target as Node)) setShowResults(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(query) window.location.href = `/catalogue?search=${query}`;
    setShowResults(false);
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setShowResults(true)}
          placeholder="Recher un produit, une catégorie..."
          className="w-full pl-10 pr-10 py-3 border rounded-full bg-gray-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {query && <button type="button" onClick={() => setQuery("")}><X className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/></button>}
      </form>

      {showResults && (results.products.length > 0 || results.categories.length > 0) && (
        <div className="absolute top-14 w-full bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl p-4 z-50 max-h-96 overflow-y-auto">
          
          {results.categories.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-sm text-gray-500 mb-2">CATÉGORIES</h3>
              {results.categories.map(c => (
                <Link key={c.id} href={`/catalogue?cat=${c.name}`} onClick={() => setShowResults(false)} className="block p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"> {/* <-- CORRIGÉ: on envoie le nom */}
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {results.products.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-gray-500 mb-2">PRODUITS</h3>
              {results.products.map(p => (
                <Link key={p.id} href={`/produit/${p.id}`} onClick={() => setShowResults(false)} className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                  <img src={p.image} className="w-12 h-12 rounded object-cover"/>
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-purple-600 font-bold">{p.promo_price? `${p.promo_price}F : ${p.price}F}` : `${p.price}F`}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}