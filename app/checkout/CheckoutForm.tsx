"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../lib/supabase";
import { User, Phone, MapPin, CreditCard, Lock } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const total = Number(searchParams.get('total')) || 0;
  const discount = Number(searchParams.get('discount')) || 0;
  const coupon = searchParams.get('coupon') || '';
  const { cartItems, clearCart } = require("../../context/CartContext").useCart(); // on récupère le panier

  const [settings, setSettings] = useState<any>(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).single().then(({data}) => setSettings(data));
  }, []);

  const handlePayment = async (method: 'flooz' | 'mixx') => {
    if(!form.name || !form.phone || !form.address) { alert("Remplis tous les champs"); return; }
    setLoading(true);

    // 1. ON CRÉE D'ABORD LA COMMANDE EN BDD EN "EN ATTENTE"
    const order_number = `DUN-${Date.now()}`;
    const { data: customer } = await supabase.from('customers').insert({ name: form.name, phone: form.phone, address: form.address }).select().single();
    
    const { data: order } = await supabase.from('orders').insert({
      order_number,
      customer_id: customer.id,
      items: cartItems,
      subtotal: total + discount,
      discount,
      coupon_code: coupon,
      total,
      payment_method: method
    }).select().single();

    // 2. ON APPELLE CINETPAY
    const cinetpayData = {
      apikey: settings.cinetpay_api_key,
      site_id: "YOUR_SITE_ID", // Tu auras ça sur CinetPay
      transaction_id: order.id,
      amount: total,
      currency: 'XOF',
      channels: method === 'flooz' ? 'FLOOZ' : 'MIXX',
      description: `Commande ${order_number}`,
      return_url: `${window.location.origin}/commande/${order.id}`,
      notify_url: `${window.location.origin}/api/cinetpay-webhook`, // pour la notif auto
    };

    // Pour le test on redirige vers la page de paiement CinetPay
    const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cinetpayData)
    });
    const result = await response.json();

    if(result.code === '201') {
      window.location.href = result.data.payment_url; // Redirection vers paiement
    } else {
      alert("Erreur paiement: " + result.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* FORMULAIRE CLIENT */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">1. Tes informations</h2>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nom complet" className="w-full p-3 border rounded-lg mb-3"/>
            <div className="flex gap-2 mb-3"><Phone size={20} className="mt-3"/><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Téléphone: 22890XXXXXX" className="flex-1 p-3 border rounded-lg"/></div>
            <div className="flex gap-2"><MapPin size={20} className="mt-3"/><textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Adresse de livraison: Lomé, Agoè" className="flex-1 p-3 border rounded-lg"/></div>
          </div>

          {/* RÉCAP + PAIEMENT */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">2. Paiement</h2>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between"><span>Sous-total</span><span>{(total + discount).toLocaleString()} FCFA</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Remise</span><span>-{discount.toLocaleString()} FCFA</span></div>}
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{total.toLocaleString()} FCFA</span></div>
            </div>

            {settings?.enable_flooz && (
              <button onClick={() => handlePayment('flooz')} disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold mb-3 disabled:bg-gray-400">
                {loading ? "Redirection..." : "Payer avec Flooz"}
              </button>
            )}
            {settings?.enable_mixx && (
              <button onClick={() => handlePayment('mixx')} disabled={loading} className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold disabled:bg-gray-400">
                {loading ? "Redirection..." : "Payer avec MIXX by YAS"}
              </button>
            )}
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Lock size={12}/> Paiement sécurisé par CinetPay</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}