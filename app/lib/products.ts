import { supabase } from './supabase';

export type Product = {
  id: string;
  name: string;
  price: number;
  promo_price?: number | null;
  image: string;
  images: string[];
  description: string;
  stock: number;
  category?: string;
  featured?: boolean;
};

const mapProduct = (p: any): Product => ({
  id: p.id, name: p.name, price: p.price, promo_price: p.promo_price,
  image: p.image, images: p.images || [], description: p.description,
  stock: p.stock, category: p.category?.name || "Non classé",
  featured: p.featured,
});

export const getFeaturedProductsWithPromo = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from("products").select("*, category:categories(name)").not('promo_price', 'is', null).gt('promo_price', 0).limit(8);
  if (error) return [];
  const promoProducts = (data || []).filter(p => p.promo_price && p.promo_price < p.price);
  return promoProducts.length > 0 ? promoProducts.map(mapProduct) : [];
};

export const getAllProducts = async (): Promise<Product[]> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").order("created_at", { ascending: false });
  return (data || []).map(mapProduct);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").eq("id", id).single();
  return data ? mapProduct(data) : null;
};

export const getCategories = async () => {
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
};

export const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export async function getProductsOnPromo(): Promise<Product[]> {
  return getFeaturedProductsWithPromo();
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase.from("products").select("*, category:categories(name)").eq("featured", true).limit(8);
  return (data || []).map(mapProduct);
}

export async function getGroupagesEnCours() {
  const { data } = await supabase
   .from('groupages')
   .select(', products()')
   .eq('status', 'en_cours')
   .gt('date_fin_groupage', new Date().toISOString())
   .order('created_at', { ascending: false });
  return data;
}