"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "../lib/products" // <-- CORRIGÉ LE CHEMIN

type CartItem = Product & { quantity: number }

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  orderSingleProduct: (product: Product) => void
  total: number
  totalPrice: number
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) setCart(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const exist = prev.find(p => p.id === product.id)
      if (exist) {
        return prev.map(p => p.id === product.id? {...p, quantity: p.quantity + quantity } : p)
      }
      return [...prev, {...product, quantity }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(p => p.id!== id)) // <-- FIX ICI
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id)
    setCart(prev => prev.map(p => p.id === id? {...p, quantity } : p))
  }

  const clearCart = () => setCart([])

  const orderSingleProduct = (product: Product) => {
    setCart([{...product, quantity: 1 }])
    router.push("/checkout")
  }

  const totalPrice = cart.reduce((sum, item) => sum + (item.promo_price || item.price) * item.quantity, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, orderSingleProduct,
      total: totalPrice, totalPrice, totalItems
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => { // <-- FIX ICI: plus de paramètre
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}