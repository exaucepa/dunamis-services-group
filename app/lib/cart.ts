// app/lib/cart.ts

import type { Product } from "./products";

export type CartItem = Product & { quantity: number };

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
}

export function addToCart(product: Product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += 1; else cart.push({ ...product, quantity: 1 });
  saveCart(cart);
}

export function getCartCount(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}