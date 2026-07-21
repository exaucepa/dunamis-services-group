"use client";

import { useState, useEffect } from "react";
import { getAllProducts, getCategories } from "../lib/products";
import ProductCard from "../../components/ProductCard";
import type { Product, Category } from "../lib/products";

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [prods, cats] = await Promise.all([
        getAllProducts(),
        getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Chargement du catalogue...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-2">Catalogue Complet</h1>
      <p className="text-gray-500 mb-10">{products.length} produits disponibles</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => <ProductCard key={product.id} {...product} />)}
      </div>
    </div>
  );
}