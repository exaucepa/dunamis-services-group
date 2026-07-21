"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Users, Calendar, Euro } from "lucide-react";
import Link from "next/link";

type Groupage = {
  id: string;
  title: string;
  target_quantity: number;
  current_quantity: number;
  group_price: number;
  date_fin_groupage: string;
};

export default function GroupagesPage() {
  const [groupages, setGroupages] = useState<Groupage[]>([]);

  useEffect(() => {
    const fetchGroupages = async () => {
      const { data } = await supabase
        .from("groupages")
        .select("*")
        .eq("status", "actif")
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
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Rejoignez un groupage et profitez de prix réduits</p>

      {groupages.length === 0 && (
        <p className="text-center text-gray-500">Aucun groupage actif pour le moment.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupages.map((g) => (
          <div key={g.id} className="p-6 border rounded-2xl shadow-lg bg-white dark:bg-zinc-900 flex-col">
            <h3 className="text-2xl font-bold mb-2">{g.title}</h3>
            
            <div className="space-y-3 my-4 flex-1">
              <div className="flex items-center gap-2 text-sm">
                <Users size={16}/> <span>{g.current_quantity} / {g.target_quantity} participants</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16}/> <span>Fin le {new Date(g.date_fin_groupage).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                <Euro size={16}/> <span>{g.group_price}€ / personne</span>
              </div>
            </div>

            {/* BARRE DE PROGRESSION */}
            <div className="space-y-2 mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-zinc-700">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${getProgress(g.current_quantity, g.target_quantity)}%` }}
                ></div>
              </div>
              <p className="text-right text-sm font-bold">{getProgress(g.current_quantity, g.target_quantity).toFixed(0)}% atteint</p>
            </div>

            <Link href={`/groupage/${g.id}`} className="w-full bg-blue-700 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-800 transition">
              Participer
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}