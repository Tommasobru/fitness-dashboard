import StatsCard from "@/components/StatsCard";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Ciao, Utente
          </h1>
          <p className="text-[var(--text-muted)] mt-1">Ecco il riepilogo dei tuoi progressi</p>
        </div>
        <Link
          href="/plans"
          className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuova scheda
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Allenamenti completati"
          value="12"
          subtitle="questo mese"
          trend={{ value: 15, positive: true }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Calorie bruciate"
          value="8,450"
          subtitle="questo mese"
          trend={{ value: 8, positive: true }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          }
        />
        <StatsCard
          title="Tempo totale"
          value="18h 30m"
          subtitle="questo mese"
          trend={{ value: 12, positive: true }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Schede attive"
          value="2"
          subtitle="in corso"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Statistiche settimanali
            </h2>
            <select className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
              <option>Questa settimana</option>
              <option>Settimana scorsa</option>
              <option>Ultimo mese</option>
            </select>
          </div>
          <div className="flex items-end gap-2 h-48">
            {weeklyData.map((day) => (
              <div key={day.name} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg relative" style={{ height: '160px' }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[var(--primary)] rounded-t-lg transition-all"
                    style={{ height: `${day.value}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--text-muted)]">{day.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Attività recenti
            </h2>
            <Link href="/progress" className="text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium">
              Vedi tutto
            </Link>
          </div>
          <div className="space-y-4">
            <ActivityItem
              action="Completato allenamento"
              description="Forza - Fase 1"
              time="Oggi, 18:30"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              iconBg="bg-[var(--success-light)]"
              iconColor="text-[var(--success)]"
            />
            <ActivityItem
              action="Nuovo record personale"
              description="Panca piana: 100kg"
              time="Ieri"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
              iconBg="bg-[var(--warning-light)]"
              iconColor="text-[var(--warning)]"
            />
            <ActivityItem
              action="Aggiornata scheda"
              description="Ipertrofia"
              time="2 giorni fa"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
              iconBg="bg-[var(--primary-light)]"
              iconColor="text-[var(--primary)]"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Le mie schede
          </h2>
          <Link href="/plans" className="text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium flex items-center gap-1">
            Vedi tutte
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlanPreview
            name="Forza - Fase 1"
            progress={65}
            daysLeft={12}
            active
          />
          <PlanPreview
            name="Ipertrofia"
            progress={0}
            daysLeft={56}
          />
        </div>
      </div>
    </div>
  );
}

const weeklyData = [
  { name: "Lun", value: 80 },
  { name: "Mar", value: 45 },
  { name: "Mer", value: 90 },
  { name: "Gio", value: 60 },
  { name: "Ven", value: 75 },
  { name: "Sab", value: 30 },
  { name: "Dom", value: 0 },
];

function ActivityItem({
  action,
  description,
  time,
  icon,
  iconBg,
  iconColor,
}: {
  action: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)]">{action}</p>
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      </div>
      <span className="text-xs text-[var(--text-muted)] flex-shrink-0">{time}</span>
    </div>
  );
}

function PlanPreview({
  name,
  progress,
  daysLeft,
  active,
}: {
  name: string;
  progress: number;
  daysLeft: number;
  active?: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${
      active
        ? "border-[var(--primary)] bg-[var(--primary-light)]/30"
        : "border-[var(--border)] hover:border-[var(--primary)]/30"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-[var(--text-primary)]">{name}</h3>
        {active && (
          <span className="bg-[var(--success-light)] text-[var(--success)] text-xs font-semibold px-2 py-0.5 rounded-full">
            Attiva
          </span>
        )}
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-[var(--text-muted)]">Progresso</span>
          <span className="font-medium text-[var(--primary)]">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)]">{daysLeft} giorni rimanenti</p>
    </div>
  );
}
