"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Trash2, Save, Upload, Pencil, Eye, EyeOff, GripVertical } from "lucide-react";

export default function ManageSlides() {
  const [slides, setSlides] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ is_active: true, display_order: 0 });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchSlides() }, []);

  const fetchSlides = async () => {
    const { data } = await supabase.from("slides").select("*").order("display_order");
    setSlides(data || []);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fileName = `slide-${Date.now()}-${file.name}`;
    await supabase.storage.from("slides").upload(fileName, file);
    const { data: { publicUrl } } = await supabase.storage.from("slides").getPublicUrl(fileName);
    setForm({...form, image_url: publicUrl });
    setUploading(false);
  };

  const handleSave = async () => {
    if(!form.title ||!form.image_url) return alert("Titre et Image obligatoires");
    if(form.id) { await supabase.from("slides").update(form).eq("id", form.id); }
    else { await supabase.from("slides").insert({...form, display_order: slides.length }); }
    setForm({ is_active: true, display_order: 0 }); fetchSlides();
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Supprimer ce slide?")) return;
    await supabase.from("slides").delete().eq("id", id);
    fetchSlides();
  };

  const toggleActive = async (slide: any) => {
    await supabase.from("slides").update({ is_active:!slide.is_active }).eq("id", slide.id);
    fetchSlides();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Gérer Slider Accueil</h1>

      {/* FORMULAIRE */}
      <div className="p-6 border rounded-2xl bg-white dark:bg-zinc-900 mb-8 space-y-4">
        <h2 className="text-xl font-bold">{form.id? "Modifier" : "Ajouter"} un Slide</h2>

        <input placeholder="Titre principal" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-zinc-800"/>
        <input placeholder="Sous-titre" value={form.subtitle || ''} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-zinc-800"/>

        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Texte bouton ex: Acheter" value={form.button_text || ''} onChange={e => setForm({...form, button_text: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
          <input placeholder="Lien bouton ex: /catalogue" value={form.button_link || ''} onChange={e => setForm({...form, button_link: e.target.value})} className="p-3 border rounded-lg dark:bg-zinc-800"/>
        </div>

        <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg dark:bg-zinc-800 cursor-pointer">
          <Upload size={18}/> {uploading? "Upload..." : "Uploader une image 1920x600px"}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden"/>
        </label>
        {form.image_url && <img src={form.image_url} className="w-full h-40 rounded-lg object-cover"/>}

        <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})}/> Actif</label>

        <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800">
          <Save/> Enregistrer Slide
        </button>
      </div>

      {/* LISTE DES SLIDES */}
      <div className="space-y-4">
        {slides.map((s) => (
          <div key={s.id} className="p-4 border rounded-2xl bg-white dark:bg-zinc-900 flex gap-4 items-center">
            <GripVertical className="text-gray-400"/>
            <img src={s.image_url} className="w-32 h-20 rounded-lg object-cover"/>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.subtitle}</p>
            </div>
            <button onClick={() => toggleActive(s)} className={`p-2 rounded-lg ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              {s.is_active ? <Eye size={18}/> : <EyeOff size={18}/>}
            </button>
            <button onClick={() => setForm(s)} className="p-2 bg-gray-200 dark:bg-zinc-800 rounded-lg"><Pencil size={18}/></button>
            <button onClick={() => handleDelete(s.id)} className="p-2 bg-red-600 text-white rounded-lg"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  )
}