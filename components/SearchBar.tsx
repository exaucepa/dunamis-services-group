"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // 1. AJOUT
// Local fallback for products search to avoid missing-module build errors.
// If you have a real implementation, replace these with the correct import path.
type Product = {
  id: string
  name: string
  category: string
  price: number
  image: string
}

const searchProducts = async (q: string): Promise<Product[]> => {
  // minimal stub: return empty results. Replace with real search implementation.
  return []
}
import Link from "next/link"
import { Search, Loader2 } from "lucide-react"
import Image from "next/image"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter() // 2. AJOUT

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true)
      const data = await searchProducts(query)
      setResults(data)
      setLoading(false)
    }, 300) // on attend 300ms pour ne pas spam Supabase

    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleSearch = () => {
    if (query.length > 1) {
      router.push(`/search?q=${encodeURIComponent(query)}`  )
      setShowResults(false)
      setQuery("") // on vide la barre après recherche
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)} // délai pour pouvoir cliquer
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // 3. AJOUT
          placeholder="Recher un outil, une marque, une catégorie..."
          className="w-full pl-12 pr-4 py-3 border dark:border-zinc-700 rounded-full bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-gray-400" size={20} />}
      </div>

      {/* Résultats Anticipatifs */}
      {showResults && results.length > 0 && (
        <div className="absolute top-14 left-0 right-0 bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-2xl shadow-xl z-50 overflow-hidden">
          {results.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              onClick={() => setShowResults(false)} // ferme la liste au clic
              className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image src={product.image} alt={product.name} fill className="object-cover rounded-lg" unoptimized />
              </div>
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category} • {product.price.toLocaleString()} FCFA</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}