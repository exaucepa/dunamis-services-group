"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCategories, createCategory, updateCategory, deleteCategory, uploadProductImage, type Category } from "../../lib/products";
import { Plus, Loader2, X, Trash, Edit, ArrowLeft, Tag } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  const resetForm = () => {
    setName(""); setDescription(""); setImageFile(null); setImageUrl(""); setEditing(null);
  }

  const handleSave = async () => {
  setSaving(true);
  let url = imageUrl;
  
  // 1. Upload seulement si y'a un nouveau fichier
  if (imageFile) {
    url = await uploadProductImage(imageFile);
  }

  // 2. On envoie UN SEUL objet avec tout dedans
  const data = { 
    name, 
    description, 
    image: url 
  };

  // 3. 2 arguments seulement : id et data
  if (editing) {
    await updateCategory(editing.id, data);
  } else {
    await createCategory(data);
  }

  setShowModal(false); 
  setSaving(false); 
  resetForm(); 
  loadCategories();
};
  const handleDelete = async (id: number) => {
    if(confirm("Supprimer cette catégorie?")) {
      await deleteCategory(id); loadCategories();
    }
  }

  return (
    <div className="p-6">
      <Link href="/admin" className="flex items-center gap-2 text-blue-600 mb-6"><ArrowLeft/> Retour</Link>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold flex gap-2"><Tag/> Gérer Catégories</h1>
        <button onClick={() => {resetForm(); setShowModal(true)}} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2"><Plus/> Ajouter</button>
      </div>

      {loading? <Loader2 className="animate-spin"/> : (
        <div className="grid md:grid-cols-3 gap-4">
          {categories.map(c => (
            <div key={c.id} className="border p-4 rounded-xl">
              <img src={c.image} className="h-24 w-full object-cover rounded"/>
              <h3 className="font-bold mt-2">{c.name}</h3>
              <p className="text-sm">{c.description}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => {setEditing(c); setName(c.name); setDescription(c.description||""); setImageUrl(c.image||""); setShowModal(true)}}><Edit/></button>
                <button onClick={() => handleDelete(c.id)} className="text-red-600"><Trash/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-96">
            <div className="flex justify-between"><h2 className="font-bold">{editing? "Modifier" : "Nouvelle"} Catégorie</h2><button onClick={() => setShowModal(false)}><X/></button></div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom" className="w-full border p-2 rounded mt-4"/>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full border p-2 rounded mt-2"/>
            <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} className="mt-2"/>
            <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white w-full py-2 rounded mt-4">{saving? "Enreg..." : "Enregistrer"}</button>
          </div>
        </div>
      )}
    </div>
  )
}