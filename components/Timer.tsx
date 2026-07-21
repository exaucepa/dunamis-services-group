"use client";
import { useState, useEffect } from "react";

export default function Timer({ date }: { date: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(date).getTime() - new Date().getTime();
      if (diff <= 0) return setTime("Terminé");
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      setTime(`${d}j ${h}h ${m}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, );
  return <span className="font-bold text-red-600">{time}</span>;
}