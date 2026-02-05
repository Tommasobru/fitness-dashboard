"use client";

import { useState } from "react";

interface CompletedWorkout {
  id: string;
  date: string;
  planName: string;
  duration: number; // in minuti
  exercisesCompleted: number;
  totalExercises: number;
  notes?: string;
}

const mockWorkouts: CompletedWorkout[] = [
  {
    id: "1",
    date: "2026-01-10",
    planName: "Forza - Fase 1",
    duration: 75,
    exercisesCompleted: 4,
    totalExercises: 4,
    notes: "Ottima sessione, aumentato il peso sullo squat",
  },
  {
    id: "2",
    date: "2026-01-08",
    planName: "Forza - Fase 1",
    duration: 68,
    exercisesCompleted: 4,
    totalExercises: 4,
  },
  {
    id: "3",
    date: "2026-01-06",
    planName: "Forza - Fase 1",
    duration: 72,
    exercisesCompleted: 4,
    totalExercises: 4,
    notes: "Leggero fastidio alla spalla, ridotto carico sulla panca",
  },
  {
    id: "4",
    date: "2026-01-04",
    planName: "Ipertrofia",
    duration: 85,
    exercisesCompleted: 4,
    totalExercises: 4,
  },
  {
    id: "5",
    date: "2026-01-02",
    planName: "Forza - Fase 1",
    duration: 70,
    exercisesCompleted: 4,
    totalExercises: 4,
  },
  {
    id: "6",
    date: "2025-12-30",
    planName: "Ipertrofia",
    duration: 90,
    exercisesCompleted: 4,
    totalExercises: 4,
    notes: "Ultimo allenamento dell'anno!",
  },
  {
    id: "7",
    date: "2025-12-28",
    planName: "Full Body",
    duration: 55,
    exercisesCompleted: 3,
    totalExercises: 3,
  },
  {
    id: "8",
    date: "2025-12-26",
    planName: "Forza - Fase 1",
    duration: 78,
    exercisesCompleted: 4,
    totalExercises: 4,
  },
];

const uniquePlans = Array.from(new Set(mockWorkouts.map((w) => w.planName)));

export default function HistoryPage() {
  const [filterPlan, setFilterPlan] = useState<string>("all");

  const filteredWorkouts =
    filterPlan === "all"
      ? mockWorkouts
      : mockWorkouts.filter((w) => w.planName === filterPlan);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} min`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Storico Allenamenti
          </h1>
          <p className="text-[var(--text-muted)] mt-1.5">
            Tutti gli allenamenti completati
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-[var(--text-secondary)]">
            Filtra per scheda:
          </label>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="all">Tutte le schede</option>
            {uniquePlans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            formatDate={formatDate}
            formatDuration={formatDuration}
          />
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-[var(--text-muted)]">
            Nessun allenamento trovato per questa scheda
          </p>
        </div>
      )}
    </div>
  );
}

function WorkoutCard({
  workout,
  formatDate,
  formatDuration,
}: {
  workout: CompletedWorkout;
  formatDate: (date: string) => string;
  formatDuration: (minutes: number) => string;
}) {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-5 md:p-6 border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg font-semibold text-[var(--text-primary)]">
              {workout.planName}
            </span>
            <span className="bg-[var(--success-light)] text-[var(--success)] text-xs font-semibold px-2.5 py-1 rounded-full">
              Completato
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)] capitalize">
            {formatDate(workout.date)}
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">
                {formatDuration(workout.duration)}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Durata</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">
                {workout.exercisesCompleted}/{workout.totalExercises}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Esercizi</p>
          </div>
        </div>
      </div>
      {workout.notes && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-[var(--text-muted)] mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <p className="text-sm text-[var(--text-secondary)]">
              {workout.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
