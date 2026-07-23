"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllProducts, createGroupage, formatPrice } from "../../../lib/products";
import type { Products } from "../../../lib/products";
import { Users, Calendar, DollarSign } from "lucide-react";

export default function NewGroupagePage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({ product_id: "", prix_groupe: 0, objectif_participants: 10, date_fin_groupage: "", active: true });

  useEffect(() => {
    getAllProducts().then(setProducts);
    const date = new Date();
    date.setDate(date.getDate() + 7);
    setForm(f => ({...f, date_fin_groupage: date.toISOString().slice(0, 16)}));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createGroupage({
        ...form,
        participants: 1,
        date_fin_groupage: new Date(form.date_fin_groupage).toISOString()
      });
      alert("Groupage créé !");
      router.push('/admin/groupages');
    } catch (error: any) {
      alert("Erreur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Créer un nouveau Groupage</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg">
        <div>
          <label className="font-bold mb-2 block">Choisir le Produit</label>
          <select value={form.product_id} onChange={e => setForm({...form, product_id: e.target.value})} className="w-full p-3 border rounded-lg bg-transparent" required>
            <option value="">-- Sélectionner --</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} - {formatPrice(p.price)} FCFA</option>)}
          </select>
        </div>
        <div>
          <label className="font-bold mb-2 flex items-center gap-2"><DollarSign size={16}/> Prix du Groupage</label>
          <input type="number" value={form.prix_groupe} onChange={e => setForm({...form, prix_groupe: Number(e.target.value)})} className="w-full p-3 border rounded-lg bg-transparent" placeholder="Ex: 15000" required />
          <p className="text-xs text-gray-500 mt-1">Le prix réduit quand l'objectif est atteint</p>
        </div>
        <div>
          <label className="font-bold mb-2 flex items-center gap-2"><Users size={16}/> Objectif de Participants</label>
          <input type="number" value={form.objectif_participants} onChange={e => setForm({...form, objectif_participants: Number(e.target.value)})} className="w-full p-3 border rounded-lg bg-transparent" required />
        </div>
        <div>
          <label className="font-bold mb-2 flex items-center gap-2"><Calendar size={16}/> Date de Fin</label>
          <input type="datetime-local" value={form.date_fin_groupage} onChange={e => setForm({...form, date_fin_groupage: e.target.value})} className="w-full p-3 border rounded-lg bg-transparent" required />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold">
          {loading? "Création..." : "Lancer le Groupage"}
        </button>
      </form>
    </div>
  );
}