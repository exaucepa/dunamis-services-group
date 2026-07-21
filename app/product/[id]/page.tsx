import { getProductById, formatPrice } from "../../lib/products";
import AddToCartButton from "../../../components/AddToCartButton";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) notFound(); // 404 si produit n'existe pas

  const prix = product.promo_price || product.price;
  const economie = product.promo_price? product.price - product.promo_price : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">

        {/* GAUCHE : IMAGES */}
        <div>
          <img src={product.image} alt={product.name} className="w-full h-[500px] object-cover rounded-2xl shadow-lg"/>
          {/* Tu peux ajouter une galerie avec product.images ici */}
        </div>

        {/* DROITE : INFOS */}
        <div>
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          <h1 className="text-4xl font-extrabold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <p className="text-4xl font-bold text-red-600">{formatPrice(prix)} FCFA</p>
            {product.promo_price && (
              <>
                <p className="text-xl line-through text-gray-400">{formatPrice(product.price)} FCFA</p>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-sm font-bold">
                  -{Math.round((economie / product.price) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>

          <p className={`font-bold mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `En stock: ${product.stock} pièces` : 'Rupture de stock'}
          </p>

          {/* BOUTON AJOUTER AU PANIER */}
          <AddToCartButton product={product} />

        </div>
      </div>
    </div>
  );
}