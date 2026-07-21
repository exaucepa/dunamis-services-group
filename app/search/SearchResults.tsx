"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { searchProducts, type Product } from "../lib/products"
import ProductCard from "../../components/ProductCard" // utilise ta carte produit existante
import { Loader2, Search } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) return
    const fetchResults = async () => {
      setLoading(true)
      const data = await searchProducts(query)
      setProducts(data)
      setLoading(false)
    }
    fetchResults()
  }, [query])

  if (loading) {
    return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" size={40} /></div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">
        Résultats pour: <span className="text-blue-600">"{query}"</span>
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{products.length} produit(s) trouvé(s)</p>

      {products.length === 0? (
        <div className="text-center p-12">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <p>Aucun produit trouvé pour "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </div>
  )
}