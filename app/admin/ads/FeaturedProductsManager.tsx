"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { getAllProducts } from "../../lib/products";

export default function FeaturedProductsManager() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    product_id: "", 
    promo_price: "", 
    discount_percent: "", 
    ends_at: "" // On utilise ends_at
  });

  useEffect(() => { 
    fetchFeatured();
    getAllProducts().then(setProducts);
  }, []);

  const fetchFeatured = async () => {
    const { data, error } = await supabase.from("featured_products")
      .select(`
        *,
        products ( id, name, price, image)
      `)
      .eq('is_active', true) // Maintenant on peut filtrer
      .gt('ends_at', new Date().toISOString()) // Que les promos pas finies
      .order("created_at", { ascending: false }); // Maintenant on peut trier
    
    if(error) {
      console.error("ERREUR FETCH:", error);
      alert("Erreur: " + error.message)
    }
    setFeatured(data || []);
  }

  const handleAdd = async () => {
    if(!form.product_id || !form.promo_price || !form.ends_at) 
      return alert("Remplis tous les champs");
    setLoading(true);
    try {
      const { error } = await supabase.from("featured_products").upsert([{
        product_id: form.product_id,
        promo_price: Number(form.promo_price),
        discount_percent: Number(form.discount_percent) || 0,
        ends_at: new Date(form.ends_at).toISOString(),
        is_active: true
      }], { 
        onConflict: 'product_id' 
      });

      if(error) throw error;
      setForm({ product_id: "", promo_price: "", discount_percent: "", ends_at: "" });
      fetchFeatured();
      alert("Promo ajoutée ou mise à jour !");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Retirer cette promo?")) return;
    // Au lieu de supprimer, on désactive
    await supabase.from("featured_products").update({ is_active: false }).eq("id", id);
    fetchFeatured();
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ajouter un Produit en Promo</h2>
      <div className="grid gap-3 mb-6 p-4 border rounded-lg bg-gray-50">
        <select value={form.product_id} onChange={e => setForm({...form, product_id: e.target.value})} className="border p-2 rounded">
          <option value="">-- Choisir un produit --</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name} - {p.price} FCFA</option>)}
        </select>
        <input type="number" placeholder="Prix Promo FCFA" value={form.promo_price} onChange={e => setForm({...form, promo_price: e.target.value})} className="border p-2 rounded" />
        <input type="number" placeholder="% de réduction ex: 20" value={form.discount_percent} onChange={e => setForm({...form, discount_percent: e.target.value})} className="border p-2 rounded" />
        <label className="text-sm">Fin de la promo:</label>
        <input type="datetime-local" value={form.ends_at} onChange={e => setForm({...form, ends_at: e.target.value})} className="border p-2 rounded" />
        <button onClick={handleAdd} disabled={loading} className="bg-red-500 text-white p-2 rounded font-bold disabled:opacity-50">
          {loading? "Ajout..." : "Mettre en Promo"}
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Promos Actives</h2>
      {featured.length === 0 && <p className="text-gray-500">Aucune promo active</p>}
      <div className="grid gap-2">
        {featured.map(f => (
          <div key={f.id} className="flex items-center gap-4 border p-3 rounded bg-white">
            <img src={f.products?.image} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <p className="font-bold">{f.products?.name}</p>
              <p className="text-sm">~{f.products?.price} FCFA~ <span className="text-red-500 font-bold">{f.promo_price} FCFA</span> -{f.discount_percent}%</p>
              <p className="text-xs text-gray-500">Fin: {new Date(f.ends_at).toLocaleString()}</p>
            </div>
            <button onClick={() => handleDelete(f.id)} className="ml-auto text-red-500 font-bold">Retirer</button>
          </div>
        ))}
      </div>
    </div>
  )
}