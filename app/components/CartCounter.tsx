"use client";
import { useCart } from "../context/CartContext";

export default function CartCounter() {
  const { totalItems } = useCart(); // on utilise totalItems maintenant
  if (totalItems === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {totalItems}
    </span>
  );
}