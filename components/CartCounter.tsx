'use client'
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function CartCounter() {
  const { cartCount } = useCart();
  
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