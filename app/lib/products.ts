import { ReactNode } from 'react';
import { supabase } from './supabase';

export type Product = {
  rating: number;
  reviews_count: number;
  short_description: string;
  id: string;
  name: string;
  price: number;
  promo_price?: number | null;
  promo_end_date: string | null; // <-- AJOUTE ÇA
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

// AJOUTÉ : TYPE SLIDER CORRIGÉ
export type Slider = { 
  id: number; 
  image: string; 
  title: string; 
  subtitle: string | null; 
  link: string; 
  is_active: boolean; // <- C'est is_active dans ta DB
  display_order: number;
}

export type Groupage = { 
  id: number; 
  product_id: string; 
  objectif_participants: number; 
  participants: number; 
  prix_groupe: number; 
  date_fin_groupage: string; 
  products: Product; 
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
  short_description: p.short_description || "",
  rating: p.rating || 0,
  reviews_count: p.reviews_count || 0,
  promo_end_date: p.promo_end_date || null
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
export const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".");

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

// UPLOAD
export const uploadProductImages = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;
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

export const getFeaturedProductsWithPromo = async (): Promise<Product[]> => {
  const all = await getFeaturedProducts();
  return all.filter(p => p.promo_price && p.promo_price < p.price);
};

// TOUS LES PRODUITS EN PROMO
export const getProductsOnPromo = async (): Promise<Product[]> => {
  const { data, error } = await supabase
   .from("products")
   .select("*, category:categories(name)")
   .not("promo_price", "is", null)
   .lt("promo_price", "price")
   .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProduct);
};

// ========== SLIDERS ==========
export const getSliders = async (): Promise<Slider[]> => {
  const { data } = await supabase.from("sliders").select("*").eq("is_active", true).order("display_order"); // <- is_active
  return data || [];
};

export const createSlider = async (data: Partial<Slider>) => { 
  const { data: d, error } = await supabase.from("sliders").insert([data]).select().single(); 
  if (error) throw error; 
  return d; 
};

export const deleteSlider = async (id: number) => { // <- id number
  const { error } = await supabase.from("sliders").delete().eq("id", id);
  if (error) throw error;
};

export const updateSlider = async (id: number, updates: Partial<Slider>) => { // <- id number
  const { error } = await supabase.from("sliders").update(updates).eq("id", id);
  if (error) throw error;
};

export const createGroupage = async (data: Partial<Groupage>) => { 
  const { data: d, error } = await supabase.from("groupages").insert([data]).select().single(); 
  if (error) throw error; 
  return d; 
};

export async function getGroupageByProductId(productId: string) {
  const { data } = await supabase
   .from('groupages')
   .select('*')
   .eq('product_id', productId)
   .eq('active', true) // <-- AJOUTE ÇA
   .gt('date_fin_groupage', new Date().toISOString())
   .filter('participants', 'lt', 'objectif_participants')
   .single();
  return data;
}

export { supabase };


export async function getGroupagesEnCours() {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('groupages')
    .select(`
      *,
      product:products(*)
    `)
    .eq('active', true)
    .gt('date_fin_groupage', now)
    .order('date_fin_groupage', { ascending: true });

  if (error) { 
    console.error("ERREUR GET GROUPAGES:", JSON.stringify(error)); // <-- pour voir le vrai message
    return []; 
  }
  
  // On filtre participants < objectif côté JS au lieu de SQL
  const filtered = data?.filter(g => g.participants < g.objectif_participants) || [];
  return filtered;
}


