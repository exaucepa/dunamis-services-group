export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-600 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 py-24 lg:flex-row">
        
        {/* Texte */}
        <div className="max-w-xl">
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
            🚀 Bienvenue chez DUNAMIS SERVICES GROUP
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight">
            Les meilleurs accessoires électroniques,
            <span className="block text-cyan-300">
              au meilleur prix.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-200">
            Découvrez notre sélection d'accessoires électroniques,
            d'outils pour techniciens, de kits Arduino et bien plus,
            avec une livraison rapide partout au Togo.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-xl bg-white px-6 py-3 font-bold text-blue-900 hover:scale-105 transition">
              Acheter maintenant
            </button>

            <button className="rounded-xl border border-white px-6 py-3 font-bold hover:bg-white hover:text-blue-900 transition">
              Voir le catalogue
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img
            src="/hero.png"
            alt="Produit"
            className="w-[500px] drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}