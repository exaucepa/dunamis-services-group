import { ShieldCheck, Truck, Headphones, BadgeCheck } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Produits de qualité",
    description:
      "Nous sélectionnons des produits fiables et testés pour garantir votre satisfaction.",
  },
  {
    icon: Truck,
    title: "Livraison rapide",
    description:
      "Livraison partout au Togo dans les meilleurs délais.",
  },
  {
    icon: Headphones,
    title: "Support 7j/7",
    description:
      "Notre équipe reste disponible pour répondre à toutes vos questions.",
  },
  {
    icon: BadgeCheck,
    title: "Paiement sécurisé",
    description:
      "Achetez en toute confiance avec un processus de commande simple et sécurisé.",
  },
];

export default function Benefits() {
  return (
    <section className="bg-slate-100 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-extrabold">
          Pourquoi choisir DUNAMIS ?
        </h2>

        <p className="mt-4 text-center text-gray-500">
          Une expérience d'achat simple, rapide et professionnelle.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
              >
                <Icon className="mb-6 h-12 w-12 text-blue-700" />

                <h3 className="mb-4 text-xl font-bold">
                  {item.title}
                </h3>

                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}