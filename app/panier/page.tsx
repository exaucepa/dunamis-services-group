"use client";
import { useState, useEffect } from "react";
import { getCart, removeFromCart, addToCart, clearCart } from ".././lib/cart";
import { formatPrice } from ".././lib/products";
import type { CartItem } from ".././lib/cart";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, Send } from "lucide-react";

export default function PanierPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

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
  const totalPrice = cart.reduce((sum, item) => sum + (item.promo_price || item.price) * item.quantity, 0);

  const increaseQty = (item: CartItem) => {
    addToCart(item);
  }

  const decreaseQty = (item: CartItem) => {
    if (item.quantity <= 1) {
      removeFromCart(item.id);
    } else {
      const { quantity, ...product } = item;
      removeFromCart(item.id);
      for (let i = 0; i < item.quantity - 1; i++) {
        addToCart(product);
      }
    }
    updateCart();
  }

  // FONCTION WHATSAPP AJOUTÉE
  const passerCommande = () => {
    if (cart.length === 0) return;
    
    const numero = "22890667868"; // <- REMPLACE PAR TON NUMÉRO WHATSAPP
    
    let message = `*NOUVELLE COMMANDE - DUNAMIS SERVICES* 👋\n\n`;
    message += `*Détails de la commande:*\n`;
    message += `--------------------------------\n`;
    
    cart.forEach((item, index) => {
      const prix = item.promo_price || item.price;
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Qté: ${item.quantity} | PU: ${formatPrice(prix)} FCFA\n`;
      message += `   Total: ${formatPrice(prix * item.quantity)} FCFA\n`;
    });
    
    message += `--------------------------------\n`;
    message += `*Sous-total:* ${formatPrice(totalPrice)} FCFA\n`;
    message += `*Livraison:* Gratuite\n`;
    message += `*TOTAL À PAYER:* ${formatPrice(totalPrice)} FCFA\n\n`;
    message += `Merci de me confirmer la commande.`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // Optionnel: vider le panier après envoi
    // clearCart();
    // updateCart();
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

        {/* REÇU REDESIGNÉ */}
        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-950 p-6 rounded-2xl shadow-lg border-blue-100 dark:border-zinc-800 h-fit sticky top-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ShoppingBag size={24} className="text-blue-700"/>
            Résumé de commande
          </h2>
          
          <div className="space-y-3 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Sous-total ({totalItems} articles)</span>
              <span className="font-semibold">{formatPrice(totalPrice)} FCFA</span>
            </div>
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
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg"
          >
            <Send size={18}/>
            Passer la commande via WhatsApp
          </button>
          <p className="text-xs text-center text-gray-500 mt-3">Vous serez redirigé vers WhatsApp</p>
        </div>
      </div>
    </div>
  );
}