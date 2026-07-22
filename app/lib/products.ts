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

export type Category = { id: number; name: string; description?: string; image?: string; created_at?: string; }

export type Products = {
  id: string; name: string; price: number; promo_price?: number | null;
  promo_end_date: string | null; image: string; images: string[]; description: string;
  stock: number; category?: string; category_id?: number; featured?: boolean;
  short_description: string; rating: number; reviews_count: number;
};

export type Groupage = {
  id: string;
  product_id: string;
  prix_groupe: number;
  objectif_participants: number;
  participants: number;
  date_fin_groupage: string;
  active: boolean;
  created_at?: string;
}

const mapProducts = (p: any): Products | null => {
  if (!p) return null;
  return {
    id: p.id, name: p.name, price: p.price, promo_price: p.promo_price,
    image: p.image || '/placeholder.png', images: p.images || [], description: p.description,
    stock: p.stock, category: p.category?.name || "Non classé", category_id: p.category_id,
    featured: p.featured, short_description: p.short_description || "", rating: p.rating || 0,
    reviews_count: p.reviews_count || 0, promo_end_date: p.promo_end_date || null
  }
};

export const getAllProducts = async (): Promise<Products[]> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").order("created_at", { ascending: false });
  return (data || []).map(mapProducts).filter(Boolean) as Products[];
};

export const getProductsById = async (id: string): Promise<Products | null> => {
  const { data, error } = await supabase.from("products").select("*, category:categories(name)").eq("id", id).single();
  if(error) {
    console.error("Supabase getProductsById Error:", error.message)
    return null
  }
  return data? mapProducts(data) : null;
};

export const getFeaturedProducts = async (): Promise<Products[]> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").eq("featured", true).limit(8);
  return (data || []).map(mapProducts).filter(Boolean) as Products[];
};

export const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".");

// ===== SLIDERS CRUD =====
export const getSliders = async (): Promise<Slider[]> => {
  const { data, error } = await supabase.from("sliders").select("*").eq("is_active", true).order("display_order");
  if (error) { console.error("Erreur getSliders:", error); return []; }
  return data || [];
};

export const getAllSlidersAdmin = async (): Promise<Slider[]> => {
  const { data, error } = await supabase.from("sliders").select("*").order("display_order");
  if (error) { console.error("Erreur getAllSlidersAdmin:", error); return []; }
  return data || [];
};

export const createSlider = async (slider: Omit<Slider, 'id'>) => {
  const { data, error } = await supabase.from("sliders").insert(slider).select().single();
  if (error) throw error;
  return data;
};

export const updateSlider = async (id: number, updates: Partial<Slider>) => {
  const { data, error } = await supabase.from("sliders").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const deleteSlider = async (id: number) => {
  const { error } = await supabase.from("sliders").delete().eq("id", id);
  if (error) throw error;
};

export const uploadSliderImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `hero/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const { data, error } = await supabase.storage.from('hero').upload(fileName, file, { upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('hero').getPublicUrl(data.path);
  return urlData.publicUrl;
};

// ===== GROUPAGE =====
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
  return (data || []).filter(g => g.participants < g.objectif_participants).map(g => ({
...g,
    products: mapProducts(g.products) || { id: 'deleted', name: 'Produit supprimé', image: '/placeholder.png', price: 0, images:[], description:'', stock:0, short_description:'', rating:0, reviews_count:0, promo_end_date:null }
  }));
}
export const getActiveGroupages = getGroupagesEnCours;

// FAKE DATA pour l'instant
const fakeGroupages: Groupage[] = [
  {
    id: "4",
    product_id: "be1083e4-86d8-4f7e-80e7-925df4c36eee",
    prix_groupe: 29998,
    objectif_participants: 10,
    participants: 1,
    date_fin_groupage: "2026-07-22 10:21:21.761695+00",
    active: true
  }
]

export async function getGroupageByProductsId(productId: string): Promise<Groupage | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return fakeGroupages.find(g => g.product_id === productId) || null;
}

// ===== UPLOAD =====
export const uploadProductsImage = async (file: File, p0: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const { data, error } = await supabase.storage.from('products').upload(fileName, file, { upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('products').getPublicUrl(data.path);
  return urlData.publicUrl;
};

// ===== CATEGORIES CRUD =====
export async function createCategory(category: Omit<Category, 'id' | 'created_at'>) { const { data, error } = await supabase.from('categories').insert(category).select().single(); if (error) throw error; return data; }
export async function updateCategory(id: number, category: Partial<Category>) { const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single(); if (error) throw error; return data; }
export async function deleteCategory(id: number) { const { error } = await supabase.from('categories').delete().eq('id', id); if (error) throw error; }
export async function getCategories(): Promise<Category[]> { const { data, error } = await supabase.from('categories').select('*').order('name'); if (error) throw error; return data || []; }

export async function uploadProductsImages(file: File) {
  const fileName = `products/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('products') // <- le nom de ton bucket Supabase Storage
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function createProducts(product: {
  name: string;
  price: number;
  promo_price?: number | null;
  description: string;
  image: string;
  stock: number;
  category_id?: number | null;
}) {
  const { data, error } = await supabase
    .from('products') // <- le nom de ta table
    .insert([{
      name: product.name,
      price: product.price,
      promo_price: product.promo_price || null,
      description: product.description,
      images: product.image,
      stock: product.stock,
      category_id: product.category_id || null,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}