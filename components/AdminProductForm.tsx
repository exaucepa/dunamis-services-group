"use client";
import { useState, useEffect } from "react";
import { createProduct, updateProduct, uploadProductImage, getCategories, type Category, type Product } from "../app/lib/products"; // <-- FIX IMPORTS

type Props = {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminProductForm({ product, onClose, onSuccess }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    short_description: '', // AJOUT
    long_description: '', // AJOUT
    price: '',
    category_id: '',
    stock: '',
    image: '',
    images: [] as string[] // AJOUT
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
        short_description: product.short_description || '', // AJOUT
        long_description: product.long_description || '', // AJOUT
        price: String(product.price),
        category_id: product.category_id,
        stock: String(product.stock),
        image: product.image,
        images: product.images || [] // AJOUT
      })
    } else {
      setForm({name: '', description: '', short_description: '', long_description: '', price: '', category_id: '', stock: '', image: '', images: []})
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image;
      if(imageFile) {
        imageUrl = await uploadProductImage(imageFile); // FIX NOM FONCTION
      }

      const productData = {
        name: form.name,
        description: form.description,
        short_description: form.short_description,
        long_description: form.long_description,
        price: Number(form.price),
        stock: Number(form.stock),
        image: imageUrl,
        images: form.images, // AJOUT
        category_id: form.category_id
      };

      if(isEditMode && product) {
        await updateProduct(product.id, productData);
        alert("Produit modifié!");
      } else {
        await createProduct(productData); // FIX NOM FONCTION
        alert("Produit ajouté!");
      }

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

          <input placeholder="Description courte" value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})} className="w-full border p-2 rounded"/>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded" />
          <textarea placeholder="Description longue" value={form.long_description} onChange={e => setForm({...form, long_description: e.target.value})} className="w-full border p-2 rounded" rows={4}/>

          <input type="number" placeholder="Prix" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border p-2 rounded" required/>
          <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="w-full border p-2 rounded" required>
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