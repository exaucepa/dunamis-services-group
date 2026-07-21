"use client";
import { useState } from "react";
import HeroSliderManager from "./HeroSliderManager";
import FeaturedProductsManager from "./FeaturedProductsManager";

export default function AdsPage() {
  const [tab, setTab] = useState("slider");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gérer les Publicités</h1>
      
      <div className="flex border-b mb-6">
        <button onClick={() => setTab("slider")} className={`p-3 font-bold ${tab === "slider"? "border-b-2 border-orange-500 text-orange-500" : ""}`}>
          1. Slider Hero
        </button>
        <button onClick={() => setTab("featured")} className={`p-3 font-bold ${tab === "featured"? "border-b-2 border-orange-500 text-orange-500" : ""}`}>
          2. Produits Promo
        </button>
      </div>

      {tab === "slider" && <HeroSliderManager />}
      {tab === "featured" && <FeaturedProductsManager />}
    </div>
  )
}