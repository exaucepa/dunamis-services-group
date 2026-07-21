"use client";
import { useEffect, useState } from "react";

export function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(endDate).getTime() - new Date().getTime();
      if (diff <= 0) { setTimeLeft("Terminé"); clearInterval(timer); return; }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      setTimeLeft(`${d}j ${h}h ${m}m`);
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return <div className="text-red-500 text-xs font-bold mt-1">Fin dans: {timeLeft}</div>;
}