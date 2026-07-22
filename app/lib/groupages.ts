import { supabase } from "./supabase";

export interface Groupage {
  id: string;
  product_id: string;
  title: string;
  objectif_participants: number;
  current_quantity: number;
  prix_groupe: number;
  date_fin_groupage: string;
  statut: 'recrutement' | 'commande_fournisseur' | 'en_transit' | 'arrivee_togo' | 'livraison';
  created_at: string;
  product?: any;
}

// 1. RÉCUPÉRER TOUS LES GROUPAGES ACTIFS POUR L'ACCUEIL
export async function getActiveGroupages(): Promise<Groupage[]> {
  const { data, error } = await supabase
    .from("groupages")
    .select('*, product:products(*)') // Sans !inner pour ne pas crasher si 1 produit manque
    .in("statut", ["recrutement", "commande_fournisseur", "en_transit"])
    .order("created_at", { ascending: false });

  if (error) { 
    console.error("Erreur getActiveGroupages:", error.message); 
    return []; 
  }
  return (data as Groupage[]) || [];
}

// 2. RÉCUPÉRER 1 SEUL GROUPAGE POUR LA PAGE DETAIL
export async function getGroupageById(id: string): Promise<Groupage | null> {
  const { data, error } = await supabase
    .from("groupages")
    .select('*, product:products(*)')
    .eq("id", id)
    .single();

  if (error) { 
    console.error("Erreur getGroupageById:", error.message); 
    return null; 
  }
  return data as unknown as Groupage | null;
}

// 3. TEXTE POUR AFFICHER LE STATUT
export function getStatutText(statut: Groupage['statut']): string {
  switch (statut) {
    case 'recrutement': return "Recrutement en cours";
    case 'commande_fournisseur': return "Commande passée au fournisseur";
    case 'en_transit': return "En route vers le Togo 🚢";
    case 'arrivee_togo': return "Arrivé à Lomé. Préparation livraison";
    case 'livraison': return "En cours de livraison";
    default: return "Statut inconnu";
  }
}

// 4. POURCENTAGE POUR LA BARRE DE PROGRESSION DU STATUT
export function getStatutProgress(statut: Groupage['statut']): number {
  switch (statut) {
    case 'recrutement': return 20;
    case 'commande_fournisseur': return 40;
    case 'en_transit': return 70;
    case 'arrivee_togo': return 90;
    case 'livraison': return 100;
    default: return 0;
  }
}

// 5. FONCTION POUR QU'UN CLIENT REJOIGNE UN GROUPAGE
export async function rejoindreGroupage(groupageId: string, currentQuantity: number) {
  const { data, error } = await supabase
    .from("groupages")
    .update({ current_quantity: currentQuantity + 1 })
    .eq("id", groupageId)
    .select()
    .single();
  if (error) throw error;
  return data;
}