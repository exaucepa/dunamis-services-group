"use client";
import { useState, useEffect } from "react";
import { getAllProducts, setProductsPromo, removeProductPromo } from "../../lib/products"; // <- attention au chemin
import { type Products, formatPrice } from "../../lib/products";
import { Tag, Save, Timer, XCircle } from "lucide-react";

function CompteARebours({ dateFin }: { dateFin: string | null }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    if (!dateFin) return;
    const timer = setInterval(() => {
      const diff = new Date(dateFin).getTime() - new Date().getTime();
      if (diff <= 0) { setTime("Terminée"); clearInterval(timer); return; }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTime(`${d}j ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [dateFin]);
  if (!dateFin) return null;
  return <span className="font-bold text-red-500 flex items-center gap-1"><Timer size={14}/> {time}</span>;
}

export default function AdminPromoPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoData, setPromoData] = useState<{[key: string]: {price: string, date: string}}>({});

  useEffect(() => { getAllProducts().then(p => {setProducts(p); setLoading(false)}) }, []);

  const handleInputChange = (id: string, field: 'price' | 'date', value: string) => {
    setPromoData(prev => ({...prev, [id]: {...prev[id], [field]: value}}));
  }

  const handleSetPromo = async (productId: string) => {
    const data = promoData[productId];
    if (!data?.price ||!data?.date) return alert("Remplis le prix et la date");
    try {
      await setProductsPromo(productId, Number(data.price), data.date);
      alert("Promo mise à jour ✅");
      getAllProducts().then(p => setProducts(p));
    } catch (error: any) { alert(error.message) }
  }

  const handleRemovePromo = async (productId: string) => {
    if(!confirm("Supprimer la promo?")) return;
    try {
      await removeProductPromo(productId);
      alert("Promo supprimée");
      getAllProducts().then(p => setProducts(p));
    } catch (error: any) { alert(error.message) }
  }

  if(loading) return <p className="p-8">Chargement...</p>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 flex gap-2"><Tag/> Gérer les Promos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => {
          const isPromoActive = p.promo_price && p.promo_end_date && new Date(p.promo_end_date) > new Date();
          return (
            <div key={p.id} className={`bg-white dark:bg-zinc-900 p-4 rounded-xl shadow border-2 ${isPromoActive? 'border-red-500' : 'border-transparent'}`}>
              <img src={p.image} className="w-full h-40 object-cover rounded mb-3"/>
              <h3 className="font-bold">{p.name}</h3>
              <p>Prix normal: {formatPrice(p.price)} FCFA</p>
              {isPromoActive? (
                <div className="my-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
                  <p className="text-green-600 font-bold">Promo: {formatPrice(p.promo_price!)} FCFA</p>
                  <CompteARebours dateFin={p.promo_end_date} />
                </div>
              ) : <p className="text-gray-500 my-2">Aucune promo active</p>}

              <input type="number" placeholder="Nouveau prix promo" value={promoData[p.id]?.price || ''} onChange={(e) => handleInputChange(p.id, 'price', e.target.value)} className="w-full mt-2 p-2 border rounded dark:bg-zinc-800"/>
              <input type="datetime-local" value={promoData[p.id]?.date || ''} onChange={(e) => handleInputChange(p.id, 'date', e.target.value)} className="w-full mt-2 p-2 border rounded dark:bg-zinc-800"/>

              <div className="flex gap-2 mt-3">
                <button onClick={() => handleSetPromo(p.id)} className="flex-1 bg-purple-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-purple-700"><Save size={16}/> Mettre en promo</button>
                {isPromoActive && <button onClick={() => handleRemovePromo(p.id)} className="bg-red-600 text-white p-2 rounded hover:bg-red-700"><XCircle size={16}/></button>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}