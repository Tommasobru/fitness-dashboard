"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isWorkoutActive } from "@/lib/workoutStorage";

export default function ActiveWorkoutIndicator() {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Controlla se c'è un allenamento attivo
    setIsActive(isWorkoutActive());

    // Listener per aggiornare quando cambia lo storage
    const handleStorageChange = () => {
      setIsActive(isWorkoutActive());
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event per aggiornamenti nello stesso tab
    window.addEventListener("workoutUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("workoutUpdated", handleStorageChange);
    };
  }, []);

  if (!isActive) return null;

  const handleClick = () => {
    router.push("/workout-session");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-6 right-6 z-[9999] w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-all animate-pulse hover:animate-none cursor-pointer"
      style={{ pointerEvents: 'auto' }}
      aria-label="Continua allenamento attivo"
      title="Hai un allenamento in corso"
    >
      <svg
        className="w-7 h-7 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {/* Pulse ring */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping pointer-events-none" />
    </button>
  );
}
