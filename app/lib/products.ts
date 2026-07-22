import { ReactNode } from 'react';
import { supabase } from './supabase';

export type Product = {
  rating: ReactNode;
  reviews_count: number;
  short_description: ReactNode;
  id: string;
  name: string;
  price: number;
  promo_price?: number | null;
  image: string;
  images: string[];
  description: string;
  stock: number;
  category?: string;
  category_id?: number;
  featured?: boolean;
};

export type Category = {
   id: number;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  theme?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
};

export const createCategory = async (categoryData: Partial<Category>) => {
  const { data, error } = await supabase.from("categories").insert([categoryData]).select().single();
  if (error) throw error; return data;
};

export const updateCategory = async (id: number, categoryData: Partial<Category>) => {
  const { data, error } = await supabase.from("categories").update(categoryData).eq("id", id).select().single();
  if (error) throw error; return data;
};

export const deleteCategory = async (id: number) => {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
};

const mapProduct = (p: any): Product => ({
  id: p.id, name: p.name, price: p.price, promo_price: p.promo_price,
  image: p.image, images: p.images || [], description: p.description,
  stock: p.stock,
  category: p.category?.name || "Non classé",
  category_id: p.category_id,
  featured: p.featured,
  short_description: p.short_description || undefined,
  rating: p.rating || 0,
  reviews_count: p.reviews_count || 0
});

// PUBLIC
export const getAllProducts = async (): Promise<Product[]> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").order("created_at", { ascending: false });
  return (data || []).map(mapProduct);
};
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").eq("id", id).single();
  return data? mapProduct(data) : null;
};
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").eq("featured", true).limit(8);
  return (data || []).map(mapProduct);
};
export const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,"");

// ADMIN
export const getAllProductsForAdmin = (): Promise<Product[]> => getAllProducts();

export const createProduct = async (productData: Partial<Product>) => {
  const { data, error } = await supabase.from("products").insert([productData]).select().single();
  if (error) throw error; return data;
};
export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const { data, error } = await supabase.from("products").update(productData).eq("id", id).select().single();
  if (error) throw error; return data;
};
export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};

// CATEGORIES ADMIN
// CATEGORIES ADMIN



// UPLOAD
export const uploadProductImages = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;
  const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from('products').getPublicUrl(filePath);
  return data.publicUrl;
};
export const uploadProductImage = uploadProductImages // alias

// SEARCH
export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query.trim()) return [];
  const { data, error } = await supabase.from("products").select("*, category:categories(name)").ilike("name", `%${query}%`).limit(20);
  if (error) throw error; return (data || []).map(mapProduct);
};

export const getGroupagesEnCours = async (): Promise<Product[]> => {
  // Pour l'instant on retourne vide. Tu rempliras avec ta logique groupage plus tard
  return [];
};

export const getFeaturedProductsWithPromo = async (): Promise<Product[]> => {
  const all = await getFeaturedProducts();
  return all.filter(p => p.promo_price && p.promo_price < p.price); // que les produits en promo
};

// TOUS LES PRODUITS EN PROMO
export const getProductsOnPromo = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .not("promo_price", "is", null) // a un prix promo
    .lt("promo_price", "price") // et que promo < prix normal
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProduct);
};

