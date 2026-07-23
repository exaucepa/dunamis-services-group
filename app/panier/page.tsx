"use client";
import { useState, useEffect } from "react";
import { getCart, removeFromCart, addToCart, clearCart } from ".././lib/cart";
import { formatPrice } from ".././lib/products";
import type { CartItem } from ".././lib/cart";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

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
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const increaseQty = (item: CartItem) => {
    addToCart(item); // addToCart gère déjà +1
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
            <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg"/>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-500">{formatPrice(item.promo_price || item.price)} FCFA</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => increaseQty(item)} className="p-1 border rounded"><Plus size={16}/></button>
                  <span className="font-bold px-2">{item.quantity}</span>
                  <button onClick={() => decreaseQty(item)} className="p-1 border rounded"><Minus size={16}/></button>
                </div>
              </div>
              <button onClick={() => { removeFromCart(item.id); updateCart() }} className="text-red-500 hover:text-red-700">
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow h-fit">
          <h2 className="text-2xl font-bold mb-4">Résumé</h2>
          <div className="flex justify-between mb-2">
            <span>Sous-total</span>
            <span>{formatPrice(totalPrice)} FCFA</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Livraison</span>
            <span>Gratuite</span>
          </div>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)} FCFA</span>
            </div>
          </div>
          <button onClick={() => { clearCart(); updateCart(); alert("Commande envoyée sur WhatsApp!") }} 
            className="w-full block text-center bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
            Passer la commande
          </button>
        </div>
      </div>
    </div>
  );
}