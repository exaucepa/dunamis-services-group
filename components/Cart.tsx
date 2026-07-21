"use client";
import { useState } from "react";
import { supabase } from "../app/lib/supabase";
import { X, Tag } from "lucide-react";
import Link from "next/link";

// Simule le panier. Plus tard on le mettra dans un Context
const fakeCart = [
  { id: 1, name: "Iphone 15", price: 800000, qty: 1 },
  { id: 2, name: "Chargeur", price: 15000, qty: 2 },
]

export default function Cart() {
  const [cart] = useState(fakeCart);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = subtotal - discount;

  const applyCoupon = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase()).eq('is_active', true).single();

    if(error ||!data) return alert("Code invalide");
    if(data.expires_at && new Date(data.expires_at) < new Date()) return alert("Code expiré");
    if(subtotal < data.min_order_value) return alert(`Panier minimum: ${data.min_order_value} FCFA`);

    let calculatedDiscount = 0;
    if(data.discount_type === 'percent') calculatedDiscount = subtotal * (data.discount_value / 100);
    else calculatedDiscount = data.discount_value;

    setDiscount(calculatedDiscount);
    setAppliedCoupon(data);
    setLoading(false);
    alert(`Coupon appliqué: -${calculatedDiscount.toLocaleString()} FCFA`);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Mon Panier</h2>

      {/* LISTE PRODUITS */}
      <div className="space-y-4 mb-6">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between">
            <p>{item.name} x{item.qty}</p>
            <p className="font-bold">{(item.price * item.qty).toLocaleString()} FCFA</p>
          </div>
        ))}
      </div>

      {/* CHAMP COUPON */}
      <div className="border-t border-b py-4 mb-4">
        <p className="font-bold mb-2 flex items-center gap-2"><Tag size={16}/> Code Promo</p>
        <div className="flex gap-2">
          <input
            value={couponCode}
            onChange={e => setCouponCode(e.target.value)}
            placeholder="DUNAMIS30"
            className="flex-1 p-3 border rounded-lg dark:bg-zinc-800"
            disabled={!!appliedCoupon}
          />
          <button onClick={applyCoupon} disabled={loading ||!!appliedCoupon} className="bg-gray-800 text-white px-5 rounded-lg disabled:bg-gray-400">
            {loading? "..." : "Appliquer"}
          </button>
        </div>
        {appliedCoupon && <p className="text-green-600 text-sm mt-2">Coupon {appliedCoupon.code} appliqué ✅</p>}
      </div>

      {/* TOTAUX */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between"><span>Sous-total</span><span>{subtotal.toLocaleString()} FCFA</span></div>
        {discount > 0 && <div className="flex justify-between text-green-600"><span>Remise</span><span>-{discount.toLocaleString()} FCFA</span></div>}
        <div className="flex justify-between font-bold text-xl border-t pt-2"><span>Total</span><span>{total.toLocaleString()} FCFA</span></div>
      </div>

      <Link href="/checkout" className="w-full block text-center bg-blue-700 text-white py-4 rounded-xl font-bold">
        Passer la commande
      </Link>
    </div>
  )
}