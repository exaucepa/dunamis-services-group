"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { getAllProducts, formatPrice } from "../../lib/products";
import { type Products } from "../../lib/products";
import { Plus, Pencil, Trash2, Upload, X, Save } from "lucide-react";

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Products | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image: "", // image principale
    images: [] as string[] // galerie
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [prods, { data: cats }] = await Promise.all([
      getAllProducts(),
      supabase.from("categories").select("*")
    ]);
    setProducts(prods);
    setCategories(cats || []);
    setLoading(false);
  }

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", stock: "", category_id: "", image: "", images: [] });
    setEditingProduct(null);
  }

  const handleEdit = (p: Products) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      stock: String(p.stock),
      category_id: String(p.category_id || ""),
      image: p.image,
      images: (p as any).images || []
    });
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("products").upload(fileName, file);
    if (error) return alert(error.message);
    const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(fileName);
    return publicUrl;
  }

  const addImageToGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = await handleUpload(e);
    if (url) setForm(prev => ({...prev, images: [...prev.images, url]}));
  }

  const handleSave = async () => {
    if (!form.name ||!form.price) return alert("Nom et Prix obligatoires");

    const productData = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: Number(form.category_id) || null,
      image: form.image,
      images: form.images
    };

    let error;
    if (editingProduct) {
      ({ error } = await supabase.from("products").update(productData).eq("id", editingProduct.id));
    } else {
      ({ error } = await supabase.from("products").insert([productData]));
    }

    if (error) alert(error.message);
    else {
      alert("Produit enregistré ✅");
      resetForm();
      fetchData();
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchData();
  }

  if (loading) return <p className="p-8">Chargement...</p>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Produits</h1>

      {/* FORMULAIRE */}
      <div className="p-6 border rounded-2xl mb-8 bg-white dark:bg-zinc-900">
        <h2 className="font-bold text-xl mb-4">{editingProduct? "Modifier" : "Créer"} un Produit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Nom du produit" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
          <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800">
            <option value="">Choisir Catégorie</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" placeholder="Prix FCFA" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
          <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
        </div>
        <textarea placeholder="Description complète" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full mt-4 p-3 border rounded-lg dark:bg-zinc-800 h-24"/>

        {/* UPLOAD IMAGE PRINCIPALE */}
        <div className="mt-4">
          <p className="font-bold mb-2">Image Principale</p>
          <input type="file" onChange={async e => setForm({...form, image: await handleUpload(e) || ''})} className="w-full"/>
          {form.image && <img src={form.image} className="w-32 h-32 object-cover rounded mt-2"/>}
        </div>

        {/* GALERIE IMAGES */}
        <div className="mt-4">
          <p className="font-bold mb-2">Galerie d'images</p>
          <input type="file" ref={fileInputRef} onChange={addImageToGallery} className="hidden"/>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 p-2 border rounded-lg"><Upload size={16}/> Ajouter une image</button>
          <div className="flex gap-2 mt-2 flex-wrap">
            {form.images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="w-20 h-20 object-cover rounded"/>
                <button onClick={() => setForm({...form, images: form.images.filter((_, idx) => idx!== i)})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={handleSave} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Save/> Enregistrer</button>
          {editingProduct && <button onClick={resetForm} className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold">Annuler</button>}
        </div>
      </div>

      {/* LISTE DES PRODUITS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow">
            <img src={p.image} className="w-full h-40 object-cover rounded mb-3"/>
            <h3 className="font-bold">{p.name}</h3>
            <p>{formatPrice(p.price)} FCFA</p>
            <p className="text-sm text-gray-500">Stock: {p.stock}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(p)} className="flex-1 bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"><Pencil size={16}/> Modifier</button>
              <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white p-2 rounded"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}