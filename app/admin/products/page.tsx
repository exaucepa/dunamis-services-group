"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { getAllProducts, createProducts, uploadProductsImages, type Products } from "../../lib/products";

export default function AdminProduits() {
  const router = useRouter();
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [prod, setProd] = useState({ name: "", price: "", promo_price: "", description: "", stock: "" });

  useEffect(() => {
    if(localStorage.getItem("isAdmin")!== "true") router.push("/admin");
    fetchProducts();
  }, []);

  const fetchProducts = async () => setProducts(await getAllProducts());

  const handleSubmit = async (e: any) => {
    e.preventDefault(); setLoading(true);
    const file = e.target.image.files[0];
    const imageUrl = await uploadProductsImages(file);
    await createProducts({
      ...prod,
      price: Number(prod.price),
      promo_price: prod.promo_price ? Number(prod.promo_price) : null,
      stock: Number(prod.stock),
      image: imageUrl,
      promo_end_date: null,
      images: [],
      short_description: ""
    });
    setShowForm(false); setLoading(false); fetchProducts();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/dashboard" className="flex gap-2"><ArrowLeft/> Retour</Link>
        <button onClick={() => setShowForm(!showForm)} className="flex gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"><Plus/> Nouveau Produit</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 border rounded-xl mb-6 bg-white dark:bg-zinc-900 flex-col gap-3">
          <h2 className="font-bold text-xl">Ajouter Produit</h2>
          <input placeholder="Nom" onChange={e => setProd({...prod, name: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800" required/>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Prix FCFA" onChange={e => setProd({...prod, price: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800" required/>
            <input type="number" placeholder="Prix Promo" onChange={e => setProd({...prod, promo_price: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
          </div>
          <input type="number" placeholder="Stock" onChange={e => setProd({...prod, stock: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
          <textarea placeholder="Description" onChange={e => setProd({...prod, description: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
          <input type="file" name="image" accept="image/*" required/>
          <button disabled={loading} className="bg-green-600 text-white p-3 rounded-lg font-bold">{loading? "Ajout..." : "Enregistrer"}</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="border rounded-xl p-4 bg-white dark:bg-zinc-900">
            <img src={p.image} className="w-full h-40 object-cover rounded-lg mb-3"/>
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-green-600 font-bold">{p.promo_price || p.price} FCFA</p>
            <p className="text-sm">Stock: {p.stock}</p>
          </div>
        ))}
      </div>
    </div>
  )
}