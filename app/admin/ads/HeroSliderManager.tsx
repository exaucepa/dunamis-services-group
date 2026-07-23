"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { uploadProductsImages } from "../../lib/products";

export default function HeroSliderManager() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    link: "https://wa.me/228", // j'ai renommé button_link en link
    file: null as File | null
  });

  useEffect(() => { fetchSlides() }, []);

  const fetchSlides = async () => {
    const { data } = await supabase.from("hero_slides").select("*").order("id"); // on order par id car t'as pas "order"
    setSlides(data || []);
  }

  const handleAdd = async () => {
    if(!form.file) return alert("Ajoute une image");
    setLoading(true);
    try {
      const image_url = await uploadProductsImages(form.file, "hero_slides");
      const { error } = await supabase.from("hero_slides").insert([{
        title: form.title,
        subtitle: form.subtitle,
        image_url,
        link: form.link, // on insère le link
        is_active: true
      }]);
      if(error) throw error;
      setForm({ title: "", subtitle: "", link: "https://wa.me/228", file: null });
      fetchSlides();
      alert("Slide ajouté!");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Supprimer ce slide?")) return;
    await supabase.from("hero_slides").delete().eq("id", id);
    fetchSlides();
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ajouter un Slide Hero</h2>
      <div className="grid gap-3 mb-6 p-4 border rounded-lg bg-gray-50">
        <input type="file" accept="image/*" onChange={e => setForm({...form, file: e.target.files?.[0] || null})} className="border p-2 rounded" />
        <input placeholder="Titre" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Sous-titre" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Lien du bouton WhatsApp" value={form.link} onChange={e => setForm({...form, link: e.target.value})} className="border p-2 rounded" />
        <button onClick={handleAdd} disabled={loading} className="bg-orange-500 text-white p-2 rounded font-bold disabled:opacity-50">
          {loading? "Upload en cours..." : "Ajouter au Slider"}
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Slides Actuels</h2>
      <div className="grid gap-2">
        {slides.map(s => (
          <div key={s.id} className="flex items-center gap-4 border p-3 rounded bg-white">
            <img src={s.image_url} className="w-32 h-20 object-cover rounded" />
            <div>
              <p className="font-bold">{s.title}</p>
              <p className="text-sm text-gray-600">{s.subtitle}</p>
              <a href={s.link} target="_blank" className="text-blue-500 text-xs">{s.link}</a>
            </div>
            <button onClick={() => handleDelete(s.id)} className="ml-auto text-red-500 font-bold">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  )
}