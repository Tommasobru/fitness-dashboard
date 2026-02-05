"use client";

import { useEffect } from "react";
import { Workout } from "@/lib/mockData";

interface WorkoutSelectorProps {
  isOpen: boolean;
  workouts: Workout[];
  dayName: string;
  onSelect: (workoutId: number) => void;
  onClose: () => void;
}

export default function WorkoutSelector({
  isOpen,
  workouts,
  dayName,
  onSelect,
  onClose
}: WorkoutSelectorProps) {
  // Gestione ESC per chiudere il modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Blocca scroll quando modal aperto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-[var(--card-bg)] rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Seleziona allenamento
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                {dayName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center justify-center transition-colors"
              aria-label="Chiudi"
            >
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Lista workout */}
          <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
            {workouts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[var(--text-muted)]">
                  Nessun allenamento disponibile per questa scheda
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {workouts.map((workout) => (
                  <button
                    key={workout.id}
                    onClick={() => {
                      onSelect(workout.id);
                      onClose();
                    }}
                    className="w-full p-4 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                          {workout.name}
                        </p>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                          {workout.type} • {workout.exercises?.length || 0} esercizi
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-[var(--text-primary)] font-medium transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
