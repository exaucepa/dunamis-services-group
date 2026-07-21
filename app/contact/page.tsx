import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-4xl font-extrabold text-blue-900">
          Contact
        </h1>

        <p className="mt-6 text-gray-700">
          Nous sommes à votre disposition pour toute question concernant nos produits et services.
        </p>

        <div className="mt-10 rounded-2xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold">DUNAMIS SERVICES GROUP</h2>

          <p className="mt-4">
            📱 WhatsApp : +228 90 66 78 68
          </p>

          <p className="mt-2">
            📍 Lomé - Togo
          </p>

          <a
            href="https://wa.me/22890667868"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
          >
            Contacter sur WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}