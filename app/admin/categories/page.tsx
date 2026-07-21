"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCategories, createCategory, uploadCategoryImage, type Category } from "../../lib/categories";
import { Plus, Loader2, X } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); // 1. On stocke le File

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await getAllCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadCategoryImage(imageFile); // 2. On envoie le File
    }

    await createCategory({ name, description, image: imageUrl }); // 3. On envoie l'URL
    setShowModal(false);
    setName(""); setDescription(""); setImageFile(null);
    loadCategories();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion Catégories</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link href={`/category/${category.slug}`} key={category.id} className="group">
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg hover:shadow-2xl transition">
              {category.image && <img src={category.image} className="w-full h-32 object-cover rounded-lg mb-4" />}
              <h2 className="text-xl font-bold">{category.name}</h2>
              <p className="text-sm text-gray-500">{category.description}</p>
              <button className="mt-3 text-blue-600 font-semibold group-hover:underline">Découvrir →</button>
            </div>
          </Link>
        ))}
      </div>

      {showModal && (
        <form onSubmit={handleCreate} className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Nouvelle Catégorie</h2>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom" className="w-full border p-2 rounded mb-3" required />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full border p-2 rounded mb-3" />
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full mb-4" />
            <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">Créer</button>
          </div>
        </form>
      )}
    </div>
  );
}