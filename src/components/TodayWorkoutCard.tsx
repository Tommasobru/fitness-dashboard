"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTodayWorkout } from "@/lib/scheduleStorage";
import { getWorkoutById, getPlanById } from "@/lib/mockData";
import { saveWorkout } from "@/lib/workoutStorage";
import type { ActiveWorkout } from "@/lib/workoutStorage";

export default function TodayWorkoutCard() {
  const router = useRouter();
  const [todayWorkoutId, setTodayWorkoutId] = useState<number | null>(null);

  // Carica workout programmato per oggi
  useEffect(() => {
    const loadTodayWorkout = () => {
      const workoutId = getTodayWorkout();
      setTodayWorkoutId(workoutId);
    };

    loadTodayWorkout();

    // Listener per aggiornamenti della programmazione
    const handleScheduleUpdate = () => {
      loadTodayWorkout();
    };

    window.addEventListener("scheduleUpdated", handleScheduleUpdate);

    return () => {
      window.removeEventListener("scheduleUpdated", handleScheduleUpdate);
    };
  }, []);

  const workout = todayWorkoutId ? getWorkoutById(todayWorkoutId) : null;
  const plan = workout ? getPlanById(workout.planId) : null;

  const handleStartWorkout = () => {
    if (!workout || !plan) return;

    // Crea workout specifico basato sulla programmazione
    const activeWorkout: ActiveWorkout = {
      id: `workout-${Date.now()}`,
      name: workout.name,
      planName: plan.name,
      startTime: new Date().toISOString(),
      exercises: (workout.exercises || []).map(ex => ({
        id: ex.id,
        name: ex.name,
        targetSets: ex.sets,
        targetReps: ex.reps,
        rest: ex.rest,
        expanded: false,
        sets: Array.from({ length: ex.sets }, () => ({
          completed: false,
          weight: null,
          reps: null
        }))
      }))
    };

    saveWorkout(activeWorkout);

    // Dispatch evento custom per aggiornare l'indicatore
    window.dispatchEvent(new Event("workoutUpdated"));

    // Naviga alla pagina workout-session
    router.push("/workout-session");
  };

  const scheduled = todayWorkoutId !== null && workout !== null;

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)] h-full">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-[var(--text-muted)] mb-1">
            Allenamento di oggi
          </h3>
          {scheduled ? (
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                Programmato
              </p>
              {workout && (
                <p className="text-sm text-[var(--text-secondary)] mb-1">
                  {workout.name}
                </p>
              )}
              {plan && (
                <p className="text-xs text-[var(--text-muted)]">
                  {plan.name}
                </p>
              )}
            </div>
          ) : (
            <p className="text-2xl font-bold text-[var(--text-muted)]">
              Nessuno
            </p>
          )}
        </div>
      </div>

      {scheduled && (
        <button
          onClick={handleStartWorkout}
          className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Inizia
        </button>
      )}

      {!scheduled && (
        <div className="pt-2 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] text-center">
            Giorno di riposo
          </p>
        </div>
      )}
    </div>
  );
}
