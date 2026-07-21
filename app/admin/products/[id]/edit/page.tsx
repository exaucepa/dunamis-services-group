"use client"

import { useState, useEffect } from "react"
import { updateProduct, getProductById, uploadProductImages, getCategories } from "../../../../lib/products"
import { getAllCategories, type Category } from "../../../../lib/categories"
import { useRouter, useParams } from "next/navigation"
import { Save, ArrowLeft, Loader2, X, Upload } from "lucide-react"
import Link from "next/link"

export default function EditProductPage() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [promo_price, setPromoPrice] = useState("")
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
  const { id } = useParams()

  useEffect(() => {
    getAllCategories().then(setCategories)
    if(id) getProductById(id as string).then(p => {
      if(p) {
        setName(p.name); setPrice(String(p.price)); setPromoPrice(String(p.promo_price || "")); setStock(String(p.stock));
        setImages(p.images.length? p.images : [p.image]);
        setDescription(p.description);
        // short_description may not exist on Product type — fallback safely
        setShortDescription(((p as any).short_description ?? (p as any).shortDescription ?? "") as string);
        // long_description may be named long_description or longDescription; fallback to description
        setLongDescription(((p as any).long_description ?? (p as any).longDescription ?? p.description ?? "") as string);
        setCategoryId(p.category_id !== undefined && p.category_id !== null ? String(p.category_id) : "")
      }
    })
  }, [id])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fileArray = Array.from(files);
      const uploadResults = await Promise.all(fileArray.map(file => uploadProductImages(file)));
      const urls = uploadResults.flat();
      setImages(prev => [...prev, ...urls]);
    } catch (err) { alert("Erreur upload image"); }
    setUploading(false);
  };

  const removeImage = (index: number) => setImages(images.filter((_, i) => i!== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // build payload as any to allow additional fields not present on Product type
    const payload: any = {
      name,
      price: Number(price),
      promo_price: promo_price ? Number(promo_price) : undefined,
      stock: Number(stock),
      image: images[0],
      images,
      description,
      short_description,
      long_description,
      category_id: category_id ? Number(category_id) : undefined,
    }

    await updateProduct(id as string, payload)
    setLoading(false)
    router.push("/admin/products")
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/admin/products" className="flex items-center gap-2 text-blue-600 mb-6 hover:underline">
        <ArrowLeft size={18} /> Retour à la liste
      </Link>
      <h1 className="text-3xl font-bold mb-6">Modifier le produit</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom du produit" className="w-full p-3 border rounded-lg bg-transparent" required/>
        <select value={category_id} onChange={e => setCategoryId(e.target.value)} className="w-full p-3 border rounded-lg bg-transparent" required>
          <option value="">Choisir une catégorie</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="grid grid-cols-3 gap-4">
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Prix Normal" className="w-full p-3 border rounded-lg bg-transparent" required/>
          <input type="number" value={promo_price} onChange={e => setPromoPrice(e.target.value)} placeholder="Prix Promo" className="w-full p-3 border rounded-lg bg-transparent"/>
          <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="Stock" className="w-full p-3 border rounded-lg bg-transparent" required/>
        </div>

        <div>
          <label className="block font-medium mb-2">Galerie d'images</label>
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="hidden" id="file-upload-edit"/>
            <label htmlFor="file-upload-edit" className="cursor-pointer bg-gray-200 dark:bg-zinc-800 px-4 py-2 rounded-lg flex items-center gap-2">
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
          <Save size={20} /> {loading? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  )
}