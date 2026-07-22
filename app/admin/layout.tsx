"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, Tag, PlusCircle, ShoppingCart } from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/promo", label: "Promos", icon: Tag },
  { href: "/admin/groupages", label: "Groupages", icon: Users },
  { href: "/admin/groupages/new", label: "Nouveau Groupage", icon: PlusCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-zinc-900 shadow-lg p-5 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-8 text-purple-600">Admin TS6</h2>
        <nav className="flex flex-col gap-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${
                pathname === href 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* CONTENU */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}