"use client";
import { useState, useEffect } from "react";
import { getAllProducts, supabase } from "../app/lib/products";
import { type Products } from "../app/lib/products";
import { Tag, Save } from "lucide-react";

export default function AdminPromoPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    getAllProducts().then(p => {setProducts(p); setLoading(false)}) 
  }, []);

  const handleSetPromo = async (productId: string, promo_price: number, end_date: string) => {
    const { error } = await supabase.from('products').update({ 
      promo_price, 
      promo_end_date: end_date 
    }).eq('id', productId);
    if(!error) alert("Promo mise à jour");
    else alert(error.message)
  }

  if(loading) return <p>Chargement...</p>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 flex gap-2"><Tag/> Gérer les Promos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow">
            <img src={p.image} className="w-full h-40 object-cover rounded mb-3"/>
            <h3 className="font-bold">{p.name}</h3>
            <p>Prix: {p.price}F</p>
            <p className="text-green-600">Promo: {p.promo_price || 'Aucune'}F</p>
            <input type="number" placeholder="Nouveau prix promo" id={`price-${p.id}`} className="w-full mt-2 p-2 border rounded"/>
            <input type="datetime-local" id={`date-${p.id}`} className="w-full mt-2 p-2 border rounded"/>
            <button onClick={() => {
              const price = Number((document.getElementById(`price-${p.id}`) as HTMLInputElement).value)
              const date = (document.getElementById(`date-${p.id}`) as HTMLInputElement).value
              handleSetPromo(p.id, price, date)
            }} className="w-full mt-3 bg-purple-600 text-white py-2 rounded flex items-center justify-center gap-2">
              <Save size={16}/> Mettre en promo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}