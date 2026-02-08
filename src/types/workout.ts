// Types per JSON import
export interface WorkoutPlanJSON {
  name: string
  description?: string
  duration: number // settimane
  level: 'beginner' | 'intermediate' | 'advanced'
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'powerlifting' | 'general'
  workouts: WorkoutJSON[]
}

export interface WorkoutJSON {
  dayNumber: number
  name: string
  description?: string
  exercises: ExerciseJSON[]
}

export interface ExerciseJSON {
  name: string
  sets: number
  reps: string // "8-12" o "10"
  restSeconds: number
  notes?: string
  order: number
}

// Types per API responses
export interface WorkoutPlanResponse {
  id: string
  name: string
  description: string | null
  duration: number
  level: string
  goal: string
  createdAt: string
  updatedAt: string
  workouts?: WorkoutResponse[]
}

export interface WorkoutResponse {
  id: string
  planId: string
  dayNumber: number
  name: string
  description: string | null
  exercises?: ExerciseResponse[]
}

export interface ExerciseResponse {
  id: string
  workoutId: string
  name: string
  sets: number
  reps: string
  restSeconds: number
  notes: string | null
  order: number
}

export interface WorkoutSessionResponse {
  id: string
  planId: string | null
  date: string
  duration: number | null
  notes: string | null
  completed: boolean
  createdAt: string
  exerciseLogs?: ExerciseLogResponse[]
}

export interface ExerciseLogResponse {
  id: string
  sessionId: string
  exerciseId: string | null
  exerciseName: string
  setNumber: number
  reps: number
  weight: number
  rpe: number | null
  notes: string | null
  createdAt: string
}

export interface PersonalRecord {
  exerciseName: string
  maxWeight: number
  reps: number
  date: string
  sessionId: string
}

export interface ProgressData {
  exerciseName: string
  logs: Array<{
    date: string
    weight: number
    reps: number
    volume: number // weight * reps
  }>
}
