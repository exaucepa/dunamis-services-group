"use client";
import { SetStateAction, useEffect, useState } from "react";
import { getActivePromos, type Products } from "../lib/products";
import ProductCard from "../../components/ProductCard";
import { Loader2, Flame } from "lucide-react";

export default function FlashPromoPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivePromos().then((data: SetStateAction<Products[]>) => { setProducts(data); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold flex items-center justify-center gap-2 text-red-600">
          <Flame /> Acquair Flash Promo <Flame />
        </h1>
        <p className="text-gray-500">Des offres qui partent en moins de 24h!</p>
      </div>

      {products.length === 0? (
        <p className="text-center text-gray-500 text-xl">Aucun produit en promotion en cours</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => <ProductCard key={product.id} {...product} />)}
        </div>
      )}
    </div>
  );
}