import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      <Header />

      <section className="bg-blue-950 py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">

          <h1 className="text-5xl font-extrabold">
            À propos de DUNAMIS SERVICES GROUP
          </h1>

          <p className="mt-6 text-lg text-gray-200">
            Une entreprise orientée technologie, innovation et solutions
            digitales.
          </p>

        </div>
      </section>


      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">

          <h2 className="text-3xl font-bold text-blue-900">
            Notre histoire
          </h2>

          <p className="mt-5 leading-relaxed text-gray-700">
            DUNAMIS SERVICES GROUP est une entreprise fondée en 2026
            avec pour ambition de proposer des solutions technologiques
            modernes, accessibles et fiables.

            <br />
            <br />

            Nous sommes spécialisés dans la vente d'accessoires
            électroniques, d'outils pour techniciens, de kits Arduino,
            de solutions d'apprentissage technologique et de services
            liés à l'innovation.
          </p>

        </div>
      </section>


      <section className="bg-white py-16">

        <div className="mx-auto max-w-5xl px-6">

          <h2 className="text-3xl font-bold text-blue-900">
            Le fondateur
          </h2>


          <div className="mt-8 rounded-3xl bg-gray-100 p-8 shadow">

            <h3 className="text-2xl font-extrabold">
              ATCHAMADO K.M. PAVLOV
            </h3>


            <p className="mt-2 font-bold text-cyan-600">
              Fondateur & CEO
            </p>


            <p className="mt-5 leading-relaxed text-gray-700">
              Passionné par la technologie, l'innovation et
              l'entrepreneuriat, ATCHAMADO K.M. PAVLOV a fondé
              DUNAMIS SERVICES GROUP en 2026 avec une vision :
              construire une entreprise capable de rapprocher
              les solutions technologiques des utilisateurs.
            </p>


          </div>

        </div>

      </section>



      <section className="py-16">

        <div className="mx-auto max-w-5xl px-6">

          <h2 className="text-3xl font-bold text-blue-900">
            Nos valeurs
          </h2>


          <div className="mt-8 grid gap-6 md:grid-cols-3">


            <div className="rounded-2xl bg-white p-6 shadow">

              <h3 className="text-xl font-bold">
                Service client
              </h3>

              <p className="mt-3 text-gray-600">
                La satisfaction de nos clients est au centre de nos actions.
              </p>

            </div>



            <div className="rounded-2xl bg-white p-6 shadow">

              <h3 className="text-xl font-bold">
                Qualité
              </h3>

              <p className="mt-3 text-gray-600">
                Nous privilégions des produits fiables et adaptés.
              </p>

            </div>



            <div className="rounded-2xl bg-white p-6 shadow">

              <h3 className="text-xl font-bold">
                Innovation
              </h3>

              <p className="mt-3 text-gray-600">
                Nous recherchons constamment de nouvelles solutions.
              </p>

            </div>


          </div>

        </div>

      </section>


      <Footer />

    </main>
  );
}