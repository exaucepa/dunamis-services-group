"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";
import { useState } from "react";

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginModal({
  open,
  onClose,
  onSuccess,
}: AdminLoginModalProps) {

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN_PASSWORD = "DUNAMIS2026";


  const handleLogin = () => {

    if (!password) {
      setError("Veuillez entrer le mot de passe");
      return;
    }


    if (password === ADMIN_PASSWORD) {

      setError("");
      setPassword("");

      onClose();
      onSuccess();

    } else {

      setError("Mot de passe incorrect");

    }

  };


  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (e.key === "Enter") {
      handleLogin();
    }

  };


  return (

    <AnimatePresence>

      {open && (

        <>

          {/* Fond */}
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />


          {/* Fenêtre */}
          <motion.div

            initial={{
              opacity:0,
              scale:0.85,
              y:-40
            }}

            animate={{
              opacity:1,
              scale:1,
              y:0
            }}

            exit={{
              opacity:0,
              scale:0.85,
              y:-40
            }}

            transition={{
              duration:0.3
            }}

            className="fixed left-1/2 top-1/2 z-[70] w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl"

          >


            {/* Titre */}

            <div className="mb-6 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <Lock size={24}/>
                </div>


                <h2 className="text-xl font-bold">
                  Administration
                </h2>

              </div>


              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X/>
              </button>


            </div>



            <p className="mb-5 text-sm text-gray-500">
              Connectez-vous pour gérer les produits, stocks,
              catégories et publicités.
            </p>



            <input

              type="password"

              value={password}

              onChange={(e)=>{
                setPassword(e.target.value);
                setError("");
              }}

              onKeyDown={handleKeyDown}

              placeholder="Mot de passe administrateur"

              className="mb-3 w-full rounded-xl border p-3 outline-none focus:border-blue-700"

            />



            {error && (

              <p className="mb-3 text-sm text-red-600">
                {error}
              </p>

            )}



            <motion.button

              whileHover={{
                scale:1.03
              }}

              whileTap={{
                scale:0.96
              }}

              onClick={handleLogin}

              className="w-full rounded-xl bg-blue-700 py-3 font-bold text-white hover:bg-blue-800"

            >

              Se connecter

            </motion.button>



          </motion.div>


        </>

      )}

    </AnimatePresence>

  );
}