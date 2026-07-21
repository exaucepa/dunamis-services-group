"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById, type Product } from "../../lib/products";
import { useCart } from "../../context/CartContext";
import { Heart, ShoppingCart, MessageCircle, Star } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart, orderSingleProduct } = useCart();

  useEffect(() => { getProductById(id as string).then(setProduct) }, [id]);
  if (!product) return <p className="text-center p-10">Chargement...</p>

  const isOnPromo = product.promo_price && product.promo_price < product.price;
  const displayPrice = product.promo_price || product.price;
  const whatsappMessage = `Bonjour, je veux commander: ${product.name} - ${new Intl.NumberFormat("fr-FR").format(displayPrice)} FCFA`;
  const whatsappLink = `https://wa.me/22890XXXXXX?text=${encodeURIComponent(whatsappMessage)}`; // Mets ton vrai numéro

  return (
    <div className="p-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
      {/* GALERIE */}
      <div className="space-y-4">
        <img src={product.image} alt={product.name} className="w-full rounded-2xl shadow-lg bg-gray-50 dark:bg-zinc-800 p-4" />
        {/* Tu peux mapper product.images ici après */}
      </div>

      {/* INFOS */}
      <div>
        <span className="rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm text-blue-700 dark:text-blue-300">{product.category}</span>
        <h1 className="text-4xl font-bold my-3">{product.name}</h1>

        <div className="flex items-center gap-2 my-3 text-gray-600">
          <Star size={18} className="text-yellow-500 fill-yellow-500" />
          <span>{product.rating} / 5 - 234 avis</span>
        </div>

        <div className="my-4">
          {isOnPromo? (
            <div>
              <p className="text-4xl font-extrabold text-red-600">{new Intl.NumberFormat("fr-FR").format(product.promo_price!)} FCFA</p>
              <p className="line-through text-gray-400">{new Intl.NumberFormat("fr-FR").format(product.price)} FCFA</p>
            </div>
          ) : (
            <p className="text-4xl font-extrabold text-blue-700 dark:text-blue-400">{new Intl.NumberFormat("fr-FR").format(product.price)} FCFA</p>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none my-6">
          <h3>Description ✨</h3>
          <p>{product.long_description || product.description}</p>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button onClick={() => addToCart({ id: product.id, name: product.name, price: displayPrice, image: product.image })} className="w-full bg-gray-800 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg hover:bg-gray-700">
            <ShoppingCart size={20}/> Ajouter au panier
          </button>
          <a href={whatsappLink} target="_blank" className="w-full bg-green-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg hover:bg-green-700">
            <MessageCircle size={20}/> Commander sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}