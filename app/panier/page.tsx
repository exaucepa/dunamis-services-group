"use client";
import { useState, useEffect } from "react";
import { getCart, removeFromCart, addToCart, clearCart } from ".././lib/cart";
import { formatPrice } from ".././lib/products";
import type { CartItem } from ".././lib/cart";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, Send, Ticket } from "lucide-react";
import { supabase } from ".././lib/supabase";

export default function PanierPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSending, setIsSending] = useState(false);

  // NOUVEAU: ÉTATS POUR CODE PROMO
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [promoError, setPromoError] = useState("");
  const [loadingPromo, setLoadingPromo] = useState(false);

  const updateCart = () => setCart(getCart());

  useEffect(() => {
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    window.addEventListener('storage', updateCart);
    return () => {
      window.removeEventListener('cartUpdated', updateCart);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.promo_price || item.price) * item.quantity, 0);
  
  // NOUVEAU: CALCUL AVEC RÉDUCTION
  const discountValue = discountType === 'percent' ? (subtotal * discount / 100) : discount;
  const totalPrice = Math.max(0, subtotal - discountValue);

  const increaseQty = (item: CartItem) => { addToCart(item); }
  const decreaseQty = (item: CartItem) => {
    if (item.quantity <= 1) { removeFromCart(item.id); } 
    else {
      const { quantity, ...product } = item;
      removeFromCart(item.id);
      for (let i = 0; i < item.quantity - 1; i++) { addToCart(product); }
    }
    updateCart();
  }

  // NOUVEAU: APPLIQUER CODE PROMO
  const applyPromo = async () => {
    if(!promoCode) return;
    setLoadingPromo(true);
    setPromoError("");
    setDiscount(0);
    
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', promoCode.toUpperCase())
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      setPromoError("Code promo invalide ou expiré");
    } else if (data.usage_limit && data.used_count >= data.usage_limit) {
      setPromoError("Ce code a atteint sa limite d'utilisation");
    } else {
      if (data.discount_percent) {
        setDiscount(data.discount_percent);
        setDiscountType('percent');
      } else {
        setDiscount(data.discount_amount);
        setDiscountType('amount');
      }
      setPromoError("");
    }
    setLoadingPromo(false);
  };

  const passerCommande = async () => {
    if (cart.length === 0 || isSending) return;
    setIsSending(true);
    
    const numero = "22890667868";
    
    try {
      const { data: newOrder, error } = await supabase
        .from('orders')
        .insert([{
          items: cart,
          subtotal: subtotal, // AJOUT
          discount: discountValue, // AJOUT
          promo_code: promoCode || null, // AJOUT
          total: totalPrice,
          payment_status: 'pending',
          order_status: 'pending',
        }])
        .select()
        .single()

      if(error || !newOrder) throw new Error("Erreur Supabase");

     // INCRÉMENTER L'UTILISATION DU CODE
if(promoCode && discount > 0) {
  const { data: promo } = await supabase.from('promo_codes').select('used_count').eq('code', promoCode.toUpperCase()).single();
  if(promo) {
    await supabase.from('promo_codes').update({ used_count: promo.used_count + 1 }).eq('code', promoCode.toUpperCase());
  }
}

      const orderId = newOrder.id;
      const orderNumber = newOrder.order_number || orderId.slice(0,8);

      let message = "NOUVELLE COMMANDE - DUNAMIS SERVICES 👋\n\n";
      message += `ID COMMANDE: ${orderId}\n`;
      message += `N°: ${orderNumber}\n`;
      if(promoCode) message += `CODE PROMO: ${promoCode.toUpperCase()}\n\n`;
      message += "Détails de la commande:\n";
      message += "--------------------------------\n";
      
      cart.forEach((item, index) => {
        const prix = item.promo_price || item.price;
        message += `${index + 1}. ${item.name}\n`;
        message += `   Qté: ${item.quantity} | PU: ${formatPrice(prix)} FCFA\n`;
        message += `   Total: ${formatPrice(prix * item.quantity)} FCFA\n`;
      });
      
      message += "--------------------------------\n";
      message += `Sous-total: ${formatPrice(subtotal)} FCFA\n`;
      if(discountValue > 0) message += `Réduction: -${formatPrice(discountValue)} FCFA\n`;
      message += "Livraison: Gratuite\n";
      message += `TOTAL À PAYER: ${formatPrice(totalPrice)} FCFA\n\n`;
      message += "Merci de me confirmer la commande.";

      const url = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');

    } catch (err) {
      alert("Erreur lors de l'enregistrement de la commande");
      console.error(err)
    } finally {
      setIsSending(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 mb-6">Ajoutez des produits pour commencer</p>
        <Link href="/" className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800">
          Retour aux achats
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-8">Votre Panier ({totalItems} articles)</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border-gray-100 dark:border-zinc-800">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg"/>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-blue-700 dark:text-blue-400 font-semibold">{formatPrice(item.promo_price || item.price)} FCFA</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => decreaseQty(item)} className="p-1.5 border rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"><Minus size={14}/></button>
                  <span className="font-bold px-2">{item.quantity}</span>
                  <button onClick={() => increaseQty(item)} className="p-1.5 border rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"><Plus size={14}/></button>
                </div>
              </div>
              <button onClick={() => { removeFromCart(item.id); updateCart() }} className="text-red-500 hover:text-red-700 p-2">
                <Trash2 size={20}/>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-950 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-zinc-800 h-fit sticky top-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ShoppingBag size={24} className="text-blue-700"/>
            Résumé de commande
          </h2>

          {/* NOUVEAU BLOC CODE PROMO PRO */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border-gray-200 dark:border-zinc-800">
            <label className="font-semibold text-sm flex items-center gap-2 mb-2"><Ticket size={16}/> Code promo</label>
            <div className="flex gap-2">
              <input 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="ETE2026"
                className="flex-1 p-2 text-sm border rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button onClick={applyPromo} disabled={loadingPromo} className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 text-sm rounded-lg font-bold hover:opacity-90 disabled:opacity-50">
                {loadingPromo ? '...' : 'OK'}
              </button>
            </div>
            {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
            {discount > 0 && <p className="text-green-600 text-xs mt-1 font-bold">✓ Réduction appliquée</p>}
          </div>
          
          <div className="space-y-3 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Sous-total ({totalItems} articles)</span>
              <span className="font-semibold">{formatPrice(subtotal)} FCFA</span>
            </div>
            {discountValue > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Réduction</span>
                <span className="font-semibold">- {formatPrice(discountValue)} FCFA</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Livraison</span>
              <span className="font-semibold text-green-600">Gratuite</span>
            </div>
          </div>

          <div className="border-t border-dashed pt-4 mb-6">
            <div className="flex justify-between text-2xl font-extrabold text-blue-700 dark:text-blue-400">
              <span>Total</span>
              <span>{formatPrice(totalPrice)} FCFA</span>
            </div>
          </div>

          <button 
            onClick={passerCommande}
            disabled={isSending}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <Send size={18}/>
            {isSending ? "Envoi..." : "Passer la commande via WhatsApp"}
          </button>
          <p className="text-xs text-center text-gray-500 mt-3">Vous serez redirigé vers WhatsApp</p>
        </div>
      </div>
    </div>
  );
}