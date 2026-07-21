"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-50" />
          <motion.div initial={{ x:"100%" }} animate={{ x:0 }} exit={{ x:"100%" }} transition={{ type:"spring", damping:25 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-zinc-900 z-50 shadow-2xl flex-col">
            <div className="flex items-center justify-between p-6 border-b"><h2 className="text-2xl font-bold">Votre Panier</h2><button onClick={onClose}><X size={24}/></button></div>
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0? <p className="text-center text-gray-500 mt-10">Votre panier est vide</p> :
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 mb-6">
                  <img src={item.image} className="w-20 h-20 rounded-lg object-cover"/>
                  <div className="flex-1">
                    <p className="font-bold">{item.name}</p><p className="text-blue-600 font-bold">{item.price.toLocaleString()} FCFA</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 border rounded"><Minus size={14}/></button>
                      <span className="font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 border rounded"><Plus size={14}/></button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-500"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && <div className="p-6 border-t"><div className="flex justify-between text-xl font-bold mb-4"><span>Total</span><span>{cartTotal.toLocaleString()} FCFA</span></div><Link href="/checkout" onClick={onClose} className="w-full block text-center bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800">Passer la commande</Link></div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}