"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { getStatutProgress, getStatutText, type Groupage } from "../../lib/groupages";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function GroupagePage({ params }: { params: { id: string } }) {
  const [groupage, setGroupage] = useState<Groupage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroupage = async () => {
      const { data, error } = await supabase
        .from("groupages")
        .select(", product:products()") // CORRIGÉ ICI
        .eq("id", params.id)
        .single();
      
      if (error) {
        console.error(error);
      } else {
        // supabase may return a parser error type; ensure we only set when no error
        setGroupage(data as unknown as Groupage);
      }
    };
    fetchGroupage();
  }, [params.id]);

  if (!groupage) return <div className="container mx-auto p-12 text-center">Chargement...</div>;

  const progress = (groupage.current_quantity / groupage.target_quantity) * 100;
  const statutProgress = getStatutProgress(groupage.statut);

  const confirmerRejoindre = async () => {
    setLoading(true);
    setShowModal(false);
    const { error } = await supabase
      .from("groupages")
      .update({ current_quantity: groupage.current_quantity + 1 })
      .eq("id", groupage.id);
    
    if(!error){
      const message = `Salut! Je confirme pour le groupage: ${groupage.title}`;
      window.open(`https://wa.me/22890667868?text=${encodeURIComponent(message)}`, '_blank');
      window.location.reload();
    }
    setLoading(false);
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-blue-500 hover:underline">← Retour à l'accueil</Link>
      
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {/* COLONNE 1: PHOTOS + DESCRIPTION */}
        <div>
          <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-4">
            <Image src={groupage.product.image} alt={groupage.product.name} fill className="object-cover" unoptimized/>
          </div>
          <h2 className="text-2xl font-bold">Description du produit</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">
            {groupage.product.description || "Aucune description disponible."}
          </p>
        </div>

        {/* COLONNE 2: BLOC GROUPAGE */}
        <div className="sticky top-4 h-fit">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-bold px-3 py-1 rounded-full">GROUPAGE EN COURS</span>
          <h1 className="text-3xl font-bold mt-2">{groupage.title}</h1>
          <p className="text-gray-500 dark:text-gray-400">{groupage.product.name}</p>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl mt-4">
            <p className="text-sm">Prix Groupé</p>
            <p className="text-3xl font-bold text-green-600">{groupage.group_price.toLocaleString()} FCFA</p>
            <p className="text-sm line-through text-gray-400">Prix normal: {groupage.product.price.toLocaleString()} FCFA</p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1 font-bold">
              <span>{groupage.current_quantity} / {groupage.target_quantity} personnes</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-xs mt-1">Fin du recrutement: {new Date(groupage.date_fin_groupage).toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="mt-4">
            <p className="font-bold">Statut: {getStatutText(groupage.statut)}</p>
            <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2 mt-1">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${statutProgress}%` }}></div>
            </div>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-6 hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Ajout en cours..." : "Rejoindre le groupage"}
          </button>
        </div>
      </div>

      {/* POPUP */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-6 max-w-lg mx-4" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
              <h2 className="text-xl font-bold mb-4">Confirmation</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">En rejoignant ce groupage, vous confirmez votre participation. Un message WhatsApp sera envoyé.</p>
              <div className="flex gap-3">
                <button onClick={confirmerRejoindre} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">Confirmer</button>
                <button onClick={() => setShowModal(false)} className="w-full bg-gray-200 dark:bg-zinc-800 font-bold py-3 rounded-xl">Annuler</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}