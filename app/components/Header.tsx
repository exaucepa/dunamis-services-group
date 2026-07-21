"use client";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import CartCounter from "./CartCounter";

function SearchBar() {
  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search products..."
        className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-sky-500 dark:focus:ring-sky-900/50"
      />
    </div>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur border-b border-gray-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-bold text-xl md:text-2xl whitespace-nowrap">
            DUNAMIS
          </Link>
          <div className="flex-1 hidden md:block max-w-2xl">
            <SearchBar />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
              <ShoppingCart size={22} />
              <CartCounter />
            </Link>
            <Link href="/account" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
              <User size={22} />
            </Link>
          </div>
        </div>
        <div className="md:hidden mt-3">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}