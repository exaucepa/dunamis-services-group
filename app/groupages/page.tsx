"use client";
import { useState, useEffect } from "react";
import { supabase } from "..//lib/supabase";
import { getGroupagesEnCours, formatPrice } from ".././lib/products"; // <- UTILISE LA FONCTION
import { Plus, Trash2, Save, Users, Clock } from "lucide-react";

export default function ManageGroupages() {
  const [groupages, setGroupages] = useState<any[]>([]);

  useEffect(() => { fetchGroupages(); }, []);

  const fetchGroupages = async () => {
    const data = await getGroupagesEnCours(); // <- UTILISE LA FONCTION QUI MARCHE
    setGroupages(data || []);
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Supprimer ce groupage?")) return;
    await supabase.from("groupages").delete().eq("id", id);
    fetchGroupages();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><Users/> Gérer Groupages</h1>

      <div className="space-y-4">
        {groupages.map((g) => {
          const progress = (g.participants / g.objectif_participants) * 100; // <- NOMS CORRIGÉS
          return (
            <div key={g.id} className="p-4 border rounded-2xl bg-white dark:bg-zinc-900">
              <div className="flex gap-4 items-center mb-3">
                <img src={g.products?.image} className="w-20 h-20 rounded-lg object-cover"/>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{g.products?.name}</h3>
                  <p className="text-sm">Participants: {g.participants}/{g.objectif_participants} | Prix Groupe: <span className="font-bold text-green-600">{formatPrice(g.prix_groupe)} FCFA</span></p> {/* <- NOMS CORRIGÉS */}
                  <p className="text-sm flex items-center gap-1"><Clock size={14}/> Fin: {new Date(g.date_fin_groupage).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDelete(g.id)} className="p-2 bg-red-600 text-white rounded-lg"><Trash2 size={18}/></button>
              </div>
              <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}