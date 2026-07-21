"use client";

import { getFeaturedProductsWithPromo } from "../app/lib/products";
import ProductCard from "./ProductCard";

export default async function FeaturedProducts() {
  const products = await getFeaturedProductsWithPromo();
  if (products.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-red-50 dark:bg-red-950/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-red-600">🔥 VENTES FLASH</h2>
          <p className="text-gray-500 mt-2">Profitez des meilleures promos avant qu'elles ne disparaissent</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => <ProductCard key={product.id} {...product} />)}
        </div>
      </div>
    </section>
  );
}