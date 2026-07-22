"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Users, Calendar } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "../lib/products"; // On utilise ta fonction

type Groupage = {
  id: number;
  product_id: string;
  objectif_participants: number;
  participants: number;
  prix_groupe: number;
  date_fin_groupage: string;
  products: { // <- jointure
    id: string;
    name: string;
    image: string;
    price: number;
  }
};

export default function GroupagesPage() {
  const [groupages, setGroupages] = useState<Groupage[]>([]);

  useEffect(() => {
    const fetchGroupages = async () => {
      const { data } = await supabase
       .from("groupages")
       .select("*, products(id, name, image, price)") // <- Jointure produit
       .eq("status", "en_cours") // <- C'est en_cours pas actif
       .order("date_fin_groupage", { ascending: true });
      setGroupages(data || []);
    };
    fetchGroupages();
  }, []);

  const getProgress = (current: number, target: number) => {
    if(!target) return 0;
    return Math.min(100, (current / target) * 100);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-center mb-4">Nos Groupages en cours</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Rejoignez un groupage et profitez de prix réduits jusqu'à -40%</p>

      {groupages.length === 0 && (
        <p className="text-center text-gray-500">Aucun groupage actif pour le moment.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupages.map((g) => (
          <div key={g.id} className="p-6 border dark:border-zinc-800 rounded-2xl shadow-lg bg-white dark:bg-zinc-900 flex-col">
            
            <img src={g.products.image} className="w-full h-40 rounded-lg object-cover mb-4"/>
            <h3 className="text-xl font-bold mb-2">{g.products.name}</h3>
            
            <div className="space-y-3 my-4 flex-1">
              <div className="flex items-center gap-2 text-sm">
                <Users size={16}/> <span>{g.participants} / {g.objectif_participants} participants</span> {/* <- CORRIGÉ */}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16}/> <span>Fin le {new Date(g.date_fin_groupage).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-bold text-purple-600"> {/* <- Couleur DUNAMIS */}
                <span>{formatPrice(g.prix_groupe)} FCFA</span> {/* <- FCFA */}
                <span className="text-sm line-through text-gray-400">{formatPrice(g.products.price)} FCFA</span>
              </div>
            </div>

            {/* BARRE DE PROGRESSION */}
            <div className="space-y-2 mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-zinc-700">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-500" // <- violet
                  style={{ width: `${getProgress(g.participants, g.objectif_participants)}%` }} // <- CORRIGÉ
                ></div>
              </div>
              <p className="text-right text-sm font-bold">{getProgress(g.participants, g.objectif_participants).toFixed(0)}% atteint</p>
            </div>

            <Link href={`/groupage/${g.id}`} className="w-full bg-purple-700 text-white text-center py-3 rounded-xl font-bold hover:bg-purple-800 transition">
              Participer
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}