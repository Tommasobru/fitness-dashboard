import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createExerciseLogSchema } from '@/lib/validations/workout'
import { ZodError } from 'zod'

// POST /api/workout-sessions/[id]/exercises - Aggiungi esercizio a sessione
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params
    const body = await request.json()

    // Validazione input
    const validatedData = createExerciseLogSchema.parse(body)

    // Verifica che la sessione esista
    const session = await prisma.workoutSession.findUnique({
      where: { id: sessionId },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Sessione non trovata' },
        { status: 404 }
      )
    }

    // Crea exercise log
    const exerciseLog = await prisma.exerciseLog.create({
      data: {
        sessionId,
        exerciseId: validatedData.exerciseId,
        exerciseName: validatedData.exerciseName,
        setNumber: validatedData.setNumber,
        reps: validatedData.reps,
        weight: validatedData.weight,
        rpe: validatedData.rpe,
        notes: validatedData.notes,
      },
    })

    return NextResponse.json(exerciseLog, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dati non validi', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating exercise log:', error)
    return NextResponse.json(
      { error: "Errore nella creazione del log esercizio" },
      { status: 500 }
    )
  }
}
