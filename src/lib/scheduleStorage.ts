// Gestione della programmazione settimanale in localStorage

export interface DaySchedule {
  date: string;           // ISO date "2026-01-13"
  dayName: string;        // "Lunedì", "Martedì", ecc.
  dayShort: string;       // "Lun", "Mar", ecc.
  workoutId: number | null;  // null se riposo
  isToday?: boolean;      // flag per evidenziare giorno corrente
}

export interface WeekSchedule {
  weekId: string;         // es. "2026-W02" (anno-settimana ISO)
  planId: number;         // scheda selezionata per quella settimana
  schedule: DaySchedule[];
}

const STORAGE_KEY = "weekSchedules";

// Verifica se siamo nel browser
const isBrowser = typeof window !== "undefined";

// Nomi giorni italiani
const DAYS_FULL = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
const DAYS_SHORT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

/**
 * Ottiene il lunedì della settimana di una data
 */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Aggiusta se domenica
  return new Date(d.setDate(diff));
}

/**
 * Formatta una data in ISO string (YYYY-MM-DD)
 */
function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Ottiene il numero della settimana ISO
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Genera weekId per una data (formato: YYYY-Www)
 */
function getWeekId(date: Date): string {
  const year = date.getFullYear();
  const weekNum = getWeekNumber(date);
  return `${year}-W${weekNum.toString().padStart(2, '0')}`;
}

/**
 * Ottiene i 7 giorni della settimana (Lun-Dom) per una data
 */
export function getWeekDates(weekOffset: number = 0): DaySchedule[] {
  const today = new Date();
  today.setDate(today.getDate() + weekOffset * 7);

  const monday = getMonday(today);
  const days: DaySchedule[] = [];
  const todayISO = formatDateISO(new Date());

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateISO = formatDateISO(date);
    const dayIndex = date.getDay();

    days.push({
      date: dateISO,
      dayName: DAYS_FULL[dayIndex],
      dayShort: DAYS_SHORT[dayIndex],
      workoutId: null,
      isToday: dateISO === todayISO
    });
  }

  return days;
}

/**
 * Formatta il range della settimana (es. "13-19 Gen 2026")
 */
export function formatWeekRange(weekOffset: number = 0): string {
  const days = getWeekDates(weekOffset);
  const firstDay = new Date(days[0].date);
  const lastDay = new Date(days[6].date);

  const firstDayNum = firstDay.getDate();
  const lastDayNum = lastDay.getDate();

  const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  const month = months[firstDay.getMonth()];
  const year = firstDay.getFullYear();

  return `${firstDayNum}-${lastDayNum} ${month} ${year}`;
}

/**
 * Carica tutte le programmazioni settimanali da localStorage
 */
function loadAllSchedules(): WeekSchedule[] {
  if (!isBrowser) return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Errore nel caricare le programmazioni:", error);
    return [];
  }
}

/**
 * Salva tutte le programmazioni in localStorage
 */
function saveAllSchedules(schedules: WeekSchedule[]): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error("Errore nel salvare le programmazioni:", error);
  }
}

/**
 * Ottiene la programmazione per una settimana specifica
 */
export function getWeekSchedule(weekOffset: number = 0, defaultPlanId: number = 1): WeekSchedule {
  const weekDays = getWeekDates(weekOffset);
  const weekId = getWeekId(new Date(weekDays[0].date));

  const allSchedules = loadAllSchedules();
  const existingSchedule = allSchedules.find(s => s.weekId === weekId);

  if (existingSchedule) {
    // Merge con i dati aggiornati (per isToday)
    return {
      ...existingSchedule,
      schedule: weekDays.map(day => {
        const savedDay = existingSchedule.schedule.find(d => d.date === day.date);
        return savedDay ? { ...day, workoutId: savedDay.workoutId } : day;
      })
    };
  }

  // Crea nuova programmazione vuota
  return {
    weekId,
    planId: defaultPlanId,
    schedule: weekDays
  };
}

/**
 * Salva/aggiorna una programmazione settimanale
 */
export function saveWeekSchedule(weekSchedule: WeekSchedule): void {
  const allSchedules = loadAllSchedules();
  const index = allSchedules.findIndex(s => s.weekId === weekSchedule.weekId);

  if (index >= 0) {
    allSchedules[index] = weekSchedule;
  } else {
    allSchedules.push(weekSchedule);
  }

  saveAllSchedules(allSchedules);
}

/**
 * Programma un workout per un giorno specifico
 */
export function scheduleWorkout(weekId: string, date: string, workoutId: number | null): void {
  const allSchedules = loadAllSchedules();
  const schedule = allSchedules.find(s => s.weekId === weekId);

  if (schedule) {
    const dayIndex = schedule.schedule.findIndex(d => d.date === date);
    if (dayIndex >= 0) {
      schedule.schedule[dayIndex].workoutId = workoutId;
      saveAllSchedules(allSchedules);
    }
  }
}

/**
 * Cambia la scheda per una settimana
 */
export function changePlanForWeek(weekId: string, planId: number): void {
  const allSchedules = loadAllSchedules();
  const schedule = allSchedules.find(s => s.weekId === weekId);

  if (schedule) {
    schedule.planId = planId;
    saveAllSchedules(allSchedules);
  }
}

/**
 * Ottiene il workout programmato per oggi (se esiste)
 */
export function getTodayWorkout(): number | null {
  const today = formatDateISO(new Date());
  const weekSchedule = getWeekSchedule(0);
  const todaySchedule = weekSchedule.schedule.find(d => d.date === today);
  return todaySchedule?.workoutId || null;
}

/**
 * Verifica se una data è oggi
 */
export function isToday(dateISO: string): boolean {
  return dateISO === formatDateISO(new Date());
}
