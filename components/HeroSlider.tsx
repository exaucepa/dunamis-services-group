"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../app/lib/supabase";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  description: string; // on va mettre ça dans button_text pour l'instant
  image_url: string;
  button_text: string;
  button_link: string;
};

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase
       .from("slides")
       .select("*")
       .eq("is_active", true)
       .order("display_order");
      setSlides(data || []);
      setLoading(false);
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  if (loading) return <div className="h-[500px] bg-gray-200 animate-pulse" />; // skeleton
  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img src={slide.image_url} className="w-full h-full object-cover" alt={slide.title} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Contenu Texte */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            key={slide.id + "sub"}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-400 font-bold text-lg mb-2"
          >
            {slide.subtitle}
          </motion.h2>
          <motion.h1
            key={slide.id + "title"}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-4"
          >
            {slide.title}
          </motion.h1>
          <motion.p
            key={slide.id + "desc"}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-200 text-lg max-w-xl mb-8"
          >
            {slide.description || "Découvrez nos produits"}
          </motion.p>
          <motion.div
            key={slide.id + "btn"}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link href={slide.button_link} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition">
              {slide.button_text}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Flèches */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white">
            <ChevronLeft />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white">
            <ChevronRight />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition ${i === current ? "bg-blue-500 w-8" : "bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}