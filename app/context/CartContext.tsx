"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // <-- important pour les stats
import { type Product } from "../lib/products";

type CartItem = Product & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Charger depuis localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const trackCartEvent = async (productId: string) => {
    // On log pour les stats "Produits Phares"
    await supabase.from('cart_events').insert({
      product_id: productId,
      event_type: 'add_to_cart'
    });
  }

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id? {...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {...product, quantity: 1 }];
    });

    // On envoie l'event pour les stats mais sans bloquer l'UI
    trackCartEvent(product.id);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id!== id));
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((total, item) => {
    // Si promo_price existe on prend promo, sinon prix normal
    const price = item.promo_price && item.promo_price > 0? item.promo_price : item.price;
    return total + price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};