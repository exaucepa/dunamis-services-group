"use client";
import { useEffect, useState } from 'react'
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "", short_description: "", long_description: "",
    price: "", promo_price: "", stock: "", image: "", category_id: "", featured: false,
    images: [""]
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }}) => {
      if (!user) router.push('/login')
    })
  }, [router])

  const uploadFile = async (e: any, index: number | null) => {
    const file = e.target.files[0];
    if(!file) return;
    setUploading(true);
    const fileName = `products/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
    if(uploadError){ alert("Upload erreur: " + uploadError.message); setUploading(false); return; }
    const { data } = supabase.storage.from('products').getPublicUrl(fileName);
    if(index === null){ setForm({...form, image: data.publicUrl}); } 
    else { const newImages = [...form.images]; newImages[index] = data.publicUrl; setForm({...form, images: newImages}); }
    setUploading(false);
  }

  const addImageField = () => setForm({...form, images: [...form.images, ""]});
  const removeImageField = (index: number) => setForm({...form, images: form.images.filter((_, i) => i!== index)});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const filteredImages = form.images.filter(img => img.trim()!== "");
      const { error } = await supabase.from("products").insert([{
        ...form,
        price: Number(form.price),
        promo_price: form.promo_price ? Number(form.promo_price) : null,
        stock: Number(form.stock),
        images: filteredImages,
        category_id: form.category_id? Number(form.category_id) : null,
        rating: 0
      }]);
      if(error) throw error;
      alert("Produit ajouté!");
      router.push("/admin/products");
    } catch (err: any) { alert("Erreur: " + err.message); }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ajouter un Nouveau Produit</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input placeholder="Nom du produit" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-2 rounded" required />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Prix Normal FCFA" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="border p-2 rounded" required />
          <input type="number" placeholder="Prix Promo FCFA" value={form.promo_price} onChange={e => setForm({...form, promo_price: e.target.value})} className="border p-2 rounded" />
        </div>
        <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="border p-2 rounded" />
        
        <div>
          <label className="font-bold">Image Principale</label>
          <input type="file" accept="image/*" onChange={e => uploadFile(e, null)} className="border p-2 rounded w-full mt-1" />
          {form.image && <img src={form.image} className="w-24 h-24 mt-2 rounded object-cover" />}
        </div>

        <div>
          <label className="font-bold">Galerie d'images</label>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2 items-center mt-2">
              <input type="file" accept="image/*" onChange={e => uploadFile(e, i)} className="border p-2 rounded w-full" />
              {img && <img src={img} className="w-16 h-16 rounded object-cover" />}
              <button type="button" onClick={() => removeImageField(i)} className="text-red-500">X</button>
            </div>
          ))}
          <button type="button" onClick={addImageField} className="text-blue-500 text-sm mt-1">+ Ajouter une image</button>
        </div>

        <input placeholder="ID Catégorie" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="border p-2 rounded" />
        <button disabled={loading || uploading} className="bg-black text-white p-3 rounded font-bold disabled:opacity-50">
          {uploading? "Upload..." : loading? "Ajout..." : "Enregistrer"}
        </button>
      </form>
    </div>
  )
}