"use client";

import { useState } from "react";
import PlanCarouselCard from "./PlanCarouselCard";
import { getActivePlans } from "@/lib/mockData";

export default function PlansCarousel() {
  const plans = getActivePlans();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dati mock per progresso e workout
  const planStats = [
    { progress: 65, daysLeft: 12, workoutsThisWeek: 3, totalWorkoutsWeek: 4 },
    { progress: 30, daysLeft: 42, workoutsThisWeek: 2, totalWorkoutsWeek: 4 }
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? plans.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === plans.length - 1 ? 0 : prev + 1));
  };

  if (plans.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)]">
        <p className="text-[var(--text-muted)] text-center">
          Nessuna scheda attiva
        </p>
      </div>
    );
  }

  // Mostra 2 schede alla volta su desktop, 1 su mobile
  const visiblePlans = plans.length === 1
    ? [plans[0]]
    : [
        plans[currentIndex],
        plans[(currentIndex + 1) % plans.length]
      ];

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Schede Attive
        </h2>
        <div className="flex items-center gap-2">
          {/* Freccia sinistra */}
          <button
            onClick={handlePrevious}
            disabled={plans.length <= 1}
            className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 border border-[var(--border)] hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Scheda precedente"
          >
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Freccia destra */}
          <button
            onClick={handleNext}
            disabled={plans.length <= 1}
            className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 border border-[var(--border)] hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Scheda successiva"
          >
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carosello cards */}
      <div className="relative overflow-hidden mb-4">
        <div
          className="flex transition-transform duration-300 ease-out gap-4"
          style={{
            transform: `translateX(-${(currentIndex % plans.length) * 0}%)`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {visiblePlans.map((plan, idx) => {
              const actualIndex = (currentIndex + idx) % plans.length;
              const stats = planStats[actualIndex] || planStats[0];

              return (
                <PlanCarouselCard
                  key={plan.id}
                  plan={plan}
                  progress={stats.progress}
                  daysLeft={stats.daysLeft}
                  workoutsThisWeek={stats.workoutsThisWeek}
                  totalWorkoutsWeek={stats.totalWorkoutsWeek}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Indicatori pagination */}
      {plans.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          {plans.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-8 bg-[var(--primary)]"
                  : "w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
              }`}
              aria-label={`Vai alla scheda ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
