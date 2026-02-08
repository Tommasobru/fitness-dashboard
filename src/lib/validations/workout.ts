import { z } from 'zod'

// Schema per validazione JSON import
export const exerciseJSONSchema = z.object({
  name: z.string().min(1, 'Nome esercizio richiesto'),
  sets: z.number().int().positive('Sets deve essere positivo'),
  reps: z.string().min(1, 'Reps richiesto'), // "8-12" o "10"
  restSeconds: z.number().int().min(0, 'Rest seconds deve essere >= 0'),
  notes: z.string().optional(),
  order: z.number().int().min(1, 'Order deve essere >= 1'),
})

export const workoutJSONSchema = z.object({
  dayNumber: z.number().int().min(1).max(7, 'Day number deve essere tra 1 e 7'),
  name: z.string().min(1, 'Nome workout richiesto'),
  description: z.string().optional(),
  exercises: z.array(exerciseJSONSchema).min(1, 'Almeno un esercizio richiesto'),
})

export const workoutPlanJSONSchema = z.object({
  name: z.string().min(1, 'Nome scheda richiesto'),
  description: z.string().optional(),
  duration: z.number().int().positive('Durata deve essere positiva'),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Level deve essere beginner, intermediate o advanced' }),
  }),
  goal: z.enum(['strength', 'hypertrophy', 'endurance', 'powerlifting', 'general'], {
    errorMap: () => ({ message: 'Goal non valido' }),
  }),
  workouts: z.array(workoutJSONSchema).min(1, 'Almeno un workout richiesto'),
})

// Schema per creazione workout plan via API
export const createWorkoutPlanSchema = workoutPlanJSONSchema

// Schema per update workout plan
export const updateWorkoutPlanSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  goal: z.enum(['strength', 'hypertrophy', 'endurance', 'powerlifting', 'general']).optional(),
})

// Schema per creazione workout session
export const createWorkoutSessionSchema = z.object({
  planId: z.string().uuid().optional(),
  date: z.string().datetime().optional(),
  duration: z.number().int().positive().optional(),
  notes: z.string().optional(),
  completed: z.boolean().optional(),
})

// Schema per update workout session
export const updateWorkoutSessionSchema = z.object({
  date: z.string().datetime().optional(),
  duration: z.number().int().positive().optional(),
  notes: z.string().optional(),
  completed: z.boolean().optional(),
})

// Schema per creazione exercise log
export const createExerciseLogSchema = z.object({
  exerciseId: z.string().uuid().optional(),
  exerciseName: z.string().min(1, 'Nome esercizio richiesto'),
  setNumber: z.number().int().positive('Set number deve essere positivo'),
  reps: z.number().int().min(0, 'Reps deve essere >= 0'),
  weight: z.number().min(0, 'Weight deve essere >= 0'),
  rpe: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
})

// Schema per update exercise log
export const updateExerciseLogSchema = z.object({
  exerciseName: z.string().min(1).optional(),
  setNumber: z.number().int().positive().optional(),
  reps: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  rpe: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
})

// Schema per query params
export const workoutSessionQuerySchema = z.object({
  planId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().min(0).optional(),
})

export type WorkoutPlanJSON = z.infer<typeof workoutPlanJSONSchema>
export type CreateWorkoutPlanInput = z.infer<typeof createWorkoutPlanSchema>
export type UpdateWorkoutPlanInput = z.infer<typeof updateWorkoutPlanSchema>
export type CreateWorkoutSessionInput = z.infer<typeof createWorkoutSessionSchema>
export type UpdateWorkoutSessionInput = z.infer<typeof updateWorkoutSessionSchema>
export type CreateExerciseLogInput = z.infer<typeof createExerciseLogSchema>
export type UpdateExerciseLogInput = z.infer<typeof updateExerciseLogSchema>
export type WorkoutSessionQuery = z.infer<typeof workoutSessionQuerySchema>
