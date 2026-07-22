"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getAllCategories } from "../../lib/categories";
import { getAllProducts, type Product } from "../../lib/products";
import { Loader2 } from "lucide-react";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allCategories, allProducts] = await Promise.all([
          getAllCategories(),
          getAllProducts()
        ]);

        const currentCategory = allCategories.find(c => c.slug === slug);
       
        if (!currentCategory) {
          setCategoryName("Catégorie introuvable");
          setProducts([]);
          return; // on sort
        }

        setCategoryName(currentCategory.name);

        const filteredProducts = allProducts.filter(
          p => p.category_id && p.category_id.toString() === currentCategory.id.toString()
        );
        setProducts(filteredProducts);

      } catch (error) {
        console.error(error);
        setCategoryName("Erreur de chargement");
      } finally {
        setLoading(false); // <-- TOUJOURS exécuté
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Retour Accueil</Link>
      <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
      <p className="text-gray-500 mb-8">{products.length} produits trouvés</p>

      {products.length === 0? (
        <div className="text-center py-20">
          <p>Aucun produit dans cette catégorie pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(product => (
            <Link 
              href={`/produit/${product.id}`} // <-- CLIQUABLE MAINTENANT
              key={product.id} 
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow hover:shadow-xl transition p-4"
            >
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-3"/>
              <h3 className="font-semibold truncate">{product.name}</h3>
              <p className="text-blue-600 font-bold">
                {product.promo_price? `${product.promo_price} FCFA` : `${product.price} FCFA`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}