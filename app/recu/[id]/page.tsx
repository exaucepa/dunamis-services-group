"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { formatPrice } from "../../lib/products";
import { CheckCircle, Download, Loader } from "lucide-react";
import { text } from "stream/consumers";

type Participation = {
  id: string;
  cree_le: string;
  client_nom: string;
  client_telephone: string;
  methode_paiement: string;
  montant_paye: number;
  statut: string;
  groupages: {
    products: {
      name: string;
    }
  }
};

export default function RecuPage() {
  const { id } = useParams();
  const [recu, setRecu] = useState<Participation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecu = async () => {
      const { data } = await supabase
      .from("participations")
      .select("*, groupages(products(name))")
      .eq("id", id)
      .single();
      setRecu(data);
      setLoading(false);
    };
    fetchRecu();
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin"/></div>;
  if (!recu) return <div className="text-center py-20">Reçu introuvable</div>;

  const date = new Date(recu.cree_le).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 py-12">
      <div id="recu-pdf" className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg">
        {/* HEADER */}
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-purple-700">DUNAMIS SHOP</h1>
          <p className="text-sm">Lomé, Togo - WhatsApp: +228 90 66 78 68</p>
        </div>

        {/* STATUT */}
        <div className={`text-center p-4 rounded-lg mb-6 ${recu.statut === 'paye'? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          <CheckCircle className="mx-auto mb-2"/>
          <p className="font-bold text-lg">
            {recu.statut === 'paye'? 'PAIEMENT VALIDÉ' : 'EN ATTENTE DE VALIDATION'}
          </p>
        </div>

        {/* INFOS */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between"><span>N° Reçu:</span> <b>{recu.id.slice(0, 8).toUpperCase()}</b></div>
          <div className="flex justify-between"><span>Date:</span> <b>{date}</b></div>
          <div className="flex justify-between"><span>Client:</span> <b>{recu.client_nom}</b></div>
          <div className="flex justify-between"><span>Téléphone:</span> <b>{recu.client_telephone}</b></div>
        </div>

        {/* PRODUIT */}
        <div className="border-t border-b py-4 my-4">
          <div className="flex justify-between mb-2"><span>Produit:</span> <b>{recu.groupages.products.name}</b></div>
          <div className="flex justify-between mb-2"><span>Mode Paiement:</span> <b>{recu.methode_paiement}</b></div>
          <div className="flex justify-between text-xl font-bold text-purple-700"><span>Total Payé:</span> <b>{formatPrice(recu.montant_paye)} FCFA</b></div>
        </div>

        <p className="text-center text-sm text-gray-500">Merci pour votre confiance. DUNAMIS SHOP</p>
      </div>

      {/* BOUTON IMPRIMER */}
      <div className="text-center mt-6 print:hidden">
        <button onClick={handlePrint} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto">
          <Download size={20}/> Télécharger / Imprimer le reçu
        </button>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #recu-pdf, #recu-pdf * { visibility: visible; }
          #recu-pdf { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}