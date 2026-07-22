"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProductById, getGroupageByProductId, type Product, type Groupage } from "../../lib/products";
import { addToCart } from "../../lib/cart"; // <-- ON VIRE useCart. On utilise le global
import { Heart, ShoppingCart, MessageCircle, Star, Users, Clock } from "lucide-react";
import Timer from "../../../components/Timer"; // <-- Pour le compte à rebours promo

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [groupage, setGroupage] = useState<Groupage | null>(null); // <-- ETAT GROUPAGE

  useEffect(() => {
    async function load(){
      const prod = await getProductById(id as string);
      const grp = await getGroupageByProductId(id as string); // <-- Charge groupage
      setProduct(prod);
      setGroupage(grp);
    }
    load();
  }, [id]);

  if (!product) return <p className="text-center p-10">Chargement...</p>

  const isOnPromo = product.promo_price && product.promo_price < product.price;
  const displayPrice = product.promo_price || product.price;
  const hasGroupage =!!groupage;

  const whatsappMessage = `Bonjour, je veux commander: ${product.name} - ${new Intl.NumberFormat("fr-FR").format(displayPrice)} FCFA`;
  const whatsappLink = `https://wa.me/22890XXXXXX?text=${encodeURIComponent(whatsappMessage)}`; // Mets ton vrai numéro

  const handleAddToCart = () => {
    addToCart(product); // <-- Utilise la fonction globale. Le header va bouger
    alert(`${product.name} ajouté au panier!`);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
      {/* GALERIE */}
      <div className="space-y-4">
        <img src={product.image} alt={product.name} className="w-full rounded-2xl shadow-lg bg-gray-50 dark:bg-zinc-800 p-4" />
      </div>

      {/* INFOS */}
      <div>
        <span className="rounded-full bg-purple-100 dark:bg-purple-900 px-3 py-1 text-sm text-purple-700 dark:text-purple-300">{product.category}</span>
        <h1 className="text-4xl font-bold my-3">{product.name}</h1>

        <div className="flex items-center gap-2 my-3 text-gray-600">
          <Star size={18} className="text-yellow-500 fill-yellow-500" />
          <span>{product.rating} / 5 - {product.reviews_count || 234} avis</span>
        </div>

        <div className="my-4">
          {isOnPromo? (
            <div>
              <p className="text-4xl font-extrabold text-red-600">{new Intl.NumberFormat("fr-FR").format(product.promo_price!)} FCFA</p>
              <p className="line-through text-gray-400">{new Intl.NumberFormat("fr-FR").format(product.price)} FCFA</p>

              {/* COMPTE A REBOURS PROMO */}
              {product.promo_end_date && (
                <div className="mt-3 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-lg">
                  <Clock size={18}/>
                  <p className="font-bold">Fin dans: <Timer date={product.promo_end_date} /></p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-4xl font-extrabold text-purple-700 dark:text-purple-400">{new Intl.NumberFormat("fr-FR").format(product.price)} FCFA</p>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none my-6">
          <h3>Description ✨</h3>
          <p>{product.short_description || product.description}</p>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={handleAddToCart} // <-- Utilise le handler
            disabled={product.stock <= 0}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition"
          >
            <ShoppingCart size={20}/> {product.stock > 0? "Ajouter au panier" : "Rupture"}
          </button>

          {/* BOUTON GROUPAGE */}
          {hasGroupage? (
            <Link href={`/groupages/${groupage.id}`} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition">
              <Users size={20}/> Rejoindre le groupage à {new Intl.NumberFormat("fr-FR").format(groupage.prix_groupe)} FCFA
            </Link>
          ) : null}

          <a href={whatsappLink} target="_blank" className="w-full bg-green-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg hover:bg-green-700">
            <MessageCircle size={20}/> Commander sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}