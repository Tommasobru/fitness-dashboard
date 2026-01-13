// Mock data per schede e workout

export interface Workout {
  id: number;
  name: string;
  type: string;
  planId: number;
  exercises?: {
    id: number;
    name: string;
    sets: number;
    reps: string;
    rest: number;
  }[];
}

export interface Plan {
  id: number;
  name: string;
  active: boolean;
  workouts: Workout[];
}

// Schede di allenamento mock
export const mockPlans: Plan[] = [
  {
    id: 1,
    name: "Forza - Fase 1",
    active: true,
    workouts: [
      {
        id: 1,
        name: "Upper Body",
        type: "Upper",
        planId: 1,
        exercises: [
          { id: 1, name: "Panca piana", sets: 4, reps: "8-10", rest: 180 },
          { id: 2, name: "Trazioni alla sbarra", sets: 4, reps: "6-8", rest: 180 },
          { id: 3, name: "Military press", sets: 3, reps: "10-12", rest: 120 },
          { id: 4, name: "Rematore bilanciere", sets: 4, reps: "8-10", rest: 120 },
          { id: 5, name: "Dip alle parallele", sets: 3, reps: "10-12", rest: 90 }
        ]
      },
      {
        id: 2,
        name: "Lower Body",
        type: "Lower",
        planId: 1,
        exercises: [
          { id: 6, name: "Squat", sets: 5, reps: "5-8", rest: 240 },
          { id: 7, name: "Stacco rumeno", sets: 4, reps: "8-10", rest: 180 },
          { id: 8, name: "Leg press", sets: 4, reps: "10-12", rest: 120 },
          { id: 9, name: "Leg curl", sets: 3, reps: "12-15", rest: 90 },
          { id: 10, name: "Calf raise", sets: 4, reps: "15-20", rest: 60 }
        ]
      },
      {
        id: 3,
        name: "Full Body",
        type: "Full",
        planId: 1,
        exercises: [
          { id: 11, name: "Squat", sets: 3, reps: "8-10", rest: 180 },
          { id: 12, name: "Panca piana", sets: 3, reps: "8-10", rest: 180 },
          { id: 13, name: "Stacco da terra", sets: 3, reps: "5-8", rest: 240 },
          { id: 14, name: "Military press", sets: 3, reps: "8-10", rest: 120 },
          { id: 15, name: "Trazioni", sets: 3, reps: "8-10", rest: 120 }
        ]
      },
      {
        id: 4,
        name: "Core & Cardio",
        type: "Accessory",
        planId: 1,
        exercises: [
          { id: 16, name: "Plank", sets: 3, reps: "60s", rest: 60 },
          { id: 17, name: "Russian twist", sets: 3, reps: "20", rest: 60 },
          { id: 18, name: "Mountain climbers", sets: 3, reps: "30", rest: 60 },
          { id: 19, name: "Burpees", sets: 3, reps: "15", rest: 90 },
          { id: 20, name: "Jump rope", sets: 3, reps: "2min", rest: 60 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Ipertrofia",
    active: true,
    workouts: [
      {
        id: 5,
        name: "Push",
        type: "Push",
        planId: 2,
        exercises: [
          { id: 21, name: "Panca piana", sets: 4, reps: "10-12", rest: 120 },
          { id: 22, name: "Panca inclinata", sets: 4, reps: "10-12", rest: 120 },
          { id: 23, name: "Military press", sets: 4, reps: "10-12", rest: 90 },
          { id: 24, name: "Alzate laterali", sets: 3, reps: "12-15", rest: 60 },
          { id: 25, name: "French press", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        id: 6,
        name: "Pull",
        type: "Pull",
        planId: 2,
        exercises: [
          { id: 26, name: "Trazioni", sets: 4, reps: "10-12", rest: 120 },
          { id: 27, name: "Rematore bilanciere", sets: 4, reps: "10-12", rest: 120 },
          { id: 28, name: "Lat machine", sets: 4, reps: "12-15", rest: 90 },
          { id: 29, name: "Curl bilanciere", sets: 3, reps: "12-15", rest: 60 },
          { id: 30, name: "Face pull", sets: 3, reps: "15-20", rest: 60 }
        ]
      },
      {
        id: 7,
        name: "Legs",
        type: "Legs",
        planId: 2,
        exercises: [
          { id: 31, name: "Squat", sets: 4, reps: "10-12", rest: 180 },
          { id: 32, name: "Leg press", sets: 4, reps: "12-15", rest: 120 },
          { id: 33, name: "Leg extension", sets: 3, reps: "15-20", rest: 90 },
          { id: 34, name: "Leg curl", sets: 3, reps: "15-20", rest: 90 },
          { id: 35, name: "Calf raise", sets: 4, reps: "15-20", rest: 60 }
        ]
      },
      {
        id: 8,
        name: "Upper",
        type: "Upper",
        planId: 2,
        exercises: [
          { id: 36, name: "Panca piana", sets: 3, reps: "10-12", rest: 120 },
          { id: 37, name: "Rematore manubri", sets: 3, reps: "10-12", rest: 120 },
          { id: 38, name: "Shoulder press", sets: 3, reps: "10-12", rest: 90 },
          { id: 39, name: "Curl manubri", sets: 3, reps: "12-15", rest: 60 },
          { id: 40, name: "Tricipiti cavi", sets: 3, reps: "12-15", rest: 60 }
        ]
      }
    ]
  }
];

// Funzione helper per ottenere tutte le schede attive
export function getActivePlans(): Plan[] {
  return mockPlans.filter(plan => plan.active);
}

// Funzione helper per ottenere una scheda per ID
export function getPlanById(planId: number): Plan | undefined {
  return mockPlans.find(plan => plan.id === planId);
}

// Funzione helper per ottenere i workout di una scheda
export function getWorkoutsByPlanId(planId: number): Workout[] {
  const plan = getPlanById(planId);
  return plan ? plan.workouts : [];
}

// Funzione helper per ottenere un workout per ID
export function getWorkoutById(workoutId: number): Workout | undefined {
  for (const plan of mockPlans) {
    const workout = plan.workouts.find(w => w.id === workoutId);
    if (workout) return workout;
  }
  return undefined;
}
