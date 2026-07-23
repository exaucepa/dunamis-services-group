"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getCart, addToCart, removeFromCart, clearCart } from "../../app/lib/cart"; // <- BON CHEMIN
import type { CartItem } from "../../app/lib/cart";
import { Plus, Minus, Trash2, Tag, XCircle } from "lucide-react"; 
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; 
import Link from "next/link";


export default function CartPage() {
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // <- STATE LOCAL

  // AJOUT 1: STATE POUR LE MODE COMMANDE
  const [orderMode, setOrderMode] = useState<'whatsapp' | 'database'>('whatsapp');
  const [settings, setSettings] = useState<any>(null);

  // AJOUT 2: STATE POUR LE COUPON
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const updateCart = () => setCartItems(getCart()); // <- FONCTION MAJ

  useEffect(() => {
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    window.addEventListener('storage', updateCart);

    // AJOUT 3: CHARGER LE MODE DEPUIS SUPABASE AU CHARGEMENT
    const fetchMode = async () => {
      const { data } = await supabase.from('settings').select('order_mode, whatsapp_number').eq('id', 1).single();
      if(data) {
        setOrderMode(data.order_mode);
        setSettings(data);
      }
    }
    fetchMode();

    return () => {
      window.removeEventListener('cartUpdated', updateCart);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0); // <- CALCUL LOCAL
  const total = subtotal - discount;

  const increaseQty = (item: CartItem) => {
    addToCart(item);
  }

  const decreaseQty = (item: CartItem) => {
    if (item.quantity <= 1) {
      removeFromCart(item.id)
    } else {
      // hack pour décrémenter avec cart.ts
      removeFromCart(item.id)
      addToCart({ ...item, quantity: item.quantity - 1 } as CartItem)
    }
  }

  const applyCoupon = async () => {
    if(!couponCode) return;
    setLoading(true);
    const { data, error } = await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase()).eq('is_active', true).single();

    if(error || !data) { alert("Code invalide"); setLoading(false); return; }
    if(data.expires_at && new Date(data.expires_at) < new Date()) { alert("Code expiré"); setLoading(false); return; }
    if(subtotal < data.min_order_value) { alert(`Panier minimum: ${data.min_order_value.toLocaleString()} FCFA`); setLoading(false); return; }

    let calculatedDiscount = 0;
    if(data.discount_type === 'percent') calculatedDiscount = subtotal * (data.discount_value / 100);
    else calculatedDiscount = data.discount_value;

    setDiscount(calculatedDiscount);
    setAppliedCoupon(data);
    setLoading(false);
  }

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
  }

  const handleWhatsAppOrder = () => {
    let message = `Bonjour, je souhaite commander :\n\n`;
    cartItems.forEach(item => {
      message += `- ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} FCFA\n`;
    });
    message += `\nSous-total: ${subtotal.toLocaleString()} FCFA`;
    if(discount > 0) message += `\nRemise ${appliedCoupon?.code}: -${discount.toLocaleString()} FCFA`;
    message += `\n*Total: ${total.toLocaleString()} FCFA*`;

    // AJOUT 4: ON PREND LE NUMERO DEPUIS SETTINGS
    const phone = settings?.whatsapp_number || "22890667868"; // fallback
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`  ;
    window.open(whatsappUrl, '_blank');
    clearCart(); // vide le panier après commande
    updateCart();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-10">Mon panier 🛒</h1>

          {cartItems.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 shadow text-center"><p className="text-gray-600 text-lg">Votre panier est vide.</p></div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((product)=> (
                <div key={product.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow">
                  <div className="flex items-center gap-5">
                    <img src={product.image} alt={product.name} className="h-20 w-20 object-contain" />
                    <div>
                      <h2 className="font-bold text-xl">{product.name}</h2>
                      <p className="text-blue-700 font-bold">{product.price.toLocaleString()} FCFA</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => decreaseQty(product)} className="p-1 border rounded-lg hover:bg-gray-100"><Minus size={16} /></button>
                        <span className="font-bold">{product.quantity}</span>
                        <button onClick={() => increaseQty(product)} className="p-1 border rounded-lg hover:bg-gray-100"><Plus size={16} /></button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { removeFromCart(product.id); updateCart() }} className="rounded-xl bg-red-600 px-4 py-2 text-white font-bold flex items-center gap-2"><Trash2 size={16}/> Supprimer</button>
                </div>
              ))}

              {/* BLOC CODE PROMO */}
              <div className="rounded-2xl bg-white p-5 shadow">
                <p className="font-bold mb-3 flex items-center gap-2"><Tag size={18}/> Code Promo</p>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Entrez votre code: DUNAMIS30" className="flex-1 p-3 border rounded-lg uppercase" />
                    <button onClick={applyCoupon} disabled={loading} className="bg-gray-800 text-white px-5 rounded-lg font-bold disabled:bg-gray-400">{loading ? "..." : "Appliquer"}</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                    <p className="text-green-700 font-bold">Coupon {appliedCoupon.code} appliqué ✅</p>
                    <button onClick={removeCoupon} className="text-red-500 flex items-center gap-1"><XCircle size={16}/> Supprimer</button>
                  </div>
                )}
              </div>

              {/* RECAP AVEC REMISE */}
              <div className="rounded-2xl bg-white p-5 shadow space-y-2">
                <div className="flex justify-between"><span>Sous-total</span><span className="font-bold">{subtotal.toLocaleString()} FCFA</span></div>
                {discount > 0 && (<div className="flex justify-between text-green-600"><span>Remise {appliedCoupon.code}</span><span className="font-bold">- {discount.toLocaleString()} FCFA</span></div>)}
                <div className="flex justify-between border-t pt-2 text-lg"><span className="font-bold">Total</span><span className="font-bold text-blue-700">{total.toLocaleString()} FCFA</span></div>
              </div>

              {/* AJOUT 5: BOUTON DYNAMIQUE SELON LE MODE */}
              {orderMode === 'whatsapp' ? (
                <button onClick={handleWhatsAppOrder} className="w-full rounded-xl bg-green-600 py-4 text-white font-bold text-lg hover:bg-green-700">
                  Commander tout sur WhatsApp
                </button>
              ) : (
                <Link href={`/checkout?total=${total}&discount=${discount}&coupon=${appliedCoupon?.code || ''}`} className="w-full block text-center bg-blue-700 py-4 text-white font-bold text-lg rounded-xl hover:bg-blue-800">
                  Passer la commande
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}