"use client";
import { useState } from "react";
import { Users, Clock, CheckCircle } from "lucide-react";
import { addToCart } from "../app/lib/cart";
import type { Products } from "../app/lib/products";
import PopupConfirm from "./PopupConfirm";

export default function GroupageCard({ groupage }: { groupage: any }) {
  const [showPopup, setShowPopup] = useState(false);
  const product = groupage.products; // attention c'est products avec s à cause du join
  if (!product) return null;

  const progress = Math.min((groupage.current_quantity / groupage.objectif_participants) * 100, 100);
  const isFull = groupage.current_quantity >= groupage.objectif_participants;
  const isExpired = new Date(groupage.date_fin_groupage) < new Date();
  const isInactive = groupage.status!== 'en_cours';
  const isDisabled = isFull || isExpired || isInactive;

  let buttonText = "Rejoindre le groupe";
  if(isFull) buttonText = "Objectif Atteint ✅";
  else if(isExpired) buttonText = "Délai Dépassé";
  else if(isInactive) buttonText = "Non Disponible";

  const handleSuccess = () => {
    const productForCart: Products = {
      id: groupage.id, name: product.name, price: groupage.prix_groupe, image: product.image,
      category: "Groupage", description: product.description || "", stock: 1, promo_price: product.price,
      promo_end_date: null,
      images: [],
      short_description: "",
      rating: 0,
      reviews_count: 0
    }
    addToCart(productForCart)
  }

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-5 border">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm line-through text-gray-400">{product.price} FCFA</p>
          <p className="text-2xl font-bold text-green-600">{groupage.prix_groupe} FCFA</p>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center gap-1"><Users size={14}/>{groupage.current_quantity}/{groupage.objectif_participants} participants</span>
            <span className="flex items-center gap-1"><Clock size={14}/>{new Date(groupage.date_fin_groupage).toLocaleDateString()}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          disabled={isDisabled}
          className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isFull && <CheckCircle size={18}/>}
          {buttonText}
        </button>
      </div>
      <PopupConfirm
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onSuccess={handleSuccess}
        groupage={{ id: groupage.id, title: product.name, price: groupage.prix_groupe, image: product.image }}
      />
    </>
  )
}