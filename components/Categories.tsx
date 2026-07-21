const categories = [
  {
    title: "Accessoires électroniques",
    image: "/categories/accessoires.jpg",
  },
  {
    title: "Outils de techniciens",
    image: "/categories/outils.jpg",
  },
  {
    title: "Arduino & Robotique",
    image: "/categories/arduino.jpg",
  },
  {
    title: "Formations",
    image: "/categories/formation.jpg",
  },
];

export default function Categories() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-4">
          Nos catégories
        </h2>

        <p className="text-center text-gray-500 mb-12">
          Découvrez notre catalogue de produits et services.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className="overflow-hidden rounded-3xl shadow-lg group cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.title}
                className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold">
                  {category.title}
                </h3>

                <button className="mt-4 text-blue-700 font-semibold">
                  Découvrir →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}