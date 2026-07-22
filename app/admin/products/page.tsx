"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Trash2, Save, Upload, Pencil, Tag, TrendingUp, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ManageProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [tab, setTab] = useState<'products' | 'categories' | 'stats'>('products');
  const [form, setForm] = useState<any>({ stock: 0, featured: false });
  const [catForm, setCatForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = () => { fetchProducts(); fetchCategories(); fetchStats(); }

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });
    setProducts(data || []);
  };
  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
  };
  const fetchStats = async () => {
    const { data } = await supabase.rpc('get_top_products');
    setStats(data || []);
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'category') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${type}-${Date.now()}-${file.name}`;
    await supabase.storage.from("products").upload(fileName, file);
    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    const publicUrl = data?.publicUrl;
    if (type === 'product') setForm({...form, image: publicUrl });
    else setCatForm({...catForm, image: publicUrl });
    setUploading(false);
  };

  const handleSaveProduct = async () => {
    if (!form.name ||!form.price) return alert("Nom et Prix obligatoires");
    const payload = {...form, description: form.long_description } // pour matcher lib
    if (form.id) { await supabase.from("products").update(payload).eq("id", form.id); }
    else { await supabase.from("products").insert(payload); }
    setForm({ stock: 0, featured: false }); fetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    if(confirm("Supprimer ce produit?")) {
      await supabase.from("products").delete().eq("id", id); fetchProducts();
    }
  }

  const handleSaveCategory = async () => {
    if (!catForm.name) return alert("Nom catégorie obligatoire");
    if (catForm.id) { await supabase.from("categories").update(catForm).eq("id", catForm.id); }
    else { await supabase.from("categories").insert(catForm); }
    setCatForm({}); fetchCategories();
  };

  const handleDeleteCategory = async (id: number) => {
    if(confirm("Supprimer cette catégorie?")) {
      await supabase.from("categories").delete().eq("id", id); fetchCategories();
    }
  }

  return (
    <><div className="max-w-7xl mx-auto px-4 py-12">
      <Link href="/admin" className="flex items-center gap-2 text-blue-600 mb-6 hover:underline">
        <ArrowLeft size={18} /> Retour Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-8">Gérer Produits & Catégories</h1>

      <div className="flex gap-2 border-b mb-6">
        <button onClick={() => setTab('products')} className={`px-4 py-2 font-bold ${tab === 'products' ? 'border-b-2 border-blue-700' : ''}`}>Produits</button>
        <button onClick={() => setTab('categories')} className={`px-4 py-2 font-bold ${tab === 'categories' ? 'border-b-2 border-blue-700' : ''}`}><Tag size={16} className="inline" /> Catégories</button>
        <button onClick={() => setTab('stats')} className={`px-4 py-2 font-bold ${tab === 'stats' ? 'border-b-2 border-blue-700' : ''}`}><TrendingUp size={16} className="inline"/> Stats</button>
      </div>

      {tab === 'products' && (
        <div className="space-y-6">
          <div className="p-6 border rounded-2xl bg-white dark:bg-zinc-900 grid md:grid-cols-3 gap-4">
            <h2 className="text-xl font-bold md:col-span-3">{form.id? "Modifier" : "Ajouter"} Produit</h2>
            <input placeholder="Nom" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
            <input type="number" placeholder="Prix FCFA" value={form.price || ''} onChange={e => setForm({...form, price: +e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
            <input type="number" placeholder="Prix Promo" value={form.promo_price || ''} onChange={e => setForm({...form, promo_price: +e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
            <input placeholder="Short Description" value={form.short_description || ''} onChange={e => setForm({...form, short_description: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800 md:col-span-3"/>
            <textarea placeholder="Description" value={form.long_description || ''} onChange={e => setForm({...form, long_description: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800 md:col-span-3"/>

            <select value={form.category_id != null ? String(form.category_id) : ''} onChange={e => setForm({...form, category_id: e.target.value ? Number(e.target.value) : null})} className="p-3 border rounded-lg dark:bg-zinc-800">
              <option value="">Choisir Catégorie</option>
              {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
            </select>
            <input type="number" placeholder="Stock" value={form.stock || 0} onChange={e => setForm({...form, stock: +e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})}/> Produit Phare</label>
            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer"><Upload size={18}/> {uploading? "Upload..." : "Image"}<input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'product')} className="hidden"/></label>
            {form.image && <img src={form.image} className="h-20 rounded-lg object-cover"/>}
            <button onClick={handleSaveProduct} className="md:col-span-3 flex items-center justify-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"><Save/> Enregistrer</button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="p-4 border rounded-2xl bg-white dark:bg-zinc-900">
                <img src={p.image} className="w-full h-40 rounded-lg object-cover mb-3"/>
                <h3 className="font-bold">{p.name} {p.featured && <Star size={14} className="inline text-yellow-500"/>}</h3>
                <p className="text-sm text-gray-500">{p.categories?.name || "Non classé"} | Stock: {p.stock}</p>
                <p className="font-extrabold text-blue-700">{p.price?.toLocaleString()} FCFA</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setForm({...p, long_description: p.description})} className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 rounded-lg font-bold"><Pencil size={16} className="inline"/> Modifier</button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold"><Trash2 size={16} className="inline"/> Suppr</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'categories' && (
        <div className="space-y-6">
          <div className="p-6 border rounded-2xl bg-white dark:bg-zinc-900 grid md:grid-cols-2 gap-4">
            <h2 className="text-xl font-bold md:col-span-2">{catForm.id? "Modifier" : "Ajouter"} Catégorie</h2>
            <input placeholder="Nom Catégorie" value={catForm.name || ''} onChange={e => setCatForm({...catForm, name: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
            <input placeholder="Slug ex: electronique" value={catForm.slug || ''} onChange={e => setCatForm({...catForm, slug: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
            <textarea placeholder="Description" value={catForm.description || ''} onChange={e => setCatForm({...catForm, description: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800 md:col-span-2"/>
            <input placeholder="Theme ex: blue, green" value={catForm.theme || ''} onChange={e => setCatForm({...catForm, theme: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer"><Upload size={18}/> {uploading? "Upload..." : "Image"}<input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'category')} className="hidden"/></label>
            {catForm.image && <img src={catForm.image} className="h-20 rounded-lg object-cover"/>}
            <button onClick={handleSaveCategory} className="md:col-span-2 flex items-center justify-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"><Save/> Enregistrer Catégorie</button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-4 border rounded-2xl bg-white dark:bg-zinc-900">
                <img src={c.image} className="w-full h-24 rounded-lg object-cover mb-2"/>
                <h3 className="font-bold">{c.name}</h3>
                <p className="text-sm text-gray-500">{c.description}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setCatForm(c)} className="px-3 py-1 bg-gray-200 dark:bg-zinc-800 rounded-lg"><Pencil size={14}/></button>
                  <button onClick={() => handleDeleteCategory(c.id)} className="px-3 py-1 bg-red-500 text-white rounded-lg"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'stats' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Top 10 Produits Phares - + ajoutés au panier</h2>
          {stats.length === 0 && <p>Aucune donnée. Ajoute des produits au panier pour voir les stats.</p>}
          {stats.map((s, i) => <div key={s.product_id} className="p-4 border rounded-xl flex justify-between bg-white dark:bg-zinc-900"><span>{i+1}. {s.name}</span><span className="font-bold">{s.total_adds} ajouts</span></div>)}
        </div>
      )}
    </div></>
  )
}