import { supabase } from './supabase';

export type Slider = {
  id: number;
  image: string;
  title: string;
  subtitle: string | null;
  link: string;
  is_active: boolean;
  display_order: number;
}

export const getSliders = async (): Promise<Slider[]> => {
  const { data, error } = await supabase.from("sliders").select("*").eq("is_active", true).order("display_order");
  if (error) { console.error("Erreur getSliders:", error); return []; }
  return data || [];
};

export type Category = { id: number; name: string; description?: string; image?: string; created_at?: string; }
export type Product = {
  id: string; name: string; price: number; promo_price?: number | null;
  promo_end_date: string | null; image: string; images: string[]; description: string;
  stock: number; category?: string; category_id?: number; featured?: boolean;
  short_description: string; rating: number; reviews_count: number;
};

export type Groupage = {
  id: string; product_id: string; objectif_participants: number; participants: number;
  prix_groupe: number; date_fin_groupage: string; active: boolean; product: Product;
}

const mapProduct = (p: any): Product | null => {
  if (!p) return null;
  return {
    id: p.id, name: p.name, price: p.price, promo_price: p.promo_price,
    image: p.image || '/placeholder.png', images: p.images || [], description: p.description,
    stock: p.stock, category: p.category?.name || "Non classé", category_id: p.category_id,
    featured: p.featured, short_description: p.short_description || "", rating: p.rating || 0,
    reviews_count: p.reviews_count || 0, promo_end_date: p.promo_end_date || null
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").order("created_at", { ascending: false });
  return (data || []).map(mapProduct).filter(Boolean) as Product[];
};
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").eq("id", id).single();
  return data? mapProduct(data) : null;
};
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").eq("featured", true).limit(8);
  return (data || []).map(mapProduct).filter(Boolean) as Product[];
};
export const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".");

export const createGroupage = async (data: Partial<Groupage>) => {
  const { data: d, error } = await supabase.from("groupages").insert([{
    product_id: data.product_id, objectif_participants: data.objectif_participants,
    participants: data.participants || 1, prix_groupe: data.prix_groupe,
    date_fin_groupage: data.date_fin_groupage, active: true
  }]).select().single();
  if (error) throw error;
  return d;
};

export async function getGroupagesEnCours() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
 .from('groupages')
 .select('*, products (id, name, price, promo_price, image, images, description, stock, category_id, featured, short_description, promo_end_date, category:categories(name))')
 .eq('active', true)
 .gt('date_fin_groupage', now)
 .order('date_fin_groupage', { ascending: true });

  if (error) { console.error(error); return []; }

  // On garde même si produit supprimé
  return (data || []).filter(g => g.participants < g.objectif_participants).map(g => ({
  ...g,
    products: mapProduct(g.products) || { id: 'deleted', name: 'Produit supprimé', image: '/placeholder.png', price: 0, images:[], description:'', stock:0, short_description:'', rating:0, reviews_count:0, promo_end_date:null }
  }));
}

export const getActiveGroupages = getGroupagesEnCours;

// CORRIGÉ ICI
export const uploadProductImage = async (file: File, folder: string = 'products') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage.from('products').upload(fileName, file, { upsert: false });
  if (error) throw error;

  const { data: urlData } = supabase.storage.from('products').getPublicUrl(data.path); // <- data.path
  return urlData.publicUrl;
};

// ===== CATEGORIES CRUD =====
export async function createCategory(category: Omit<Category, 'id' | 'created_at'>) { const { data, error } = await supabase.from('categories').insert(category).select().single(); if (error) throw error; return data; }
export async function updateCategory(id: number, category: Partial<Category>) { const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single(); if (error) throw error; return data; }
export async function deleteCategory(id: number) { const { error } = await supabase.from('categories').delete().eq('id', id); if (error) throw error; }
export async function getCategories(): Promise<Category[]> { const { data, error } = await supabase.from('categories').select('*').order('name'); if (error) throw error; return data || []; }