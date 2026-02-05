"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import SchemaEditor, { Plan } from "@/components/SchemaEditor";
import { loadPlans, savePlan, togglePlanActive } from "@/lib/plansStorage";

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Carica schede al mount
  useEffect(() => {
    setPlans(loadPlans());
  }, []);

  // Separa schede attive e tutte
  const activePlans = plans.filter(p => p.active === true);
  const allPlans = plans;

  const handleOpenModal = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  const handleSavePlan = (updatedPlan: Plan) => {
    savePlan(updatedPlan);
    setPlans(loadPlans());
    setSelectedPlan(null);
  };

  const handleToggleActive = (planId: string) => {
    togglePlanActive(planId);
    setPlans(loadPlans());
  };

  const handleCreateNew = () => {
    router.push("/plans/new");
  };

  return (
    <div className="space-y-6">
      {/* Header con navigazione */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Torna alla Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Schede di allenamento
            </h1>
            <p className="text-[var(--text-muted)] mt-1.5">Gestisci i tuoi programmi di allenamento</p>
          </div>
        </div>
      </div>

      {/* Sezione Schede Attive */}
      {activePlans.length > 0 && (
        <div className="mb-8 md:mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Schede Attive
            </h2>
            <span className="text-sm text-[var(--text-muted)]">
              {activePlans.length} {activePlans.length === 1 ? 'scheda attiva' : 'schede attive'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {activePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onView={() => handleOpenModal(plan)}
                onToggleActive={() => handleToggleActive(plan.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sezione Tutte le Schede */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Tutte le Schede
          </h2>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuova scheda
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {allPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onView={() => handleOpenModal(plan)}
              onToggleActive={() => handleToggleActive(plan.id)}
            />
          ))}
        </div>
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
  onView,
  onToggleActive,
}: {
  plan: Plan;
  onView: () => void;
  onToggleActive: () => void;
}) {
  const isActive = plan.active === true;

  return (
    <div
      className={`bg-[var(--card-bg)] rounded-xl p-5 md:p-6 border-2 transition-all flex flex-col h-full ${
        isActive
          ? "border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10"
          : "border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="font-semibold text-[var(--text-primary)] text-lg flex-1 pr-2">{plan.name}</h3>
        {isActive && (
          <span className="bg-[var(--success-light)] text-[var(--success)] text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
            Attiva
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
        {plan.description}
      </p>
      <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-4">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {plan.weeks} settimane
        </div>
      </div>
      {plan.trainingType && (
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary-light)] text-[var(--primary)]">
            {plan.trainingType.charAt(0).toUpperCase() + plan.trainingType.slice(1)}
          </span>
        </div>
      )}
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
            <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] border-2 border-[var(--card-bg)] flex items-center justify-center text-xs font-medium text-[var(--primary)]">
              +{plan.exercises.length - 3}
            </div>
          )}
        </div>
        <span className="text-sm text-[var(--text-muted)]">{plan.exercises.length} esercizi</span>
      </div>
      <div className="flex items-center gap-2 md:gap-3 mt-auto">
        <button
          onClick={onView}
          className="flex-1 bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Visualizza
        </button>
        <button
          onClick={onToggleActive}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              : "bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
          }`}
        >
          {isActive ? "Disattiva" : "Attiva"}
        </button>
      </div>
    </div>
  );
}
