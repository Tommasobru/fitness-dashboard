"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  loadWorkout,
  saveWorkout,
  clearWorkout,
  calculateProgress,
  isExerciseCompleted,
  type ActiveWorkout,
  type ExerciseWithSets,
  type WorkoutSet
} from "@/lib/workoutStorage";

export default function WorkoutSessionPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<ActiveWorkout | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(null);

  // Carica workout da localStorage al mount
  useEffect(() => {
    const loaded = loadWorkout();
    if (!loaded) {
      // Nessun workout attivo, torna alla dashboard
      router.push("/");
      return;
    }
    setWorkout(loaded);
  }, [router]);

  // Salva workout ogni volta che cambia
  useEffect(() => {
    if (workout) {
      saveWorkout(workout);
      // Dispatch evento per aggiornare l'indicatore
      window.dispatchEvent(new Event("workoutUpdated"));
    }
  }, [workout]);

  // Toggle espansione esercizio
  const toggleExerciseExpanded = (exerciseId: number) => {
    if (!workout) return;
    setWorkout({
      ...workout,
      exercises: workout.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, expanded: !ex.expanded } : ex
      )
    });
  };

  // Aggiorna una serie specifica
  const updateSet = (exerciseId: number, setIndex: number, updates: Partial<WorkoutSet>) => {
    if (!workout) return;
    setWorkout({
      ...workout,
      exercises: workout.exercises.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set, idx) =>
                idx === setIndex ? { ...set, ...updates } : set
              )
            }
          : ex
      )
    });
  };

  // Toggle completamento serie
  const toggleSetComplete = (exerciseId: number, setIndex: number) => {
    if (!workout) return;
    const exercise = workout.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const currentSet = exercise.sets[setIndex];
    updateSet(exerciseId, setIndex, { completed: !currentSet.completed });
  };

  // Avvia timer riposo
  const startRest = (exerciseId: number, restTime: number) => {
    setActiveExerciseId(exerciseId);
    setTimer(restTime);

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setActiveExerciseId(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Termina allenamento
  const handleFinishWorkout = () => {
    if (!workout) return;

    const progress = calculateProgress(workout);
    const allCompleted = progress === 100;

    if (!allCompleted) {
      const confirmEnd = confirm(
        "Non hai completato tutte le serie. Vuoi terminare comunque l'allenamento?"
      );
      if (!confirmEnd) return;
    }

    // Rimuovi da localStorage
    clearWorkout();
    // Dispatch evento per nascondere l'indicatore
    window.dispatchEvent(new Event("workoutUpdated"));
    // Torna alla dashboard
    router.push("/");
  };

  if (!workout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--text-muted)]">Caricamento...</p>
      </div>
    );
  }

  const progress = calculateProgress(workout);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header con freccia indietro */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Torna alla Dashboard
          </button>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {workout.name}
          </h1>
          <p className="text-[var(--text-muted)] mt-1">{workout.planName}</p>
        </div>
      </div>

      {/* Barra progresso */}
      <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)] mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            Progresso allenamento
          </span>
          <span className="text-sm font-bold text-[var(--primary)]">
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timer attivo */}
      {timer !== null && (
        <div className="bg-[var(--primary)] text-white rounded-xl p-6 mb-6 text-center">
          <p className="text-sm font-medium mb-2">Riposo in corso</p>
          <p className="text-5xl font-bold">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
          </p>
        </div>
      )}

      {/* Lista Esercizi con Accordion */}
      <div className="space-y-3 mb-6">
        {workout.exercises.map((exercise) => {
          const completedSets = exercise.sets.filter(s => s.completed).length;
          const totalSets = exercise.sets.length;
          const exerciseComplete = isExerciseCompleted(exercise);

          return (
            <div
              key={exercise.id}
              className={`bg-[var(--card-bg)] rounded-xl border-2 transition-all ${
                exerciseComplete
                  ? "border-[var(--success)] bg-[var(--success-light)]/20"
                  : activeExerciseId === exercise.id
                  ? "border-[var(--primary)]"
                  : "border-[var(--border)]"
              }`}
            >
              {/* Header Esercizio */}
              <button
                onClick={() => toggleExerciseExpanded(exercise.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      exerciseComplete
                        ? "bg-[var(--success)] text-white"
                        : "bg-[var(--primary-light)] text-[var(--primary)]"
                    }`}
                  >
                    {exerciseComplete ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-bold">{exercise.id}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className={`text-lg font-semibold ${
                      exerciseComplete ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"
                    }`}>
                      {exercise.name}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {completedSets}/{totalSets} serie • {exercise.targetReps} rip • {exercise.rest}s riposo
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${
                    exercise.expanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Serie espanse */}
              {exercise.expanded && (
                <div className="px-5 pb-5 space-y-3 border-t border-[var(--border)] pt-4">
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        set.completed
                          ? "bg-[var(--success-light)]/30"
                          : "bg-gray-50 dark:bg-gray-800/50"
                      }`}
                    >
                      {/* Numero serie */}
                      <span className="text-sm font-semibold text-[var(--text-secondary)] w-16">
                        Serie {setIndex + 1}
                      </span>

                      {/* Input Peso */}
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder="Peso"
                            value={set.weight ?? ""}
                            onChange={(e) =>
                              updateSet(exercise.id, setIndex, {
                                weight: e.target.value ? parseFloat(e.target.value) : null
                              })
                            }
                            disabled={set.completed}
                            className="w-full px-3 py-2 pr-10 bg-white dark:bg-gray-900 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
                            kg
                          </span>
                        </div>
                      </div>

                      {/* Input Ripetizioni */}
                      <div className="flex-1">
                        <input
                          type="number"
                          inputMode="numeric"
                          placeholder="Rip"
                          value={set.reps ?? ""}
                          onChange={(e) =>
                            updateSet(exercise.id, setIndex, {
                              reps: e.target.value ? parseInt(e.target.value) : null
                            })
                          }
                          disabled={set.completed}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Checkbox completamento */}
                      <button
                        onClick={() => toggleSetComplete(exercise.id, setIndex)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          set.completed
                            ? "bg-[var(--success)] border-[var(--success)]"
                            : "border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]"
                        }`}
                        aria-label="Segna serie come completata"
                      >
                        {set.completed && (
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}

                  {/* Pulsante Riposo */}
                  {!exerciseComplete && (
                    <button
                      onClick={() => startRest(exercise.id, exercise.rest)}
                      disabled={timer !== null}
                      className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        timer !== null
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                      }`}
                    >
                      {timer !== null ? "Timer in corso..." : `Avvia riposo (${exercise.rest}s)`}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pulsante Termina Allenamento */}
      <div className="sticky bottom-0 pb-6 pt-4 bg-gradient-to-t from-white dark:from-gray-900 via-white dark:via-gray-900">
        <button
          onClick={handleFinishWorkout}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg ${
            progress === 100
              ? "bg-[var(--success)] hover:bg-[var(--success-dark)] text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {progress === 100 ? "Completa allenamento" : "Termina allenamento"}
        </button>
      </div>
    </div>
  );
}
