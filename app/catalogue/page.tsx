 "use client";
import { useState, useEffect, Suspense } from "react"; // <-- AJOUT Suspense
import { useSearchParams, useRouter } from "next/navigation"; 
import { getAllProducts, getCategories } from "../lib/products";
import ProductCard from "../../components/ProductCard";
import type { Products, Category } from "../lib/products";
import { Search, Filter, Loader2 } from "lucide-react";

function CatalogueContent() { // <-- 1. Ton code est maintenant ici
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlSearch = searchParams.get('search') || ""; 
  const urlCat = searchParams.get('cat') || "all";

  const [allProducts, setAllProducts] = useState<Products[]>([]); 
  const [products, setProducts] = useState<Products[]>([]); 
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCat);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          getAllProducts(),
          getCategories()
        ]);
        setAllProducts(prods || []);
        setProducts(prods || []); 
        setCategories(cats || []);
      } catch(err) {
        console.error("Erreur chargement catalogue:", err)
      }
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    let filtered = allProducts;

    if (selectedCategory!== "all") {
      filtered = filtered.filter(p => (p.category || "") === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.name || "").toLowerCase().includes(term) ||
        (p.description || "").toLowerCase().includes(term)
      );
    }

    setProducts(filtered);

    const params = new URLSearchParams();
    if(searchTerm) params.set('search', searchTerm);
    if(selectedCategory !== "all") params.set('cat', selectedCategory);
    router.replace(`/catalogue?${params.toString()}`);

  }, [searchTerm, selectedCategory, allProducts, router]);

  useEffect(() => {
    setSearchTerm(urlSearch);
    setSelectedCategory(urlCat);
  }, [urlSearch, urlCat])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex justify-center items-center gap-2">
        <Loader2 className="animate-spin"/> Chargement du catalogue...
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-2">Catalogue Complet</h1>
      <p className="text-gray-500 mb-10">{products.length} produits trouvés</p>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
          <input
            type="text"
            placeholder="Recher dans le catalogue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-12 border-2 rounded-xl dark:bg-zinc-900 dark:border-zinc-800 focus:border-purple-500 outline-none"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto p-3 pl-12 border-2 rounded-xl dark:bg-zinc-900 dark:border-zinc-800 appearance-none"
          >
            <option value="all">Toutes Catégories</option>
            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      {products.length === 0? (
        <div className="text-center py-20">
          <p className="text-xl font-bold">Aucun produit trouvé 😕</p>
          <p className="text-gray-500">Essaie d'effacer ta recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}

export default function CataloguePage() { // <-- 2. C'est lui qui wrap
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center">Chargement du catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  )
}