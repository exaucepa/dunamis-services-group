import { getAllProducts, getCategories } from "../lib/products";
import ProductCard from "../../components/ProductCard";

export default async function CataloguePage() {
  const products = await getAllProducts();
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-2">Catalogue Complet</h1>
      <p className="text-gray-500 mb-10">{products.length} produits disponibles</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => <ProductCard key={product.id} {...product} />)}
      </div>
    </div>
  );
}