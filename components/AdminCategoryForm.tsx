"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { createCategory, updateCategory, uploadProductImage } from "../app/lib/products"
import type { Category } from "../app/lib/products"

interface Props { category?: Category | null; onClose: () => void; onSuccess: () => void }

export default function AdminCategoryForm({ category, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ name: "", image: "" })

  // FIX 1: On remet bien l'image si on est en mode édition
  useEffect(() => {
    setFormData({
      name: category?.name || "",
      image: (category as any)?.image || ""
    })
  }, [category])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      setUploading(true)
      const url = await uploadProductImage(file)
      setFormData(prev => ({...prev, image: url }))
    } catch (err: any) { alert("Erreur upload: " + err.message) }
    finally { setUploading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() ||!formData.image) return alert("Tous les champs requis");
    try {
      setLoading(true)
      if (category) {
        await updateCategory(category.id, formData.name.trim(), formData.image) // <-- FIX 2: 3 params
      }
      else {
        await createCategory(formData.name.trim(), formData.image)
      }
      onSuccess();
      onClose();
    } catch (err: any) { alert("Erreur: " + err.message) }
    finally { setLoading(false) }
  }

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-4">{category? "Modifier" : "Nouvelle"} Catégorie</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nom de la catégorie"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border rounded-xl dark:bg-zinc-800"
            />

            <div>
              <label className="block mb-2 font-semibold">Image</label>
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer">
                <Upload size={20} />
                {uploading? "Upload..." : "Choisir une image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {formData.image && (
                <div className="relative w-full h-32 mt-2">
                  <Image src={formData.image} alt="preview" fill className="object-contain rounded-lg"/>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="flex-1 p-3 border rounded-xl">Annuler</button>
              <button type="submit" disabled={loading} className="flex-1 p-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2">
                {loading && <Loader2 className="animate-spin" size={18}/>}
                Enregistrer
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}