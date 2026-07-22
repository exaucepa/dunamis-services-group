"use client"; // <- OBLIGATOIRE pour useState et useEffect
import { useState, useEffect } from "react";
import Link from "next/link";
import HeroSlider from "../components/HeroSlider";
import FeaturedProducts from "../components/FeaturedProducts";
import Categories from "../components/Categories";
import Benefits from "../components/Benefits";
import { formatPrice, getGroupagesEnCours } from "./lib/products"; // <- chemin corrigé
import { Users, Clock } from "lucide-react"; // <- doublon supprimé
import Timer from "../components/Timer";

function GroupageCard({ groupage }: { groupage: any }) {
  const product = groupage.products; 
  if (!product || product.id === 'deleted') return null; 
  
  const progress = (groupage.participants / groupage.objectif_participants) * 100;
  const timeLeft = <Timer date={groupage.date_fin_groupage} /> // <- Compte à rebours live

  return (
    <Link href={`/products/${groupage.product_id}`} className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-lg hover:shadow-xl transition border-2 border-blue-500">
      <img src={product.image} alt={product.name} className="w-full h-40 object-contain rounded-lg mb-3 bg-gray-50 dark:bg-zinc-900"/>
      <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
      <p className="text-2xl font-bold text-blue-600 mb-1">{formatPrice(groupage.prix_groupe)} FCFA</p>
      <p className="text-sm line-through text-gray-500 mb-2">{formatPrice(product.price)} FCFA</p>
      <div className="flex items-center justify-between text-sm mb-2">
        <div className="flex items-center gap-1"><Users size={14}/> {groupage.participants}/{groupage.objectif_participants}</div>
        <div className="flex items-center gap-1 text-red-600"><Clock size={14}/> {timeLeft}</div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 mb-3">
        <div className="bg-blue-600 h-2 rounded-full" style={{width: `${progress}%`}}></div>
      </div>
      <div className="w-full text-center bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">
        Rejoindre le groupage
      </div>
    </Link>
  )
}

export default function Home() {
  const [groupages, setGroupages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroupagesEnCours().then(data => {
      setGroupages(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <HeroSlider />

      {/* SECTION GROUPAGES EN COURS - 1ERE POSITION */}
      {!loading && groupages.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="text-blue-600"/> Groupages en cours 🔥
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groupages.map(g => <GroupageCard key={g.id} groupage={g} />)}
          </div>
        </section>
      )}

      <FeaturedProducts />
      <Categories />
      <Benefits />
    </main>
  );
}