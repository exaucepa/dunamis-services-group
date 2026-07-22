"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // <- AJOUTÉ POUR EVITER LE BUG
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const logged = localStorage.getItem("isAdminLoggedIn") === "true";
    
    if (logged) {
      setIsLoggedIn(true);
    } else if (pathname !== "/admin/login") {
      router.push("/admin/login");
    }
    setLoading(false); // <- On finit de charger
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push("/admin/login");
  };

  // Si on est sur la page login, on affiche pas le menu
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return <p className="p-6 text-center">Chargement...</p>; // <- Plus propre
  }

  // Si pas connecté, on affiche rien
  if (!isLoggedIn) {
    return null; 
  }

  // Si connecté : on affiche le menu + le contenu
  return (
    <div className="flex min-h-screen">
      {/* MENU DE GAUCHE */}
      <aside className="w-64 bg-gray-900 text-white p-4 flex-col">
        <h2 className="text-xl font-bold mb-6">Admin TS6</h2>
        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/admin" className="p-2 rounded hover:bg-gray-700">Dashboard</Link>
          <Link href="/admin/products" className="p-2 rounded hover:bg-gray-700">Produits</Link>
          <Link href="/admin/orders" className="p-2 rounded hover:bg-gray-700">Commandes</Link>
          <Link href="/admin/promo" className="p-2 rounded hover:bg-gray-700">Promos</Link>
          <Link href="/admin/groupages" className="p-2 rounded hover:bg-gray-700">Groupages</Link>
          <Link href="/admin/groupages/new" className="p-2 rounded hover:bg-gray-700">Nouveau Groupage</Link>
          <Link href="/admin/ads" className="p-2 rounded hover:bg-gray-700">Bannières</Link>
        </nav>

        {/* BOUTON DECONNEXION AJOUTÉ ICI */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-600 text-white p-2 rounded font-bold hover:bg-red-700 mt-4"
        >
          Déconnexion
        </button>
      </aside>

      {/* CONTENU */}
      <main className="flex-1 p-6 bg-gray-100 dark:bg-zinc-950">
        {children}
      </main>
    </div>
  );
}