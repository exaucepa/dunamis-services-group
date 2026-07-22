"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Trash2, Save, Users, Clock } from "lucide-react";

export default function ManageGroupages() {
  const [groupages, setGroupages] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ objectif_participants: 10, status: 'en_cours' });

  useEffect(() => { fetchGroupages(); fetchProducts(); }, []);

  const fetchGroupages = async () => {
    const { data } = await supabase
      .from("groupages")
      .select("*, products(name, image, price)") // on fait le join
      .order("created_at", { ascending: false });
    setGroupages(data || []);
  };
  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("id, name, price");
    setProducts(data || []);
  };

  const handleSave = async () => {
    if(!form.product_id ||!form.prix_groupe ||!form.date_fin_groupage) return alert("Produit, Prix Groupe et Date Fin obligatoires");
    await supabase.from("groupages").insert(form);
    setForm({ objectif_participants: 10, status: 'en_cours' }); fetchGroupages();
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Supprimer ce groupage?")) return;
    await supabase.from("groupages").delete().eq("id", id);
    fetchGroupages();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><Users/> Gérer Groupages</h1>

      <div className="p-6 border rounded-2xl bg-white dark:bg-zinc-900 mb-8 space-y-4">
        <h2 className="text-xl font-bold">Lancer un nouveau Groupage</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <select value={form.product_id || ''} onChange={e => setForm({...form, product_id: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800">
            <option value="">Choisir un Produit</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} - {p.price} FCFA</option>)}
          </select>
          <input type="number" placeholder="Prix Groupe Ex: 25000" value={form.prix_groupe || ''} onChange={e => setForm({...form, prix_groupe: +e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
          <input type="number" placeholder="Objectif Qté Ex: 10" value={form.objectif_participants || ''} onChange={e => setForm({...form, objectif_participants: +e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
          <input type="datetime-local" value={form.date_fin_groupage || ''} onChange={e => setForm({...form, date_fin_groupage: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
        </div>
        <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800">
          <Save/> Lancer le Groupage
        </button>
      </div>

      <div className="space-y-4">
        {groupages.map((g) => {
          const progress = (g.current_quantity / g.objectif_participants) * 100;
          return (
            <div key={g.id} className="p-4 border rounded-2xl bg-white dark:bg-zinc-900">
              <div className="flex gap-4 items-center mb-3">
                <img src={g.products?.image} className="w-20 h-20 rounded-lg object-cover"/>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{g.products?.name}</h3>
                  <p className="text-sm">Participants: {g.current_quantity}/{g.objectif_participants} | Prix Groupe: <span className="font-bold text-green-600">{g.prix_groupe} FCFA</span></p>
                  <p className="text-sm flex items-center gap-1"><Clock size={14}/> Fin: {new Date(g.date_fin_groupage).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${g.status === 'en_cours' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200'}`}>{g.status}</span>
                </div>
                <button onClick={() => handleDelete(g.id)} className="p-2 bg-red-600 text-white rounded-lg"><Trash2 size={18}/></button>
              </div>
              <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}