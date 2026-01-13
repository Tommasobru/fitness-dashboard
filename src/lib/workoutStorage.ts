// Interfacce per il workout tracking

export interface WorkoutSet {
  completed: boolean;
  weight: number | null;  // kg
  reps: number | null;    // ripetizioni effettuate
}

export interface ExerciseWithSets {
  id: number;
  name: string;
  targetSets: number;
  targetReps: string;  // es. "8-10"
  rest: number;        // secondi
  sets: WorkoutSet[];
  expanded?: boolean;  // per accordion UI
}

export interface ActiveWorkout {
  id: string;          // unique ID per questa sessione
  name: string;        // nome allenamento
  planName: string;    // nome scheda
  startTime: string;   // ISO timestamp
  exercises: ExerciseWithSets[];
}

const STORAGE_KEY = "activeWorkout";

// Verifica se siamo nel browser
const isBrowser = typeof window !== "undefined";

/**
 * Salva un allenamento attivo in localStorage
 */
export function saveWorkout(workout: ActiveWorkout): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workout));
  } catch (error) {
    console.error("Errore nel salvare l'allenamento:", error);
  }
}

/**
 * Carica l'allenamento attivo da localStorage
 */
export function loadWorkout(): ActiveWorkout | null {
  if (!isBrowser) return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const workout = JSON.parse(stored) as ActiveWorkout;

    // Validazione opzionale: verifica che l'allenamento non sia troppo vecchio (24h)
    const startTime = new Date(workout.startTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      // Allenamento troppo vecchio, lo rimuoviamo
      clearWorkout();
      return null;
    }

    return workout;
  } catch (error) {
    console.error("Errore nel caricare l'allenamento:", error);
    return null;
  }
}

/**
 * Rimuove l'allenamento attivo da localStorage
 */
export function clearWorkout(): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Errore nel rimuovere l'allenamento:", error);
  }
}

/**
 * Verifica se esiste un allenamento attivo
 */
export function isWorkoutActive(): boolean {
  return loadWorkout() !== null;
}

/**
 * Crea un nuovo allenamento con esercizi mock
 */
export function createNewWorkout(name: string, planName: string): ActiveWorkout {
  const workout: ActiveWorkout = {
    id: `workout-${Date.now()}`,
    name,
    planName,
    startTime: new Date().toISOString(),
    exercises: [
      {
        id: 1,
        name: "Panca piana",
        targetSets: 4,
        targetReps: "8-10",
        rest: 180,
        expanded: false,
        sets: [
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
        ]
      },
      {
        id: 2,
        name: "Trazioni alla sbarra",
        targetSets: 4,
        targetReps: "6-8",
        rest: 180,
        expanded: false,
        sets: [
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
        ]
      },
      {
        id: 3,
        name: "Military press",
        targetSets: 3,
        targetReps: "10-12",
        rest: 120,
        expanded: false,
        sets: [
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
        ]
      },
      {
        id: 4,
        name: "Rematore bilanciere",
        targetSets: 4,
        targetReps: "8-10",
        rest: 120,
        expanded: false,
        sets: [
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
        ]
      },
      {
        id: 5,
        name: "Dip alle parallele",
        targetSets: 3,
        targetReps: "10-12",
        rest: 90,
        expanded: false,
        sets: [
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
          { completed: false, weight: null, reps: null },
        ]
      },
    ]
  };

  return workout;
}

/**
 * Calcola il progresso dell'allenamento (percentuale serie completate)
 */
export function calculateProgress(workout: ActiveWorkout): number {
  let totalSets = 0;
  let completedSets = 0;

  workout.exercises.forEach(exercise => {
    totalSets += exercise.sets.length;
    completedSets += exercise.sets.filter(set => set.completed).length;
  });

  return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
}

/**
 * Verifica se un esercizio è completato (tutte le serie completate)
 */
export function isExerciseCompleted(exercise: ExerciseWithSets): boolean {
  return exercise.sets.every(set => set.completed);
}
