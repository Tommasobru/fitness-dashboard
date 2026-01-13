"use client";

import { useState, useEffect } from "react";
import DayCard from "./DayCard";
import WorkoutSelector from "./WorkoutSelector";
import { getActivePlans, getWorkoutsByPlanId } from "@/lib/mockData";
import {
  getWeekSchedule,
  saveWeekSchedule,
  scheduleWorkout,
  formatWeekRange,
  type WeekSchedule,
  type DaySchedule
} from "@/lib/scheduleStorage";

export default function WeeklyScheduleView() {
  const [weekOffset, setWeekOffset] = useState(0); // 0 = settimana corrente
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule | null>(null);
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const plans = getActivePlans();

  // Carica la programmazione della settimana
  useEffect(() => {
    const schedule = getWeekSchedule(weekOffset, plans[0]?.id || 1);
    setWeekSchedule(schedule);
  }, [weekOffset, plans]);

  // Handler per cambiare settimana
  const handlePreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };

  // Handler per cambiare scheda
  const handlePlanChange = (planId: number) => {
    if (!weekSchedule) return;

    const updatedSchedule = {
      ...weekSchedule,
      planId
    };

    setWeekSchedule(updatedSchedule);
    saveWeekSchedule(updatedSchedule);
  };

  // Handler per aggiungere workout
  const handleAddWorkout = (day: DaySchedule) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  // Handler per selezionare workout dal modal
  const handleSelectWorkout = (workoutId: number) => {
    if (!weekSchedule || !selectedDay) return;

    scheduleWorkout(weekSchedule.weekId, selectedDay.date, workoutId);

    // Ricarica schedule
    const updatedSchedule = getWeekSchedule(weekOffset, weekSchedule.planId);
    setWeekSchedule(updatedSchedule);

    // Dispatch evento per aggiornare TodayWorkoutCard
    window.dispatchEvent(new Event("scheduleUpdated"));
  };

  // Handler per rimuovere workout
  const handleRemoveWorkout = (day: DaySchedule) => {
    if (!weekSchedule) return;

    scheduleWorkout(weekSchedule.weekId, day.date, null);

    // Ricarica schedule
    const updatedSchedule = getWeekSchedule(weekOffset, weekSchedule.planId);
    setWeekSchedule(updatedSchedule);

    // Dispatch evento per aggiornare TodayWorkoutCard
    window.dispatchEvent(new Event("scheduleUpdated"));
  };

  if (!weekSchedule) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--text-muted)]">Caricamento...</p>
      </div>
    );
  }

  const availableWorkouts = getWorkoutsByPlanId(weekSchedule.planId);
  const weekRange = formatWeekRange(weekOffset);

  return (
    <div>
      {/* Selettore Settimana (fuori dal riquadro) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreviousWeek}
            className="w-9 h-9 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
            aria-label="Settimana precedente"
          >
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Settimana: {weekRange}
            </p>
            {weekOffset === 0 && (
              <p className="text-xs text-[var(--primary)] font-medium">Corrente</p>
            )}
          </div>

          <button
            onClick={handleNextWeek}
            className="w-9 h-9 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
            aria-label="Settimana successiva"
          >
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {weekOffset !== 0 && (
          <button
            onClick={() => setWeekOffset(0)}
            className="text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium transition-colors"
          >
            Torna a questa settimana
          </button>
        )}
      </div>

      {/* Riquadro principale */}
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
        {/* Header con selettore scheda */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Programmazione Settimanale
          </h2>

          <select
            value={weekSchedule.planId}
            onChange={(e) => handlePlanChange(parseInt(e.target.value))}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        {/* Grid giorni della settimana */}
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekSchedule.schedule.map((day) => (
              <DayCard
                key={day.date}
                dayShort={day.dayShort}
                dayNumber={new Date(day.date).getDate()}
                workoutId={day.workoutId}
                isToday={day.isToday}
                onAddWorkout={() => handleAddWorkout(day)}
                onRemoveWorkout={() => handleRemoveWorkout(day)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal selezione workout */}
      <WorkoutSelector
        isOpen={isModalOpen}
        workouts={availableWorkouts}
        dayName={selectedDay?.dayName || ""}
        onSelect={handleSelectWorkout}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDay(null);
        }}
      />
    </div>
  );
}
