"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Upload, Eye, EyeOff, GripVertical, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  getAllSlidersAdmin, // <- on prend tout pour l'admin
  createSlider,
  deleteSlider,
  updateSlider,
  uploadSliderImage, // <- la bonne fonction
  type Slider
} from "../../lib/products";

export default function ManageSlides() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slider[]>([]);
  const [form, setForm] = useState<Partial<Slider>>({ is_active: true, title: "", subtitle: "", link: "/catalogue", image: "" });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if(localStorage.getItem("isAdmin")!== "true") router.push("/admin");
    fetchSlides()
  }, [router]);

  const fetchSlides = async () => {
    try {
      const data = await getAllSlidersAdmin(); // <- on utilise la version admin
      setSlides(data || []);
    } catch(err: any) {
      alert("Erreur chargement slides: " + err.message)
    }
  }

  const showMessage = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(""), 3000) }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadSliderImage(file); // <- la bonne fonction
      if(!publicUrl) throw new Error("Upload échoué");
      setForm({...form, image: publicUrl });
      showMessage("✅ Image uploadée");
    } catch(err: any) {
      alert("Erreur upload image: " + err.message);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if(!form.title ||!form.image) return alert("Titre et Image obligatoires");
    setLoading(true);
    try {
      await createSlider({
        title: form.title,
        subtitle: form.subtitle || "",
        image: form.image,
        link: form.link || "/catalogue",
        is_active: form.is_active?? true,
        display_order: slides.length + 1
      });
      showMessage("✅ Slide ajouté");
      setForm({ is_active: true, title: "", subtitle: "", link: "/catalogue", image: "" });
      fetchSlides();
    } catch(err: any) {
      alert("Erreur: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Supprimer ce slide?")) return;
    try {
      await deleteSlider(id);
      showMessage("🗑️ Slide supprimé");
      fetchSlides();
    } catch(err: any) {
      alert("Erreur suppression: " + err.message);
    }
  };

  const toggleActive = async (slide: Slider) => {
    try {
      await updateSlider(slide.id, { is_active:!slide.is_active });
      showMessage(slide.is_active? "👁️ Slide désactivé" : "✅ Slide activé");
      fetchSlides();
    } catch(err: any) {
      alert("Erreur: " + err.message);
      console.error(err);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <Link href="/admin/dashboard" className="flex gap-2 items-center hover:text-blue-600"><ArrowLeft size={20} /> Retour</Link>
        <h1 className="text-3xl font-bold">Gérer Slider</h1>
      </div>
      {message && <div className={`p-3 rounded-lg mb-4 ${message.includes("✅") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

      <div className="p-6 border dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 mb-8 space-y-4">
        <h2 className="text-xl font-bold">Ajouter un Slide</h2>
        <input placeholder="Titre principal" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-zinc-800" required/>
        <input placeholder="Sous-titre" value={form.subtitle || ''} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-zinc-800"/>
        <input placeholder="Lien bouton ex: /catalogue" value={form.link || ''} onChange={e => setForm({...form, link: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-zinc-800"/>

        <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg dark:bg-zinc-800 cursor-pointer">
          <Upload size={18}/> {uploading? <><Loader2 className="animate-spin" size={18}/> Upload...</> : "Uploader une image 1920x600px"}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading}/>
        </label>
        {form.image && <img src={form.image} className="w-full h-40 rounded-lg object-cover border"/>}

        <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})}/> Actif</label>

        <button onClick={handleSave} disabled={loading || uploading} className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 disabled:opacity-50">
          <Save/> {loading? "Enregistrement..." : "Enregistrer Slide"}
        </button>
      </div>

      {slides.length === 0? (
        <div className="text-center py-10 text-gray-500">Aucun slide. Ajoute-en un avec le formulaire ci-dessus.</div>
      ) : (
        <div className="space-y-4">
          {slides.map((s) => (
            <div key={s.id} className="p-4 border dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 flex gap-4 items-center">
              <GripVertical className="text-gray-400"/>
              <img src={s.image} className="w-32 h-20 rounded-lg object-cover"/>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.subtitle}</p>
              </div>
              <button onClick={() => toggleActive(s)} className={`p-2 rounded-lg ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-zinc-800'}`}>
                {s.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button onClick={() => handleDelete(s.id)} className="p-2 bg-red-600 text-white rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
     )
}