"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-xl font-bold text-white">
            D
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-slate-900">
              DUNAMIS
            </h1>

            <p className="text-xs text-gray-500">
              SERVICES GROUP
            </p>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="font-medium text-gray-700 transition hover:text-blue-700"
          >
            Accueil
          </Link>

          <Link
            href="/catalogue"
            className="font-medium text-gray-700 transition hover:text-blue-700"
          >
            Catalogue
          </Link>

          <Link
            href="/categories"
            className="font-medium text-gray-700 transition hover:text-blue-700"
          >
            Catégories
          </Link>

          <Link
            href="/about"
            className="font-medium text-gray-700 transition hover:text-blue-700"
          >
            À propos
          </Link>

          <Link
            href="/contact"
            className="font-medium text-gray-700 transition hover:text-blue-700"
          >
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <button className="rounded-xl p-3 transition hover:bg-gray-100">
            <Search size={22} />
          </button>

          <button className="relative rounded-xl p-3 transition hover:bg-gray-100">
            <ShoppingCart size={22} />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              0
            </span>
          </button>

          <button className="hidden rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 md:block">
            Commander
          </button>

          <button className="rounded-xl p-3 transition hover:bg-gray-100 md:hidden">
            <Menu size={24} />
          </button>

        </div>

      </div>
    </header>
  );
}