'use client'
import { useState } from 'react'
import { X, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '../app/lib/supabase'

export default function PopupConfirm({ isOpen, onClose, onSuccess, groupage }: any) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ nom: '', whatsapp: '' })

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (!form.nom ||!form.whatsapp) return alert('Veuillez remplir votre nom et WhatsApp')
    setLoading(true)
    try {
      const { error } = await supabase.from('participations').insert([{
        groupage_id: groupage.id, nom_client: form.nom, whatsapp: form.whatsapp, montant: groupage.price, statut: 'en_attente'
      }])
      if(error) throw error

      onSuccess() // <- AJOUTE AU PANIER
      const message = `Bonjour DUNAMIS, je veux rejoindre: ${groupage.title}. Nom: ${form.nom} - ${form.whatsapp}`
      window.open(`https://wa.me/22890667868?text=${encodeURIComponent(message)}`, '_blank') // METS TON NUM ICI

      setSuccess(true)
      setTimeout(() => { setSuccess(false); onClose(); setForm({ nom: '', whatsapp: '' }) }, 2000)
    } catch (err: any) { alert("Erreur: " + err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4"><X /></button>
        {success? <div className="text-center py-8"><CheckCircle size={48} className="text-green-500 mx-auto mb-4" /><h3 className="text-xl font-bold">Participation enregistrée!</h3></div> : (
          <>
            <h3 className="text-xl font-bold mb-2">Rejoindre: {groupage.title}</h3>
            <input type="text" placeholder="Votre Nom Complet" value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value })} className="w-full p-3 border rounded-lg mb-3 bg-gray-100 dark:bg-zinc-800"/>
            <input type="tel" placeholder="WhatsApp: 90XXXXXX" value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value })} className="w-full p-3 border rounded-lg mb-4 bg-gray-100 dark:bg-zinc-800"/>
            <button onClick={handleConfirm} disabled={loading} className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg flex justify-center gap-2 disabled:bg-gray-400">
              {loading && <Loader2 className="animate-spin" />} Confirmer et Contacter
            </button>
          </>
        )}
      </div>
    </div>
  )
}