'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCartCount } from "../app/lib/cart"; // CORRIGÉ LE CHEMIN

export default function CartCounter() {
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());
    
    updateCount(); // charge au démarrage
    
    // écoute quand le panier change depuis ProductCard
    window.addEventListener('cartUpdated', updateCount);
    return () => window.removeEventListener('cartUpdated', updateCount);
  }, []);

  if (cartCount === 0) return null;

  return (
    <motion.span
      initial={{ scale:0 }}
      animate={{ scale:1 }}
      transition={{ type:"spring", stiffness:400, damping:10 }}
      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white"
    >
      {cartCount}
    </motion.span>
  );
}