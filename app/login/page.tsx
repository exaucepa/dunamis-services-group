"use client"
import { useState } from "react"
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push("/admin"); // redirige vers dashboard après login
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion Admin</h1>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-3 w-full mb-4 rounded" required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="border p-3 w-full mb-4 rounded" required />
        <button disabled={loading} className="w-full bg-black text-white p-3 rounded font-bold">
          {loading? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  )
}