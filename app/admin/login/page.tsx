"use client";
import { useState, useEffect } from "react"; // <-- ajoute useEffect
import { useRouter } from "next/navigation";

const ADMIN_PASSWORD = "dunamis2026"; // change ce mdp

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Si déjà connecté, on renvoie direct vers /admin
  useEffect(() => {
    if (localStorage.getItem("isAdminLoggedIn") === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true");
      router.push("/admin");
    } else {
      setError("Mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-950 p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-4 text-4xl">🔒</div>
        <h1 className="text-2xl font-bold mb-2 text-center">Accès Administration</h1>
        <p className="text-gray-500 text-center mb-6">Entrez le mot de passe</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full p-3 border rounded mb-4 dark:bg-zinc-900"
          placeholder="Mot de passe"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700"
        >
          Entrer
        </button>
      </div>
    </div>
  );
}