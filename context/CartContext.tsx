"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartItems: CartItem[]; // ALIAS 1 pour la page
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void; // ALIAS 2 pour la page
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
  getTotalPrice: () => number; // ALIAS 3 pour la page
  orderSingleProduct: (item: Omit<CartItem, "quantity">) => void;
  orderCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const WHATSAPP_NUMBER = "22890667868";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((current) => {
      const existing = current.find((p) => p.id === item.id);
      if (existing) {
        return current.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id: string) => {
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // NOUVELLE FONCTION pour la page
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((current) =>
        current.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // NOUVELLE FONCTION pour la page
  const getTotalPrice = () => totalPrice;

  const orderSingleProduct = (item: Omit<CartItem, "quantity">) => {
    const message = `Bonjour DUNAMIS SERVICES GROUP,%0A%0AJe souhaite commander :%0A📦 ${item.name}%0A💰 Prix : ${item.price.toLocaleString()} FCFA`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const orderCart = () => {
    if (cart.length === 0) return;
    let message =
      "Bonjour DUNAMIS SERVICES GROUP,%0A%0AJe souhaite commander :%0A%0A";
    cart.forEach((item) => {
      message += `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} FCFA%0A`;
    });
    message +=` %0A💰 Total estimé : ${totalPrice.toLocaleString()} FCFA`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart, // ALIAS
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity, // NOUVEAU
        clearCart,
        cartCount,
        totalPrice,
        getTotalPrice, // NOUVEAU
        orderSingleProduct,
        orderCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans CartProvider");
  }
  return context;
}
