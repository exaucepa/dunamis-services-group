"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, Image, Package, Tag, Users, ShoppingBag, LogOut } from "lucide-react";
import Link from "next/link";

const adminCards = [
  { title: "Paramètres du Site", icon: Settings, color: "bg-blue-100", href: "/admin/parametres" },
  { title: "Gérer Slides", icon: Image, color: "bg-pink-100", href: "/admin/slides" }, // <-- Corrigé pour slides
  { title: "Gérer Produits", icon: Package, color: "bg-green-100", href: "/admin/produits" },
  { title: "Gérer Promos", icon: Tag, color: "bg-yellow-100", href: "/admin/promos" },
  { title: "Gérer Groupages", icon: Users, color: "bg-purple-100", href: "/admin/groupages" },
  { title: "Gérer Commandes", icon: ShoppingBag, color: "bg-orange-100", href: "/admin/commandes" },
];

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    if(localStorage.getItem("isAdmin")!== "true") router.push("/admin");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold">Tableau de Bord</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-gray-200 dark:bg-zinc-800 px-4 py-2 rounded-lg font-bold hover:bg-gray-300">
          <LogOut size={18}/> Déconnexion
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {adminCards.map(card => (
          <Link
            key={card.title}
            href={card.href}
            className={`p-6 ${card.color} dark:bg-zinc-800 rounded-2xl shadow hover:shadow-lg transition cursor-pointer hover:-translate-y-1`   }
          >
            <card.icon size={32} className="mb-4"/>
            <h2 className="text-xl font-bold">{card.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Cliquer pour gérer</p>
          </Link>
        ))}
      </div>
    </div>
  )
}