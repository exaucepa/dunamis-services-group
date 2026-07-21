"use client";
import { useCart } from "../app/context/CartContext";
import { type Product } from "../app/lib/products";
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      disabled={product.stock <= 0}
      className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
    >
      <ShoppingCart />
      {product.stock > 0? "Ajouter au panier" : "Indisponible"}
    </button>
  );
}