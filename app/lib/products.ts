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

export const getProductsById = async (id: string): Promise<Products | null> => {
  const { data, error } = await supabase.from("products").select("*, category:categories(name)").eq("id", id).single();
  if(error) { console.error("Supabase getProductsById Error:", error.message); return null }
  return data? mapProducts(data) : null;
};

export const getFeaturedProducts = async (): Promise<Products[]> => {
  const { data } = await supabase.from("products").select("*, category:categories(name)").eq("featured", true).limit(8);
  return (data || []).map(mapProducts).filter(Boolean) as Products[];
};

export const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".");

// ===== PROMOS =====
export async function getActivePromos(): Promise<Products[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase.from('products').select('*, category:categories(name)').not('promo_price', 'is', null).not('promo_end_date', 'is', null).gt('promo_end_date', now).order('promo_end_date', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapProducts).filter(Boolean) as Products[];
}

export async function setProductsPromo(productId: string, promo_price: number, promo_end_date: string) {
  const { data, error } = await supabase.from('products').update({ promo_price, promo_end_date }).eq('id', productId).select().single();
  if (error) throw error;
  return data;
}

export async function removeProductPromo(productId: string) {
  const { data, error } = await supabase.from('products').update({ promo_price: null, promo_end_date: null }).eq('id', productId).select().single();
  if (error) throw error;
  return data;
}

// ===== CRUD PRODUITS =====
export async function getAllProducts(): Promise<Products[]> {
  const { data, error } = await supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProducts).filter(Boolean) as Products[];
}

export async function createProducts(product: Omit<Products, 'id' | 'category' | 'reviews_count' | 'rating'>) {
  const { data, error } = await supabase.from('products').insert([product]).select().single();
  if (error) throw error;
  return data;
}

export async function updateProducts(id: string, updates: Partial<Products>) {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProducts(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ===== UPLOAD =====
export async function uploadProductsImages(file: File, p0: string): Promise<string> {
  const fileName = `products/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from("products").upload(fileName, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(data.path);
  return publicUrl;
}

// ===== GROUPAGE =====
export const createGroupage = async (data: Partial<Groupage>) => {
  const { data: d, error } = await supabase.from("groupages").insert([{
    product_id: data.product_id, 
    objectif_participants: data.objectif_participants,
    participants: data.participants || 1, 
    prix_groupe: data.prix_groupe,
    date_fin_groupage: data.date_fin_groupage, 
    active: true
  }]).select().single();
  if (error) throw error;
  return d;
};

// RECUPER LE GROUPAGE D'UN PRODUIT SPECIFIQUE
export async function getGroupageByProductsId(productId: string): Promise<Groupage | null> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('groupages')
    .select('*')
    .eq('product_id', productId)
    .eq('active', true)
    .gt('date_fin_groupage', now) // seulement si pas encore fini
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = "pas trouvé" c'est normal
    console.error("Erreur getGroupageByProductsId:", error); 
    return null 
  }
  return data;
}

// RECUPER TOUS LES GROUPAGES EN COURS POUR LA PAGE D'ACCUEIL
export async function getGroupagesEnCours() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('groupages')
    .select('*, products(*)') // on récupère aussi les infos du produit
    .eq('active', true)
    .gt('date_fin_groupage', now)
    .order('date_fin_groupage', { ascending: true });

  if (error) { console.error(error); return []; }
  
  return (data || [])
    .filter(g => g.participants < g.objectif_participants) // pas encore atteint
    .map(g => ({...g, products: mapProducts(g.products)}));
}
export const getActiveGroupages = getGroupagesEnCours; // alias


// ===== CATEGORIES =====
export async function getCategories(): Promise<Category[]> { const { data, error } = await supabase.from('categories').select('*').order('name'); if (error) throw error; return data || []; }
export async function createCategory(category: Omit<Category, 'id' | 'created_at'>) { const { data, error } = await supabase.from('categories').insert(category).select().single(); if (error) throw error; return data; }
export async function updateCategory(id: number, category: Partial<Category>) { const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single(); if (error) throw error; return data; }
export async function deleteCategory(id: number) { const { error } = await supabase.from('categories').delete().eq('id', id); if (error) throw error; }

// ===== SLIDERS =====
export const getSliders = async (): Promise<Slider[]> => { const { data } = await supabase.from("sliders").select("*").eq("is_active", true).order("display_order"); return data || []; };
export const getAllSlidersAdmin = async (): Promise<Slider[]> => { const { data } = await supabase.from("sliders").select("*").order("display_order"); return data || []; };
export const createSlider = async (slider: Omit<Slider, 'id'>) => { const { data, error } = await supabase.from("sliders").insert(slider).select().single(); if (error) throw error; return data; };
export const updateSlider = async (id: number, updates: Partial<Slider>) => { const { data, error } = await supabase.from("sliders").update(updates).eq("id", id).select().single(); if (error) throw error; return data; };
export const deleteSlider = async (id: number) => { const { error } = await supabase.from("sliders").delete().eq("id", id); if (error) throw error; };

export async function uploadSliderImage(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `sliders/${fileName}`  

  const { data, error } = await supabase.storage
    .from('images') // le nom de ton bucket
    .upload(filePath, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return publicUrl
}

export { supabase };

export async function searchProducts(query: string): Promise<Products[]> {
  if (!query || query.trim() === "") {
    return []
  }

  const { data, error } = await supabase
    .from('products') // le nom de ta table
    .select('*')
    .ilike('name', `%${query}%`) // recherche insensible à la casse
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error("Erreur searchProducts:", error)
    throw error
  }

  return data as Products[]
}