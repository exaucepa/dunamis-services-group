"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Settings, Save, Smartphone, Database, CreditCard } from "lucide-react";

type Settings = {
  id: number;
  site_name: string;
  order_mode: 'whatsapp' | 'database';
  whatsapp_number: string;
  enable_flooz: boolean;
  enable_mixx: boolean;
  cinetpay_api_key: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. CHARGER LES PARAMÈTRES
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      setSettings(data);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  // 2. SAUVEGARDER
  const handleSave = async () => {
    if(!settings) return;
    setSaving(true);
    const { error } = await supabase.from('settings').update(settings).eq('id', 1);
    if(error) alert("Erreur: " + error.message);
    else alert("Paramètres sauvegardés ✅");
    setSaving(false);
  }

  if(loading) return <p>Chargement...</p>;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8"><Settings/> Paramètres du Site</h1>

        <div className="space-y-6">
          
          {/* BLOC 1: MODE COMMANDE */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Smartphone/> Mode de Commande</h2>
            <p className="text-sm text-gray-500 mb-4">Choisis comment les clients passent commande</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setSettings(prev => prev ? {...prev, order_mode: 'whatsapp'} : prev)}
                className={`flex-1 p-4 border-2 rounded-xl ${settings?.order_mode === 'whatsapp' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
              >
                <p className="font-bold">WhatsApp</p>
                <p className="text-sm">Commandes via WhatsApp</p>
              </button>
              <button 
                onClick={() => setSettings(prev => prev ? {...prev, order_mode: 'database'} : prev)}
                className={`flex-1 p-4 border-2 rounded-xl ${settings?.order_mode === 'database' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <p className="font-bold">Base de données</p>
                <p className="text-sm">Checkout + Paiement en ligne</p>
              </button>
            </div>

            {settings?.order_mode === 'whatsapp' && (
              <input 
                value={settings.whatsapp_number} 
                onChange={e => setSettings(prev => prev ? {...prev, whatsapp_number: e.target.value} : prev)}
                placeholder="Numéro WhatsApp: 22890XXXXXX" 
                className="w-full p-3 border rounded-lg mt-4"
              />
            )}
          </div>

          {/* BLOC 2: PAIEMENT EN LIGNE */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><CreditCard/> Paiement Mobile Money</h2>
            <p className="text-sm text-gray-500 mb-4">Uniquement si Mode = Base de données</p>
            
            <label className="flex items-center gap-3 mb-3">
              <input type="checkbox" checked={settings?.enable_flooz || false} onChange={e => setSettings(prev => prev ? {...prev, enable_flooz: e.target.checked} : prev)} />
              <span className="font-bold">Activer Flooz</span>
            </label>
            <label className="flex items-center gap-3 mb-4">
              <input type="checkbox" checked={settings?.enable_mixx || false} onChange={e => setSettings(prev => prev ? {...prev, enable_mixx: e.target.checked} : prev)} />
              <span className="font-bold">Activer MIXX by YAS</span>
            </label>

            <input 
              value={settings?.cinetpay_api_key || ''} 
              onChange={e => setSettings(prev => prev ? {...prev, cinetpay_api_key: e.target.value} : prev)}
              placeholder="Clé API CinetPay - Gère Flooz + MIXX" 
              className="w-full p-3 border rounded-lg"
            />
            <p className="text-xs text-gray-400 mt-1">Conseil: Utilise CinetPay pour gérer les 2 en 1</p>
          </div>

          {/* BOUTON SAUVEGARDER */}
          <button onClick={handleSave} disabled={saving} className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:bg-gray-400">
            <Save/> {saving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </button>

        </div>
      </div>
      <Footer />
    </main>
  )
}