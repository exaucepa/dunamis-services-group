"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProductsById, getGroupageByProductsId, type Products, type Groupage } from "../../lib/products"; // EN ANGLAIS
import { ShoppingCart, MessageCircle, Star, Users, Clock, Check, ArrowLeft } from "lucide-react";
import Timer from "../../../components/Timer";

export default function ProductsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [products, setProducts] = useState<Products | null>(null); // Product
  const [groupage, setGroupage] = useState<Groupage | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if(!id) return;
    setLoading(true);
    Promise.all([getProductsById(id), getGroupageByProductsId(id)]) // getProductsById
  .then(([prod, grp]) => {
        setProducts(prod);
        setGroupage(grp);
        setLoading(false);
      })
  .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center p-10">Chargement...</p>
  if (!products) return <div className="text-center p-10"><p className="text-red-500 text-2xl mb-4">Produit introuvable 😢</p><Link href="/" className="text-purple-600 underline">Retour</Link></div>

  const isOnPromo = products.promo_price && products.promo_price < products.price;
  const displayPrice = products.promo_price || products.price;
  const allImages = [products.image,...products.images].filter(Boolean);
  const hasGroupage =!!groupage;
  const whatsappLink = `https://wa.me/22890667868?text=${encodeURIComponent(`Bonjour Dunamis, je veux commander: ${products.name} - ${new Intl.NumberFormat("fr-FR").format(displayPrice)} FCFA`)}`;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 mb-6 text-purple-600 hover:underline"><ArrowLeft size={18}/> Retour</Link>
        <div className="grid md:grid-cols-2 gap-10">
            <div>
                <img src={allImages[selectedImage]} alt={products.name} className="w-full h-[500px] object-contain rounded-2xl shadow-lg bg-gray-50 dark:bg-zinc-800 p-4 mb-4" />
                <div className="grid grid-cols-5 gap-2">{allImages.map((img, idx) => (<img key={idx} src={img} onClick={() => setSelectedImage(idx)} className={`h-24 object-contain rounded-lg cursor-pointer border-2 ${selectedImage === idx? 'border-purple-600' : 'border-transparent'}`} />))}</div>
            </div>
            <div>
                <span className="rounded-full bg-purple-100 dark:bg-purple-900 px-3 py-1 text-sm text-purple-700 dark:text-purple-300">{products.category}</span>
                <h1 className="text-4xl font-bold my-3">{products.name}</h1>
                <div className="flex items-center gap-2 my-3 text-gray-600"><Star size={18} className="text-yellow-500 fill-yellow-500" /><span>{products.rating} / 5 - {products.reviews_count} avis</span></div>
                <div className="my-4">{isOnPromo? (<div><p className="text-4xl font-extrabold text-red-600">{new Intl.NumberFormat("fr-FR").format(products.promo_price!)} FCFA</p><p className="line-through text-gray-400">{new Intl.NumberFormat("fr-FR").format(products.price)} FCFA</p>{products.promo_end_date && (<div className="mt-3 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-lg"><Clock size={18}/><p className="font-bold">Fin promo dans: <Timer date={products.promo_end_date} /></p></div>)}</div>) : (<p className="text-4xl font-extrabold text-purple-700 dark:text-purple-400">{new Intl.NumberFormat("fr-FR").format(products.price)} FCFA</p>)}</div>
                <div className="prose dark:prose-invert max-w-none my-6"><h3>Description</h3><p>{products.short_description || products.description}</p></div>
                <div className="flex items-center gap-2 text-green-600 mb-4"><Check size={18}/> <span>En stock: {products.stock} pièces</span></div>
                <div className="flex flex-col gap-3 mt-8">
                  <button onClick={() => addToCart(products)} disabled={products.stock <= 0} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg"><ShoppingCart size={20}/> {products.stock > 0? "Ajouter au panier" : "Rupture"}</button>
                  {hasGroupage && (<Link href={`/groupages/${groupage!.id}`} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg"><Users size={20}/> Rejoindre le groupage à {new Intl.NumberFormat("fr-FR").format(groupage!.prix_groupe)} FCFA</Link>)}
                  <a href={whatsappLink} target="_blank" className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg"><MessageCircle size={20}/> Commander sur WhatsApp</a>
                </div>
            </div>
        </div>
    </div>
  )
}

function useCart(): { addToCart: any; } {
  throw new Error("Function not implemented.");
}
