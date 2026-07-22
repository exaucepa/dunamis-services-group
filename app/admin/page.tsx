"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

const ADMIN_PASSWORD = "dunamis2026"; // <-- Change ce mot de passe

export default function AdminLogin() {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if(pass === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin/dashboard");
    } else setError("Mot de passe incorrect");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg">
        <Lock size={40} className="mx-auto text-red-600 mb-4"/>
        <h1 className="text-2xl font-bold text-center mb-6">Accès Administration</h1>
        <input type="password" placeholder="Mot de passe" value={pass} onChange={e => setPass(e.target.value)} className="border p-3 rounded-lg w-full mb-4 dark:bg-zinc-800" />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button onClick={handleLogin} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700">Entrer</button>
      </div>
    </div>
  )
}