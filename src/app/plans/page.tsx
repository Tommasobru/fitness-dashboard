"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import SchemaEditor, { Plan } from "@/components/SchemaEditor";

const initialPlans: Plan[] = [
  {
    id: "1",
    name: "Forza - Fase 1",
    description: "Programma di 4 settimane per aumentare la forza massimale",
    weeks: 4,
    daysPerWeek: 4,
    exercises: [
      { id: "ex1", name: "Squat", sets: 5, reps: "5", weight: "80 kg" },
      { id: "ex2", name: "Panca piana", sets: 5, reps: "5", weight: "60 kg" },
      { id: "ex3", name: "Stacco da terra", sets: 5, reps: "5", weight: "100 kg" },
      { id: "ex4", name: "Military press", sets: 4, reps: "6-8", weight: "40 kg" },
    ],
  },
  {
    id: "2",
    name: "Ipertrofia",
    description: "Programma per la crescita muscolare con alto volume",
    weeks: 8,
    daysPerWeek: 5,
    exercises: [
      { id: "ex5", name: "Lat machine", sets: 4, reps: "10-12", weight: "50 kg" },
      { id: "ex6", name: "Curl bilanciere", sets: 3, reps: "12-15", weight: "25 kg" },
      { id: "ex7", name: "Leg press", sets: 4, reps: "12-15", weight: "120 kg" },
      { id: "ex8", name: "Croci ai cavi", sets: 3, reps: "15", weight: "15 kg" },
    ],
  },
  {
    id: "3",
    name: "Full Body",
    description: "Allenamento completo per principianti",
    weeks: 6,
    daysPerWeek: 3,
    exercises: [
      { id: "ex9", name: "Goblet squat", sets: 3, reps: "12", weight: "16 kg" },
      { id: "ex10", name: "Push-up", sets: 3, reps: "10-15", weight: "Corpo" },
      { id: "ex11", name: "Rematore manubrio", sets: 3, reps: "12", weight: "14 kg" },
    ],
  },
  {
    id: "4",
    name: "Push Pull Legs",
    description: "Classica divisione PPL per intermedi",
    weeks: 12,
    daysPerWeek: 6,
    exercises: [
      { id: "ex12", name: "Panca inclinata", sets: 4, reps: "8-10", weight: "50 kg" },
      { id: "ex13", name: "Trazioni", sets: 4, reps: "8-10", weight: "Corpo" },
      { id: "ex14", name: "Leg curl", sets: 4, reps: "10-12", weight: "40 kg" },
      { id: "ex15", name: "Dips", sets: 3, reps: "10-12", weight: "Corpo" },
    ],
  },
];

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [activePlanId, setActivePlanId] = useState<string>("1");

  const handleOpenModal = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  const handleSavePlan = (updatedPlan: Plan) => {
    setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    setSelectedPlan(null);
  };

  const handleActivatePlan = (planId: string) => {
    setActivePlanId(planId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Schede di allenamento
          </h1>
          <p className="text-[var(--text-muted)] mt-1">Gestisci i tuoi programmi di allenamento</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuova scheda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            active={plan.id === activePlanId}
            onView={() => handleOpenModal(plan)}
            onActivate={() => handleActivatePlan(plan.id)}
          />
        ))}
      </div>

      <Modal
        isOpen={selectedPlan !== null}
        onClose={handleCloseModal}
        title={selectedPlan?.name || ""}
      >
        {selectedPlan && (
          <SchemaEditor plan={selectedPlan} onSave={handleSavePlan} />
        )}
      </Modal>
    </div>
  );
}

function PlanCard({
  plan,
  active,
  onView,
  onActivate,
}: {
  plan: Plan;
  active?: boolean;
  onView: () => void;
  onActivate: () => void;
}) {
  return (
    <div
      className={`bg-[var(--card-bg)] rounded-xl p-6 border-2 transition-all ${
        active
          ? "border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10"
          : "border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-[var(--text-primary)] text-lg">{plan.name}</h3>
        {active && (
          <span className="bg-[var(--success-light)] text-[var(--success)] text-xs font-semibold px-2.5 py-1 rounded-full">
            Attiva
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
        {plan.description}
      </p>
      <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-5">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {plan.weeks} settimane
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {plan.daysPerWeek}x/settimana
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex -space-x-2">
          {plan.exercises.slice(0, 3).map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-[var(--primary-light)] border-2 border-[var(--card-bg)] flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h2m12 0h2M6 8v8m12-8v8M8 6h8v12H8z" />
              </svg>
            </div>
          ))}
          {plan.exercises.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-[var(--card-bg)] flex items-center justify-center text-xs font-medium text-[var(--text-muted)]">
              +{plan.exercises.length - 3}
            </div>
          )}
        </div>
        <span className="text-sm text-[var(--text-muted)]">{plan.exercises.length} esercizi</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onView}
          className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[var(--text-primary)] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Visualizza
        </button>
        <button
          onClick={onActivate}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            active
              ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
              : "bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
          }`}
        >
          {active ? "Continua" : "Inizia"}
        </button>
      </div>
    </div>
  );
}
