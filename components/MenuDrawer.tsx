"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Package, Users, Shield } from "lucide-react";
import Link from "next/link";

export default function MenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const links = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Catalogue", href: "/catalogue", icon: Package },
    { name: "Groupages", href: "/groupages", icon: Users },
    { name: "Admin", href: "/admin", icon: Shield, color: "text-red-600" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-zinc-950 shadow-2xl z-[60] p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={onClose}><X size={24}/></button>
          </div>
          <nav className="flex flex-col gap-6">
            {links.map((link) => (
              <Link key={link.name} href={link.href} onClick={onClose} className={`flex items-center gap-3 text-lg font-medium hover:text-blue-700 ${link.color || ''}`}>
                <link.icon size={20}/> {link.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}