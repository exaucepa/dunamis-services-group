"use client";
import { useState, useEffect } from "react";
import { getCategories } from "../app/lib/products";

type Category = {
  id: number;
  name: string;
};

// On définit le type nous-même car ton products.ts n'a pas ces champs
type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: number;
  stock: number;
  image: string | null;
}

type Props = {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Fonction pour uploader l'image via ton API
async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  return data.url;
}

export default function AdminProductForm({ product, onClose, onSuccess }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '', // On utilise "category" comme dans ton DB
    stock: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditMode =!!product;

  useEffect(() => { getCategories().then(setCategories) }, []);

  useEffect(() => {
    if(product) {
      setForm({
        name: product.name,
        description: product.description || '',
        price: String(product.price),
        category: String(product.category),
        stock: String(product.stock),
        image: product.image || '',
      })
    } else {
      setForm({name: '', description: '', price: '', category: '', stock: '', image: ''})
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image;
      if(imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }

      const productData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        image: imageUrl,
        category: Number(form.category) // Important: number pas string
      };

      const url = isEditMode && product? `/api/products/${product.id}` : `/api/products`;
      const method = isEditMode && product? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if(!res.ok) throw new Error("Erreur serveur");

      alert(isEditMode? "Produit modifié!" : "Produit ajouté!");
      onSuccess();
      onClose();
    } catch(err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">{isEditMode? "Modifier" : "Ajouter"} un produit</h2>
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
          {form.image && <img src={form.image} alt="preview" className="w-20 h-20 object-cover rounded"/>}

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">Annuler</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-700 text-white py-2 rounded disabled:opacity-50">
              {loading? "Enregistrement..." : isEditMode? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}