import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateExerciseLogSchema } from '@/lib/validations/workout'
import { ZodError } from 'zod'

// PUT /api/exercise-logs/[id] - Aggiorna log esercizio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validazione input
    const validatedData = updateExerciseLogSchema.parse(body)

    // Verifica esistenza
    const exists = await prisma.exerciseLog.findUnique({
      where: { id },
    })

    if (!exists) {
      return NextResponse.json(
        { error: 'Log esercizio non trovato' },
        { status: 404 }
      )
    }

    const exerciseLog = await prisma.exerciseLog.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(exerciseLog)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dati non validi', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating exercise log:', error)
    return NextResponse.json(
      { error: "Errore nell'aggiornamento del log esercizio" },
      { status: 500 }
    )
  }
}

// DELETE /api/exercise-logs/[id] - Elimina log esercizio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verifica esistenza
    const exists = await prisma.exerciseLog.findUnique({
      where: { id },
    })

    if (!exists) {
      return NextResponse.json(
        { error: 'Log esercizio non trovato' },
        { status: 404 }
      )
    }

    await prisma.exerciseLog.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting exercise log:', error)
    return NextResponse.json(
      { error: "Errore nell'eliminazione del log esercizio" },
      { status: 500 }
    )
  }
}
