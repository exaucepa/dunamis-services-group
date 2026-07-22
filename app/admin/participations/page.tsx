"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { formatPrice } from "../../lib/products";
import { Lock, LogOut, CheckCircle, Clock } from "lucide-react";

const ADMIN_PASSWORD = "dunamis2025"; // <-- CHANGE CE MOT DE PASSE

type Participation = {
  id: string;
  client_nom: string;
  client_telephone: string;
  methode_paiement: string;
  montant_paye: number;
  statut: string;
  cree_le: string;
  groupages: { products: { name: string } }
};

export default function AdminParticipations() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [liste, setListe] = useState<Participation[]>([]);
  const [filtre, setFiltre] = useState<"tout" | "en_attente" | "paye">("en_attente");

  useEffect(() => {
    if(isLoggedIn) fetchListe();
  }, [isLoggedIn, filtre]);

  const handleLogin = () => {
    if(password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem("dunamis_admin", "true");
    } else alert("Mauvais mot de passe");
  }

  useEffect(() => {
    if(localStorage.getItem("dunamis_admin") === "true") setIsLoggedIn(true);
  }, [])

  const fetchListe = async () => {
    let query = supabase.from("participations").select("*, groupages(products(name))").order("cree_le", { ascending: false });
    if(filtre !== "tout") query = query.eq("statut", filtre);
    
    const { data } = await query;
    setListe(data || []);
  }

  const validerEtEnvoyer = async (p: Participation) => {
    await supabase.from("participations").update({ statut: 'paye' }).eq("id", p.id);

    const lienRecu = `${window.location.origin}/recu/${p.id}`;
    const message = `Bonjour ${p.client_nom} ! ✅ Votre paiement de ${formatPrice(p.montant_paye)} FCFA pour "${p.groupages.products.name}" a été validé.\n\nVoici votre reçu officiel DUNAMIS:\n${lienRecu}\n\nMerci pour votre confiance !`;
    
    window.open(`https://wa.me/${p.client_telephone}?text=${encodeURIComponent(message)}`, '_blank');
    fetchListe();
  }

  const compteur = {
    en_attente: liste.filter(l => l.statut === 'en_attente').length,
    paye: liste.filter(l => l.statut === 'paye').length,
    total: liste.length
  }

  if(!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <Lock className="mx-auto mb-4 text-purple-600" size={40}/>
          <h1 className="text-xl font-bold text-center mb-4">Admin DUNAMIS</h1>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="w-full p-3 border rounded-lg mb-4"/>
          <button onClick={handleLogin} className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold">Se connecter</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Validations Paiements</h1>
        <button onClick={() => {setIsLoggedIn(false); localStorage.removeItem("dunamis_admin")}} className="flex items-center gap-2 text-red-500"><LogOut size={18}/> Déconnexion</button>
      </div>

      {/* COMPTEUR */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-100 p-4 rounded-xl"><p className="text-sm">En attente</p><p className="text-2xl font-bold flex items-center gap-2"><Clock size={20}/>{compteur.en_attente}</p></div>
        <div className="bg-green-100 p-4 rounded-xl"><p className="text-sm">Validé</p><p className="text-2xl font-bold flex items-center gap-2"><CheckCircle size={20}/>{compteur.paye}</p></div>
        <div className="bg-purple-100 p-4 rounded-xl"><p className="text-sm">Total</p><p className="text-2xl font-bold">{compteur.total}</p></div>
      </div>

      {/* FILTRE */}
      <div className="flex gap-2 mb-6">
        {["tout", "en_attente", "paye"].map(f => (
          <button key={f} onClick={() => setFiltre(f as any)} className={`px-4 py-2 rounded-lg font-bold ${filtre === f? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
            {f === 'tout'? 'Tout' : f === 'en_attente'? 'En attente' : 'Validé'}
          </button>
        ))}
      </div>

      {/* LISTE */}
      <div className="space-y-4">
        {liste.map(p => (
          <div key={p.id} className="border dark:border-zinc-800 p-4 rounded-xl flex justify-between items-center bg-white dark:bg-zinc-900">
            <div>
              <p className="font-bold">{p.client_nom} - {p.client_telephone}</p>
              <p className="text-sm">{p.groupages.products.name} - {formatPrice(p.montant_paye)} FCFA</p>
              <p className="text-xs text-gray-500">Paiement: {p.methode_paiement}</p>
              <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${p.statut === 'paye'? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{p.statut}</span>
            </div>
            
            {p.statut !== 'paye' && (
              <button onClick={() => validerEtEnvoyer(p)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700">
                Valider & Envoyer Reçu
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}