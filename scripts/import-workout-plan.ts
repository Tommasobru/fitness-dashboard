#!/usr/bin/env tsx

import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { prisma } from '../src/lib/prisma'
import { workoutPlanJSONSchema } from '../src/lib/validations/workout'

async function importWorkoutPlan(filePath: string) {
  try {
    console.log(`📖 Lettura file: ${filePath}`)

    // Leggi file JSON
    const fileContent = await readFile(filePath, 'utf-8')
    const jsonData = JSON.parse(fileContent)

    // Valida struttura JSON
    console.log('✅ Validazione struttura JSON...')
    const validatedData = workoutPlanJSONSchema.parse(jsonData)

    console.log(`📝 Importazione scheda: ${validatedData.name}`)
    console.log(`   - Durata: ${validatedData.duration} settimane`)
    console.log(`   - Livello: ${validatedData.level}`)
    console.log(`   - Obiettivo: ${validatedData.goal}`)
    console.log(`   - Workouts: ${validatedData.workouts.length}`)

    // Crea piano con workouts ed exercises in transazione
    const plan = await prisma.workoutPlan.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        duration: validatedData.duration,
        level: validatedData.level,
        goal: validatedData.goal,
        jsonData: validatedData as any,
        workouts: {
          create: validatedData.workouts.map((workout) => ({
            dayNumber: workout.dayNumber,
            name: workout.name,
            description: workout.description,
            exercises: {
              create: workout.exercises.map((exercise) => ({
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps,
                restSeconds: exercise.restSeconds,
                notes: exercise.notes,
                order: exercise.order,
              })),
            },
          })),
        },
      },
      include: {
        workouts: {
          include: {
            exercises: true,
          },
        },
      },
    })

    // Conta esercizi totali
    const totalExercises = plan.workouts.reduce(
      (sum, workout) => sum + workout.exercises.length,
      0
    )

    console.log('✨ Importazione completata con successo!')
    console.log(`   - ID Piano: ${plan.id}`)
    console.log(`   - Workouts creati: ${plan.workouts.length}`)
    console.log(`   - Esercizi totali: ${totalExercises}`)

    return plan
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Errore durante l\'importazione:', error.message)
      if ('errors' in error) {
        console.error('Dettagli validazione:', (error as any).errors)
      }
    } else {
      console.error('❌ Errore sconosciuto:', error)
    }
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Gestione argomenti CLI
const args = process.argv.slice(2)

if (args.length === 0) {
  console.error('❌ Uso: tsx scripts/import-workout-plan.ts <path-to-json>')
  console.error('   Esempio: tsx scripts/import-workout-plan.ts data/exports/my-plan.json')
  process.exit(1)
}

const filePath = resolve(process.cwd(), args[0])

importWorkoutPlan(filePath)
  .then(() => {
    console.log('🎉 Processo completato!')
    process.exit(0)
  })
  .catch(() => {
    console.error('💥 Processo fallito')
    process.exit(1)
  })
