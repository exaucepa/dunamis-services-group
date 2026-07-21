import { supabase } from "./supabase";

// 1. CORRECTION: description doit être string, pas ReactNode
export type Category = {
  id: string; 
  name: string; 
  slug: string; 
  description: string | null; // <- corrigé
  image: string | null; 
  created_at: string; 
};

const createSlug = (name: string) => 
  name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export const getAllCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data || [];
};

// 2. CORRECTION: on accepte maintenant un objet avec description
export const createCategory = async (category: { name: string; description: string; image: string | null }) => {
  const { data, error } = await supabase.from("categories").insert([{ 
    name: category.name, 
    description: category.description, // <- on l'ajoute
    slug: createSlug(category.name), 
    image: category.image 
  }]).select().single();
  if (error) throw error;
  return data;
};

export const uploadCategoryImage = async (file: File): Promise<string> => {
  const fileName = `categories/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from("categories").upload(fileName, file);
  if (uploadError) throw uploadError;
  return supabase.storage.from("categories").getPublicUrl(fileName).data.publicUrl;
};