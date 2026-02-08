import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createWorkoutPlanSchema } from '@/lib/validations/workout'
import { ZodError } from 'zod'

// GET /api/workout-plans - Lista tutte le schede
export async function GET() {
  try {
    const plans = await prisma.workoutPlan.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        level: true,
        goal: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching workout plans:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero delle schede' },
      { status: 500 }
    )
  }
}

// POST /api/workout-plans - Crea nuova scheda
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validazione input
    const validatedData = createWorkoutPlanSchema.parse(body)

    // Crea piano con workouts ed exercises in una transazione
    const plan = await prisma.workoutPlan.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        duration: validatedData.duration,
        level: validatedData.level,
        goal: validatedData.goal,
        jsonData: validatedData, // salva JSON originale
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
            exercises: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            dayNumber: 'asc',
          },
        },
      },
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dati non validi', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating workout plan:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione della scheda' },
      { status: 500 }
    )
  }
}
