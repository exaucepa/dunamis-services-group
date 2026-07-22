"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "../../lib/products";

type Groupage = {
  id: number;
  product_id: string;
  objectif_participants: number;
  participants: number;
  prix_groupe: number;
  date_fin_groupage: string;
  products: {
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
  }
};

export default function GroupagePage({ params }: { params: { id: string } }) {
  const [groupage, setGroupage] = useState<Groupage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [methode, setMethode] = useState("MIXX BY YAS"); // Par défaut

  useEffect(() => {
    const fetchGroupage = async () => {
      const { data, error } = await supabase
       .from("groupages")
       .select(", products()") // <-- CORRIGÉ ICI. Tu avais ", products()" 
       .eq("id", params.id)
       .single();
      if (!error) setGroupage(data as unknown as Groupage);
      else console.error(error)
    };
    fetchGroupage();
  }, [params.id]);

  if (!groupage) return <div className="container mx-auto p-12 text-center">Chargement...</div>;

  const progress = (groupage.participants / groupage.objectif_participants) * 100;

  const confirmerRejoindre = async () => {
    if (!nom || !telephone) return alert("Remplis ton nom et numéro");
    setLoading(true);
    
    // 1. Enregistrer la participation
    const { data: participation, error } = await supabase.from("participations").insert({
      groupage_id: groupage.id,
      client_nom: nom,
      client_telephone: telephone,
      methode_paiement: methode, // MIXX BY YAS ou FLOOZ
      montant_paye: groupage.prix_groupe,
      statut: 'en_attente'
    }).select().single();

    if(!error && participation){
      // 2. Incrémenter
      await supabase.from("groupages").update({ participants: groupage.participants + 1 }).eq("id", groupage.id);
      
      // 3. Mettre à jour le compteur du panier dans le Header
      window.dispatchEvent(new Event("cartUpdated")); // <-- AJOUTÉ ICI POUR BUG 1

      // 4. WhatsApp avec ID du reçu
      const message = `Salut DUNAMIS! Je confirme pour: ${groupage.products.name}. Montant: ${formatPrice(groupage.prix_groupe)} FCFA. Paiement: ${methode}. ID Reçu: ${participation.id}`;
      window.open(`https://wa.me/22890667868?text=${encodeURIComponent(message)}`, '_blank');
      setShowModal(false);
    } else {
      alert("Erreur: " + error?.message)
    }
    setLoading(false);
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <Link href="/groupages" className="text-sm text-purple-500 hover:underline">← Retour aux groupages</Link>
      
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {/* COLONNE 1: PHOTOS + DESCRIPTION */}
        <div>
          <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-4">
            <Image src={groupage.products.image} alt={groupage.products.name} fill className="object-cover" unoptimized/>
          </div>
          <h2 className="text-2xl font-bold">Description</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{groupage.products.description}</p>
        </div>

        {/* COLONNE 2: BLOC GROUPAGE */}
        <div className="sticky top-4 h-fit p-6 border dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900">
          <h1 className="text-3xl font-bold">{groupage.products.name}</h1>
          <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-xl mt-4">
            <p className="text-3xl font-bold text-purple-600">{formatPrice(groupage.prix_groupe)} FCFA</p>
            <p className="text-sm line-through text-gray-400">Prix normal: {formatPrice(groupage.products.price)} FCFA</p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1 font-bold">
              <span>{groupage.participants} / {groupage.objectif_participants} personnes</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-3">
              <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl mt-6 hover:bg-purple-700 transition disabled:opacity-50"
          >
            Rejoindre le groupage
          </button>
        </div>
      </div>

      {/* POPUP AVEC FORMULAIRE + LOGOS */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-6 max-w-lg w-full" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
              <h2 className="text-xl font-bold mb-4">Confirmer votre participation</h2>
              
              <div className="space-y-4 mb-6">
                <input type="text" placeholder="Votre Nom Complet" value={nom} onChange={e => setNom(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-zinc-800"/>
                <input type="tel" placeholder="Numéro WhatsApp 228..." value={telephone} onChange={e => setTelephone(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-zinc-800"/>
              </div>

              <p className="font-bold mb-2">Choisissez votre mode de paiement:</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { nom: "MIXX BY YAS", logo: "/logos/mixx-by-yas.png" },
                  { nom: "FLOOZ", logo: "/logos/moov-money.png" }, // Logo orange = FLOOZ
                ].map(m => (
                  <button 
                    key={m.nom} 
                    onClick={() => setMethode(m.nom)} 
                    className={`p-3 border-2 rounded-xl flex-col items-center justify-center gap-2 transition ${ // <-- CORRIGÉ: flex-col
                      methode === m.nom 
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30' 
                        : 'border-gray-200 dark:border-zinc-700 hover:border-purple-400'
                    }`}
                  >
                    <img src={m.logo} alt={m.nom} className="h-8 object-contain bg-white rounded p-1" /> 
                    <span className="text-xs font-bold">{m.nom}</span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-500 mb-4">Après confirmation, vous serez redirigé vers WhatsApp. Envoyez la capture de paiement pour validation.</p>
              
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="w-full bg-gray-200 dark:bg-zinc-800 py-3 rounded-xl font-bold">Annuler</button>
                <button onClick={confirmerRejoindre} disabled={loading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">
                  {loading ? "Envoi..." : "Confirmer & WhatsApp"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}