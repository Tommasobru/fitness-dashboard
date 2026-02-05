import { Plan } from "@/components/SchemaEditor";

const PLANS_KEY = "fitness-plans";

// Mock data iniziali
const initialPlans: Plan[] = [
  {
    id: "1",
    name: "Forza - Fase 1",
    description: "Programma di 4 settimane per aumentare la forza massimale",
    weeks: 4,
    daysPerWeek: 4,
    active: true,
    trainingType: "forza",
    equipment: ["bilancieri", "manubri"],
    exercises: [
      { id: "ex1", name: "Squat", sets: 5, reps: "5", weight: "80 kg" },
      { id: "ex2", name: "Panca piana", sets: 5, reps: "5", weight: "60 kg" },
      { id: "ex3", name: "Stacco da terra", sets: 5, reps: "5", weight: "100 kg" },
      { id: "ex4", name: "Military press", sets: 4, reps: "6-8", weight: "40 kg" },
    ],
  },
  {
    id: "2",
    name: "Ipertrofia",
    description: "Programma per la crescita muscolare con alto volume",
    weeks: 8,
    daysPerWeek: 5,
    active: true,
    trainingType: "ipertrofia",
    equipment: ["manubri", "bilancieri"],
    exercises: [
      { id: "ex5", name: "Lat machine", sets: 4, reps: "10-12", weight: "50 kg" },
      { id: "ex6", name: "Curl bilanciere", sets: 3, reps: "12-15", weight: "25 kg" },
      { id: "ex7", name: "Leg press", sets: 4, reps: "12-15", weight: "120 kg" },
      { id: "ex8", name: "Croci ai cavi", sets: 3, reps: "15", weight: "15 kg" },
    ],
  },
  {
    id: "3",
    name: "Full Body",
    description: "Allenamento completo per principianti",
    weeks: 6,
    daysPerWeek: 3,
    active: false,
    trainingType: "resistenza",
    equipment: ["manubri", "ketball"],
    exercises: [
      { id: "ex9", name: "Goblet squat", sets: 3, reps: "12", weight: "16 kg" },
      { id: "ex10", name: "Push-up", sets: 3, reps: "10-15", weight: "Corpo" },
      { id: "ex11", name: "Rematore manubrio", sets: 3, reps: "12", weight: "14 kg" },
    ],
  },
  {
    id: "4",
    name: "Push Pull Legs",
    description: "Classica divisione PPL per intermedi",
    weeks: 12,
    daysPerWeek: 6,
    active: false,
    trainingType: "ipertrofia",
    equipment: ["bilancieri", "manubri", "sbarra"],
    exercises: [
      { id: "ex12", name: "Panca inclinata", sets: 4, reps: "8-10", weight: "50 kg" },
      { id: "ex13", name: "Trazioni", sets: 4, reps: "8-10", weight: "Corpo" },
      { id: "ex14", name: "Leg curl", sets: 4, reps: "10-12", weight: "40 kg" },
      { id: "ex15", name: "Dips", sets: 3, reps: "10-12", weight: "Corpo" },
    ],
  },
];

/**
 * Carica tutte le schede dal localStorage
 * Se non esistono, ritorna i dati mock iniziali
 */
export function loadPlans(): Plan[] {
  if (typeof window === "undefined") return initialPlans;

  try {
    const stored = localStorage.getItem(PLANS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Errore nel caricamento delle schede:", error);
  }

  // Prima volta: salva i dati mock
  savePlans(initialPlans);
  return initialPlans;
}

/**
 * Salva tutte le schede nel localStorage
 */
export function savePlans(plans: Plan[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error("Errore nel salvataggio delle schede:", error);
  }
}

/**
 * Salva o aggiorna una singola scheda
 */
export function savePlan(plan: Plan): void {
  const plans = loadPlans();
  const index = plans.findIndex(p => p.id === plan.id);

  if (index !== -1) {
    // Aggiorna scheda esistente
    plans[index] = plan;
  } else {
    // Aggiungi nuova scheda
    plans.push(plan);
  }

  savePlans(plans);
}

/**
 * Ottiene solo le schede attive
 */
export function getActivePlans(): Plan[] {
  return loadPlans().filter(p => p.active === true);
}

/**
 * Ottiene solo le schede inattive
 */
export function getInactivePlans(): Plan[] {
  return loadPlans().filter(p => p.active !== true);
}

/**
 * Ottiene una scheda per ID
 */
export function getPlanById(id: string): Plan | undefined {
  return loadPlans().find(p => p.id === id);
}

/**
 * Elimina una scheda
 */
export function deletePlan(id: string): void {
  const plans = loadPlans().filter(p => p.id !== id);
  savePlans(plans);
}

/**
 * Attiva/Disattiva una scheda
 */
export function togglePlanActive(id: string): void {
  const plans = loadPlans();
  const plan = plans.find(p => p.id === id);

  if (plan) {
    plan.active = !plan.active;
    savePlans(plans);
  }
}

/**
 * Genera un nuovo ID univoco per una scheda
 */
export function generatePlanId(): string {
  return `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
