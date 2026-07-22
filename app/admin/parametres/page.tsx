"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

type Parametres = {
  id: number;
  nom_site: string;
  logo_url: string;
  whatsapp_admin: string;
  mot_de_passe_admin: string;
};

export default function AdminParametres() {
  const [params, setParams] = useState<Parametres | null>(null);
  const [loading, setLoading] = useState(true); // <-- true au début
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if(localStorage.getItem("isAdmin")!== "true") router.push("/admin");
    fetchParams();
  }, [router]);

  const fetchParams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
       .from("parametres")
       .select("*")
       .eq("id", 1)
       .single();

      if (error && error.code!== 'PGRST116') { // PGRST116 = 0 ligne trouvée
        throw error;
      }

      if(data) {
        setParams(data);
      } else {
        // Si pas de ligne, on crée des valeurs par défaut pour débloquer
        setParams({
          id: 1,
          nom_site: "DUNAMIS",
          logo_url: "/logo.png",
          whatsapp_admin: "22890667868",
          mot_de_passe_admin: "admin123"
        })
      }
    } catch(err: any) {
      setMessage("❌ Erreur: " + err.message);
    }
    setLoading(false); // <-- CORRIGÉ: on arrête toujours le chargement
  }

  const sauverParams = async () => {
    if(!params) return;
    setSaving(true);
    setMessage("");
    try {
      const { error } = await supabase
       .from("parametres")
       .upsert(params) // <-- upsert au lieu de update. Ça crée si ça n'existe pas
       .eq("id", 1);

      if(error) throw error;
      setMessage("✅ Paramètres enregistrés avec succès!");
    } catch(err: any) {
      setMessage("❌ Erreur: " + err.message);
    }
    setSaving(false);
  }

  if(loading) return (
    <div className="p-12 text-center flex justify-center items-center gap-2">
      <Loader2 className="animate-spin"/> Chargement...
    </div>
  )

  if(!params) return <div className="p-12 text-center text-red-500">Impossible de charger les paramètres</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/admin/dashboard" className="flex items-center gap-2 mb-6 text-purple-600"><ArrowLeft size={18}/> Retour Dashboard</Link>
      <h1 className="text-3xl font-bold mb-6">Paramètres du Site</h1>

      {message && (
        <div className={`p-3 rounded-lg mb-4 ${message.includes("✅")? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow space-y-4">
        <div>
          <label className="font-bold">Nom du Site</label>
          <input value={params.nom_site} onChange={e => setParams({...params, nom_site: e.target.value})} className="w-full p-3 border rounded-lg mt-1 dark:bg-zinc-800"/>
        </div>
        <div>
          <label className="font-bold">URL du Logo</label>
          <input value={params.logo_url} onChange={e => setParams({...params, logo_url: e.target.value})} placeholder="/logo.png" className="w-full p-3 border rounded-lg mt-1 dark:bg-zinc-800"/>
        </div>
        <div>
          <label className="font-bold">Numéro WhatsApp Admin</label>
          <input value={params.whatsapp_admin} onChange={e => setParams({...params, whatsapp_admin: e.target.value})} className="w-full p-3 border rounded-lg mt-1 dark:bg-zinc-800"/>
          <p className="text-xs text-gray-500">Format: 228XXXXXXXX. Ce numéro sera utilisé pour les messages WhatsApp</p>
        </div>
        <div>
          <label className="font-bold">Mot de passe Admin</label>
          <input type="password" value={params.mot_de_passe_admin} onChange={e => setParams({...params, mot_de_passe_admin: e.target.value})} className="w-full p-3 border rounded-lg mt-1 dark:bg-zinc-800"/>
        </div>
        <button onClick={sauverParams} disabled={saving} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50">
          <Save size={18}/> {saving? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}