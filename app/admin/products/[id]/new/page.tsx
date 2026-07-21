"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllCategories, type Category } from "../../../../lib/categories";
import { Save, ArrowLeft, Loader2, X, Upload } from "lucide-react";

// Fonction upload qu'on ajoute direct ici
async function uploadProductImages(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!data.url) throw new Error("Upload échoué");
  return data.url;
}

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  useEffect(() => { getAllCategories().then(setCategories) }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image;
      if(imageFile) {
        imageUrl = await uploadProductImages(imageFile);
      }

      const productData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        image: imageUrl,
        categoryAll: Number(form.category)
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if(!res.ok) throw new Error("Erreur création produit");

      alert("Produit ajouté!");
      router.push('/admin/products');
    } catch(err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 mb-4">
        <ArrowLeft size={20}/> Retour
      </button>
      <h1 className="text-2xl font-bold mb-6">Nouveau Produit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Nom" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border p-2 rounded" required/>
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded" rows={3}/>
        <input type="number" placeholder="Prix" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border p-2 rounded" required/>
        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border p-2 rounded" required>
          <option value="">Choisir catégorie</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full border p-2 rounded" required/>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
        
        <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50">
          {loading? <Loader2 className="animate-spin"/> : <Save/>}
          {loading? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  )
}