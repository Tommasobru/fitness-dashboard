import { getWorkoutById } from "@/lib/mockData";

interface DayCardProps {
  dayShort: string;
  dayNumber: number;
  workoutId: number | null;
  isToday?: boolean;
  onAddWorkout: () => void;
  onRemoveWorkout: () => void;
}

export default function DayCard({
  dayShort,
  dayNumber,
  workoutId,
  isToday,
  onAddWorkout,
  onRemoveWorkout
}: DayCardProps) {
  const workout = workoutId ? getWorkoutById(workoutId) : null;

  return (
    <div
      className={`flex flex-col bg-[var(--card-bg)] rounded-xl border-2 transition-all overflow-hidden ${
        isToday
          ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
          : "border-[var(--border)] hover:border-[var(--border-hover)]"
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-3 text-center border-b border-[var(--border)] ${
        isToday ? "bg-[var(--primary-light)]" : ""
      }`}>
        <p className={`text-xs font-medium uppercase tracking-wide ${
          isToday ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
        }`}>
          {dayShort}
        </p>
        <p className={`text-lg font-bold mt-0.5 ${
          isToday ? "text-[var(--primary)]" : "text-[var(--text-primary)]"
        }`}>
          {dayNumber}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center min-h-[120px]">
        {workout ? (
          <div className="w-full text-center">
            <div className="mb-3">
              <div className="w-10 h-10 mx-auto rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center mb-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
                {workout.name}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {workout.type}
              </p>
            </div>
            <button
              onClick={onRemoveWorkout}
              className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
              aria-label="Rimuovi workout"
            >
              Rimuovi
            </button>
          </div>
        ) : (
          <button
            onClick={onAddWorkout}
            className="w-12 h-12 rounded-full bg-[var(--primary-light)] hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white transition-all flex items-center justify-center group"
            aria-label="Aggiungi workout"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
