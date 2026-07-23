import type { Products } from "./products";

export type CartItem = Products & { quantity: number };

const CART_KEY = "cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated')); // <- IMPORTANT POUR HEADER
}

export function addToCart(product: Products) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({...product, quantity: 1 });
  }
  saveCart(cart);
}

export function getCartCount(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}