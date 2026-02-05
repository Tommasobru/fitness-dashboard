import { Plan } from "@/lib/mockData";

interface PlanCarouselCardProps {
  plan: Plan;
  progress?: number;      // 0-100
  daysLeft?: number;
  workoutsThisWeek?: number;
  totalWorkoutsWeek?: number;
}

export default function PlanCarouselCard({
  plan,
  progress = 0,
  daysLeft = 56,
  workoutsThisWeek = 0,
  totalWorkoutsWeek = 4
}: PlanCarouselCardProps) {
  return (
    <div className={`p-5 rounded-xl border-2 transition-all ${
      plan.active
        ? "border-[var(--primary)] bg-[var(--primary-light)]/30"
        : "border-[var(--border)] hover:border-[var(--primary)]/30"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-semibold text-[var(--text-primary)] text-lg flex-1 pr-2">
          {plan.name}
        </h3>
        {plan.active && (
          <span className="bg-[var(--success-light)] text-[var(--success)] text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
            Attiva
          </span>
        )}
      </div>

      {/* Progresso */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[var(--text-muted)]">Progresso</span>
          <span className="font-semibold text-[var(--primary)]">{progress}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text-primary)]">{workoutsThisWeek}/{totalWorkoutsWeek}</span> workout questa settimana
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text-primary)]">{daysLeft}</span> giorni rimanenti
          </span>
        </div>
      </div>
    </div>
  );
}
