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
  category_id?: number; // AJOUT POUR L'ADMIN
  featured?: boolean;
};

export type Category = {
  id: number;
  name: string;
}

const mapProduct = (p: any): Product => ({
  id: p.id, name: p.name, price: p.price, promo_price: p.promo_price,
  image: p.image, images: p.images || [], description: p.description,
  stock: p.stock, 
  category: p.category?.name || "Non classé",
  category_id: p.category_id, // AJOUT
  featured: p.featured,
});

// TES FONCTIONS EXISTANTES
export const getFeaturedProductsWithPromo = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from("products").select("*, category:categories(name)").not('promo_price', 'is', null).gt('promo_price', 0).limit(8);
  if (error) return [];
  const promoProducts = (data || []).filter(p => p.promo_price && p.promo_price < p.price);
  return promoProducts.length > 0? promoProducts.map(mapProduct) : [];
};

export const getAllProducts = async (): Promise<Product[]> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").order("created_at", { ascending: false });
  return (data || []).map(mapProduct);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").eq("id", id).single();
  return data? mapProduct(data) : null;
};

export const getCategories = async (): Promise<Category[]> => {
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
  .select('*, products()') // J'ai corrigé la,
  .eq('status', 'en_cours')
  .gt('date_fin_groupage', new Date().toISOString())
  .order('created_at', { ascending: false });
  return data;
}

// ===== AJOUT POUR L'ADMIN =====
export const createProduct = async (productData: Partial<Product>) => {
  const { data, error } = await supabase.from("products").insert([productData]).select().single();
  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const { data, error } = await supabase.from("products").update(productData).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};

// UPLOAD IMAGE VERS SUPABASE STORAGE
export const uploadProductImages = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('products').getPublicUrl(filePath);
  return data.publicUrl;
};

// UPLOAD GENERIQUE - pour catégories aussi
export const uploadProductImage = async (file: File): Promise<string> => {
  return uploadProductImages(file) // on réutilise la même
};

// CATEGORIES CRUD
export const createCategory = async (name: string, image: string) => {
  const { data, error } = await supabase
    .from("categories")
    .insert([{ name, image }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateCategory = async (id: number, name: string, image: string) => {
  const { data, error } = await supabase
    .from("categories")
    .update({ name, image })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};