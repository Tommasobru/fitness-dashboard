"use client";

import StatsCard from "@/components/StatsCard";
import TodayWorkoutCard from "@/components/TodayWorkoutCard";
import ActiveWorkoutIndicator from "@/components/ActiveWorkoutIndicator";
import WeeklyScheduleView from "@/components/WeeklyScheduleView";
import PlansCarousel from "@/components/PlansCarousel";
import RecentActivities from "@/components/RecentActivities";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Indicatore allenamento attivo */}
      <ActiveWorkoutIndicator />

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
          title="Schede attive"
          value="2"
          subtitle="in corso"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <TodayWorkoutCard />
      </div>

      {/* Pianificazione settimanale */}
      <WeeklyScheduleView />

      {/* Carosello Schede e Attività Recenti */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlansCarousel />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}
