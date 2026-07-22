"use client";
import { useState, useEffect } from "react";

export default function Timer({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(date).getTime() - new Date().getTime();
      if (diff <= 0) return setTimeLeft("Expiré");

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      setTimeLeft(`${days}j ${hours}h ${minutes}m`);
    };
    calculate();
    const interval = setInterval(calculate, 60000); // maj chaque minute
    return () => clearInterval(interval);
  }, [date]);

  return <span>{timeLeft}</span>;
}