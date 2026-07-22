import Link from "next/link";
import HeroSlider from "../components/HeroSlider";
import FeaturedProducts from "../components/FeaturedProducts";
import Categories from "../components/Categories";
import Benefits from "../components/Benefits";
import { getActiveGroupages, formatPrice } from "./lib/products";
import { Users, Clock } from "lucide-react";

async function GroupageCard({ groupage }: { groupage: any }) {
  const product = groupage.products; // <- CORRIGÉ ICI: products avec S
  if (!product || product.id === 'deleted') return null; // <- Sécurité
  
  const progress = (groupage.participants / groupage.objectif_participants) * 100;
  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-3"/> {/* <- AJOUT IMAGE */}
      <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
      <p className="text-2xl font-bold text-purple-600 mb-3">{formatPrice(groupage.prix_groupe)} FCFA</p>
      <p className="text-sm line-through text-gray-500 mb-2">{formatPrice(product.price)} FCFA</p> {/* <- Prix barré */}
      <div className="flex items-center gap-2 text-sm mb-2">
        <Users size={16}/> {groupage.participants}/{groupage.objectif_participants} participants
      </div>
      <div className="flex items-center gap-2 text-sm mb-4">
        <Clock size={16}/> Fin le {new Date(groupage.date_fin_groupage).toLocaleDateString("fr-FR")}
      </div>
      <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 mb-4">
        <div className="bg-purple-600 h-2 rounded-full" style={{width: `${progress}%`}}></div>
      </div>
      <Link href={`/product/${groupage.product_id}`} className="w-full block text-center bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700">
        Rejoindre
      </Link>
    </div>
  )
}

async function GroupageSection() {
  const groupages = await getActiveGroupages();
  if (!groupages || groupages.length === 0) return null;
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold">👥 Groupages en cours</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Plus on est nombreux, moins c'est cher</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groupages.map((g: any) => <GroupageCard key={g.id} groupage={g} />)}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <HeroSlider />
      <FeaturedProducts />
      <GroupageSection /> {/* <- LA SECTION S'AFFICHE MAINTENANT */}
      <Categories />
      <Benefits />
    </main>
  );
}