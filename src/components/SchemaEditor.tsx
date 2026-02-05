"use client";

import { useState } from "react";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  notes?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  weeks: number;
  daysPerWeek: number;
  exercises: Exercise[];
  // Nuovi campi per gestione avanzata
  active?: boolean;
  trainingType?: 'ipertrofia' | 'forza' | 'resistenza';
  equipment?: string[];
  notes?: string;
}

interface SchemaEditorProps {
  plan: Plan;
  onSave: (plan: Plan) => void;
}

export default function SchemaEditor({ plan, onSave }: SchemaEditorProps) {
  const [exercises, setExercises] = useState<Exercise[]>(plan.exercises);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleExerciseChange = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map(ex =>
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleAddExercise = () => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: "Nuovo esercizio",
      sets: 3,
      reps: "10-12",
      weight: "0 kg",
    };
    setExercises([...exercises, newExercise]);
    setEditingId(newExercise.id);
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSave = () => {
    onSave({ ...plan, exercises });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm text-[var(--text-muted)]">{plan.weeks} settimane</span>
          <span className="text-sm text-[var(--text-muted)]">{plan.daysPerWeek}x/settimana</span>
        </div>
        <p className="text-[var(--text-secondary)]">{plan.description}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Esercizi</h3>
        <button
          onClick={handleAddExercise}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Aggiungi esercizio
        </button>
      </div>

      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 md:px-6 py-4 bg-gray-50 dark:bg-gray-800/50 text-sm font-medium text-[var(--text-muted)] border-b border-[var(--border)]">
          <div className="col-span-4">Esercizio</div>
          <div className="col-span-2 text-center">Serie</div>
          <div className="col-span-2 text-center">Ripetizioni</div>
          <div className="col-span-2 text-center">Peso</div>
          <div className="col-span-2 text-center">Azioni</div>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="grid grid-cols-12 gap-4 px-4 md:px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <div className="col-span-4">
                {editingId === exercise.id ? (
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(exercise.id, "name", e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                ) : (
                  <span className="text-[var(--text-primary)] font-medium">{exercise.name}</span>
                )}
              </div>
              <div className="col-span-2 text-center">
                {editingId === exercise.id ? (
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => handleExerciseChange(exercise.id, "sets", parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-[var(--border)] rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                ) : (
                  <span className="text-[var(--text-secondary)]">{exercise.sets} serie</span>
                )}
              </div>
              <div className="col-span-2 text-center">
                {editingId === exercise.id ? (
                  <input
                    type="text"
                    value={exercise.reps}
                    onChange={(e) => handleExerciseChange(exercise.id, "reps", e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-[var(--border)] rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                ) : (
                  <span className="text-[var(--text-secondary)]">{exercise.reps}</span>
                )}
              </div>
              <div className="col-span-2 text-center">
                {editingId === exercise.id ? (
                  <input
                    type="text"
                    value={exercise.weight}
                    onChange={(e) => handleExerciseChange(exercise.id, "weight", e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-[var(--border)] rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                ) : (
                  <span className="text-[var(--text-secondary)]">{exercise.weight}</span>
                )}
              </div>
              <div className="col-span-2 flex items-center justify-center gap-2">
                {editingId === exercise.id ? (
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 text-[var(--success)] hover:bg-[var(--success-light)] rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingId(exercise.id)}
                    className="p-2 text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => handleDeleteExercise(exercise.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {exercises.length === 0 && (
            <div className="p-8 text-center text-[var(--text-muted)]">
              Nessun esercizio. Clicca "Aggiungi esercizio" per iniziare.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg text-sm font-medium transition-colors"
        >
          Salva modifiche
        </button>
      </div>
    </div>
  );
}
