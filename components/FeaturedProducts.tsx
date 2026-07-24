"use client"
import { useState, useEffect } from "react";
import { getAllProducts, type Products } from "../app/lib/products";
import Link from "next/link";
import { Loader2, ShoppingCart } from "lucide-react";
import { addToCart } from "../app/lib/cart"; // AJOUTÉ

export default function FeaturedProducts() { 
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const allProducts = await getAllProducts();
      const featured = allProducts.filter(p => p.featured).slice(0, 8);
      setProducts(featured);
      setLoading(false);
    }
    fetchFeatured();
  }, [])

  const handleAddToCart = (product: Products) => {
    addToCart(product);
    alert(`${product.name} ajouté au panier !`);
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin"/></div>

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">🔥 Produits Vedettes</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="group border rounded-2xl p-4 hover:shadow-xl transition flex-col">
            <Link href={`/products/${p.id}`}>
              <img src={p.image} className="h-48 w-full object-cover rounded-lg mb-3"/>
              <h3 className="font-bold truncate">{p.name}</h3>
              <p className="text-blue-600 font-bold text-lg mb-3">
                {p.promo_price? `${p.promo_price.toLocaleString()} FCFA` : `${p.price.toLocaleString()} FCFA`}
              </p>
            </Link>
            
            {/* CORRIGÉ ICI */}
            <button 
              onClick={() => handleAddToCart(p)}
              disabled={p.stock <= 0}
              className="mt-auto w-full bg-blue-600 disabled:bg-gray-400 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
            >
              <ShoppingCart size={16}/> {p.stock > 0 ? "Ajouter" : "Rupture"}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}