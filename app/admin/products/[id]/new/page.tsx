"use client"
import { useState, useEffect } from "react"
import { createProduct, uploadProductImages } from "../../../../lib/products"
import { getCategories, type Category } from "../../../../lib/categories"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft, Loader2, X, Upload } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [description, setDescription] = useState("")
  const [short_description, setShortDescription] = useState("")
  const [long_description, setLongDescription] = useState("")
  const [category_id, setCategoryId] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => { getCategories().then(setCategories) }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls = await uploadProductImages(Array.from(files));
      setImages(prev => [...prev,...urls]);
    } catch (err) { alert("Erreur upload image"); }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i!== index));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(images.length === 0) return alert("Ajoute au moins 1 image")
    setLoading(true)
    await createProduct({
      name, price: Number(price), stock: Number(stock),
      image: images[0], // 1ère image = image principale
      images,
      description, short_description, long_description, category_id
    })
    setLoading(false)
    router.push("/admin/products")
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/admin/products" className="flex items-center gap-2 text-blue-600 mb-6 hover:underline">
        <ArrowLeft size={18} /> Retour à la liste
      </Link>
      <h1 className="text-3xl font-bold mb-6">Ajouter un produit</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom du produit" className="w-full p-3 border rounded-lg bg-transparent" required/>
        <select value={category_id} onChange={e => setCategoryId(e.target.value)} className="w-full p-3 border rounded-lg bg-transparent" required>
          <option value="">Choisir une catégorie</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Prix FCFA" className="w-full p-3 border rounded-lg bg-transparent" required/>
          <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="Stock" className="w-full p-3 border rounded-lg bg-transparent" required/>
        </div>

        <div>
          <label className="block font-medium mb-2">Galerie d'images</label>
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="hidden" id="file-upload"/>
            <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 dark:bg-zinc-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <Upload size={18}/> {uploading? "Upload..." : "Ajouter des images"}
            </label>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="w-24 h-24 object-cover rounded-lg"/>
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
              </div>
            ))}
          </div>
        </div>

        <input value={short_description} onChange={e => setShortDescription(e.target.value)} placeholder="Description courte" className="w-full p-3 border rounded-lg bg-transparent" required/>
        <textarea value={long_description} onChange={e => setLongDescription(e.target.value)} rows={4} placeholder="Description longue" className="w-full p-3 border rounded-lg bg-transparent" required/>

        <button disabled={loading || uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2">
          <Save size={20} /> {loading? "Enregistrement..." : "Enregistrer le produit"}
        </button>
      </form>
    </div>
  )
}