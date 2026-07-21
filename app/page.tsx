import Link from "next/link";
import HeroSlider from "../components/HeroSlider";
import FeaturedProducts from "../components/FeaturedProducts";
import Categories from "../components/Categories";
import Benefits from "../components/Benefits";
import Timer from "../components/Timer";
import { getGroupagesEnCours, formatPrice } from "./lib/products";

async function GroupageCard({ groupage }: { groupage: any }) {
  const product = groupage.product;
  if (!product) return null;
  
  const progress = (groupage.participants / groupage.objectif_participants) * 100;
  const prix = groupage.prix_groupe || product.promo_price || product.price;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-5 border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
      <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm line-through text-gray-400">{formatPrice(product.price)} FCFA</p>
        <p className="text-2xl font-bold text-green-600">{formatPrice(prix)} FCFA</p>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>{groupage.participants}/{groupage.objectif_participants} participants</span>
          <Timer date={groupage.date_fin_groupage} />
        </div>
        <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <Link href={`/groupages/${groupage.id}`} className="w-full block text-center bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition">
        Rejoindre le groupe
      </Link>
    </div>
  );
}

async function GroupageSection() {
  const groupages = await getGroupagesEnCours();
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
      <FeaturedProducts /> {/* Ce composant doit utiliser getFeaturedProducts() */}
      <GroupageSection /> {/* Server Component qui fetch les groupages */}
      <Categories />
      <Benefits />
    </main>
  );
}