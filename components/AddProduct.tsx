"use client";
import { useState, useEffect } from "react";
import { createProducts,  uploadProductsImages } from "../app/lib/products";
import type { Category } from "../app/lib/categories";
import {getAllCategories} from "../app/lib/categories";
import { Loader2 } from "lucide-react"; // pour le spinner

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    description: "",
    stock: 0,
    image: "",
    category_id: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCat, setLoadingCat] = useState(true); // pour charger les catégories
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState(""); // pour afficher les erreurs

  // Charger les catégories au démarrage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err: any) {
        setError("Impossible de charger les catégories: " + err.message);
      } finally {
        setLoadingCat(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let imageUrl = form.image;

      // Upload image si fichier sélectionné
      if (imageFile) {
        // uploadProductsImages expects two arguments (file, folderName)
        imageUrl = await uploadProductsImages(imageFile, "products");
      }

      if (!imageUrl) {
        throw new Error("Veuillez sélectionner une image");
      }

      await createProducts({
        ...form,
        image: imageUrl,
        category_id: Number(form.category_id),
        images: [],
        short_description: "",
        description: "",
        promo_end_date: null
      });
      alert("Produit ajouté avec succès!");
      setForm({ name: "", price: 0, description: "", stock: 0, image: "", category_id: "" });
      setImageFile(null);
    } catch (error: any) {
      setError("Erreur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white">
      <h2 className="text-xl font-bold">Ajouter un produit</h2>

      {error && <p className="text-red-600 bg-red-50 p-2 rounded">{error}</p>}

      <input
        type="text"
        placeholder="Nom du produit"
        value={form.name}
        onChange={(e) => setForm({...form, name: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="number"
        placeholder="Prix en FCFA"
        value={form.price}
        onChange={(e) => setForm({...form, price: Number(e.target.value) })}
        className="w-full p-2 border rounded"
        required
        min="0"
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({...form, description: e.target.value })}
        className="w-full p-2 border rounded"
        rows={3}
      />

      <input
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={(e) => setForm({...form, stock: Number(e.target.value) })}
        className="w-full p-2 border rounded"
        required
        min="0"
      />

      {/* SELECT CATEGORIE */}
      <select
        value={form.category_id}
        onChange={(e) => setForm({...form, category_id: e.target.value })}
        className="w-full p-2 border rounded"
        required
        disabled={loadingCat}
      >
        <option value="">
          {loadingCat? "Chargement..." : "-- Choisir une catégorie --"}
        </option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div>
        <label className="block text-sm font-medium mb-1">Image du produit</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
          required
        />
        {imageFile && <p className="text-sm text-gray-500 mt-1">{imageFile.name}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="animate-spin" size={18} />}
        {loading? "Ajout..." : "Ajouter le produit"}
      </button>
    </form>
  );
}