"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "../app/lib/cart"; // <-- NOUVEAU
import { type Products, formatPrice } from "../app/lib/products"; 

export default function ProductCard(product: Products) {
  const price = product.promo_price || product.price;
  const hasPromo = !!product.promo_price;
  const discount = hasPromo? Math.round((1 - product.promo_price! / product.price) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product); // <-- Utilise la fonction globale
    alert(`${product.name} ajouté au panier !`); // petit feedback
  }

  return (
    <motion.div whileHover={{ y: -5 }} className="group bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition flex-col">
      <Link href={`/products/${product.id}`} className="flex-1"> {/* <-- CORRIGÉ /produit/ */}
        <div className="relative">
          <img src={product.image} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"/>
          {hasPromo && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {product.stock <= 0 && (
            <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
              RUPTURE
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-2xl font-bold text-purple-600">{formatPrice(price)} FCFA</p> {/* <-- Couleur purple */}
            {hasPromo && <p className="text-sm line-through text-gray-400">{formatPrice(product.price)} FCFA</p>}
          </div>
        </div>
      </Link>
      
      <button 
        onClick={handleAddToCart} 
        disabled={product.stock <= 0}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 flex items-center justify-center gap-2 font-bold transition"
      >
        <ShoppingCart size={18}/> 
        {product.stock > 0? "Ajouter" : "Indisponible"}
      </button>
    </motion.div>
  );
}