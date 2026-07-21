import Header from "../../components/Header"
import Footer from "../../components/Footer"
import FeaturedProducts from "../../components/FeaturedProducts";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Header />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-10 text-center text-4xl font-extrabold text-blue-900 dark:text-blue-400">
            Notre Catalogue
          </h1>
          <FeaturedProducts />
        </div>
      </section>
      <Footer />
    </main>
  );
}