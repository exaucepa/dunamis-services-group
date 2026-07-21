"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getCategories, type Category } from "../lib/categories"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => { getCategories().then(setCategories) }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Toutes nos Catégories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link href={`/category/${category.slug}`} key={category.id}>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow hover:shadow-xl transition">
              <h2 className="text-2xl font-bold">{category.name}</h2>
              <p className="text-gray-500 mt-2">{category.description}</p>
              <p className="mt-4 text-blue-600 font-semibold">Voir les produits →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}