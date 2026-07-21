import Link from "next/link";
import { PhoneCall, Mail, MapPinned } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                D
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  DUNAMIS
                </h2>

                <p className="text-sm text-gray-400">
                  SERVICES GROUP
                </p>
              </div>
            </div>

            <p className="leading-7 text-gray-400">
              Votre partenaire de confiance pour les accessoires électroniques,
              les outils de techniciens, les kits Arduino, les formations
              techniques la Maintenance  et Diagnostic des Équipements Motorisés
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Navigation
            </h3>

            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-white">
                  Accueil
                </Link>
              </li>

              <li>
                <Link href="/catalogue" className="hover:text-white">
                  Catalogue
                </Link>
              </li>

              <li>
                <Link href="/categories" className="hover:text-white">
                  Catégories
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-white">
                  À propos
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Nos Services
            </h3>

            <ul className="space-y-3">
              <li>Accessoires électroniques</li>
              <li>Outils de techniciens</li>
              <li>Kits Arduino</li>
              <li>Robotique</li>
              <li>Service maintenance auto</li>
              
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Contact
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <PhoneCall size={18} />
                <span>+228 90 66 78 68 </span>
              </div>

              <div className="flex items-center gap-3">
                <FaWhatsapp size={18} />
                <span>WhatsApp</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>contact@dunamisgroup.com</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPinned size={18} />
                <span>Lomé, Togo</span>
              </div>

            </div>

            <div className="mt-8 flex gap-4">

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/10 p-3 transition hover:bg-blue-600"
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/10 p-3 transition hover:bg-pink-600"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="https://wa.me/22890667868"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/10 p-3 transition hover:bg-green-600"
              >
                <FaWhatsapp size={20} />
              </a>

            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-gray-500">
          © {year} DUNAMIS SERVICES GROUP. Tous droits réservés.
        </div>

      </div>
    </footer>
  );
}