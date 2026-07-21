"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Search, Loader2, Upload } from "lucide-react"
import Image from "next/image"
import { 
  getAllProductsForAdmin, 
  deleteProduct, 
  createProduct,
  updateProduct,
  uploadProductImage,
  uploadProductImages,
  getCategories,
  type Product,
  type Category
} from "../../lib/products" // <-- utilise @ pour être sûr
import AdminProductForm from "../../../components/AdminProductForm"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    const data = await getAllProductsForAdmin() // <-- utiliser la version Admin pour avoir tout
    setProducts(data)
    setFiltered(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // CORRIGÉ: product.category est déjà un string
  useEffect(() => {
    setFiltered(
      products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [search, products])

  const handleDelete = async (id: string) => {
    if(!confirm("Supprimer ce produit ?")) return
    try {
      setDeletingId(id)
      await deleteProduct(id)
      fetchProducts()
    } catch(err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpenForm = (product: Product | null = null) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-zinc-950 p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>
        <button 
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 bg-blue-700 text-white px-5 py-3 rounded-xl hover:bg-blue-800 transition"
        >
          <Plus size={20} /> Ajouter un produit
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Recher par nom ou catégorie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border rounded-xl bg-white dark:bg-zinc-900"
        />
      </div>

      {/* Tableau */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-20">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-zinc-800">
                <tr>
                  <th className="p-4 text-left">Produit</th>
                  <th className="p-4 text-left">Catégorie</th>
                  <th className="p-4 text-left">Prix</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-center">Photos</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-medium">{product.name}</span>
                        <p className="text-xs text-gray-500">{product.short_description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{product.category || 'Sans catégorie'}</span>
                    </td>
                    <td className="p-4 font-bold">{product.price.toLocaleString()} FCFA</td>
                    <td className="p-4">
                      <span className={product.stock < 5 ? "text-red-500 font-bold" : ""}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {product.images && product.images.length > 0 && (
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{product.images.length + 1} photos</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenForm(product)}
                          className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
                        >
                          {deletingId === product.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center py-10 text-gray-500">Aucun produit trouvé</p>
            )}
          </div>
        )}
      </div>

      {/* Modal Formulaire */}
      {showForm && (
        <AdminProductForm
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSuccess={fetchProducts}
        />
      )}
    </main>
  )
}