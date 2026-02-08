import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateWorkoutSessionSchema } from '@/lib/validations/workout'
import { ZodError } from 'zod'

// GET /api/workout-sessions/[id] - Dettaglio sessione
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const session = await prisma.workoutSession.findUnique({
      where: { id },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
          },
        },
        exerciseLogs: {
          orderBy: [
            { exerciseName: 'asc' },
            { setNumber: 'asc' },
          ],
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Sessione non trovata' },
        { status: 404 }
      )
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching workout session:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero della sessione' },
      { status: 500 }
    )
  }
}

// PUT /api/workout-sessions/[id] - Aggiorna sessione
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validazione input
    const validatedData = updateWorkoutSessionSchema.parse(body)

    // Verifica esistenza
    const exists = await prisma.workoutSession.findUnique({
      where: { id },
    })

    if (!exists) {
      return NextResponse.json(
        { error: 'Sessione non trovata' },
        { status: 404 }
      )
    }

    // Prepara dati per update
    const updateData: any = {}
    if (validatedData.date !== undefined) {
      updateData.date = new Date(validatedData.date)
    }
    if (validatedData.duration !== undefined) {
      updateData.duration = validatedData.duration
    }
    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes
    }
    if (validatedData.completed !== undefined) {
      updateData.completed = validatedData.completed
    }

    const session = await prisma.workoutSession.update({
      where: { id },
      data: updateData,
      include: {
        plan: {
          select: {
            id: true,
            name: true,
          },
        },
        exerciseLogs: {
          orderBy: [
            { exerciseName: 'asc' },
            { setNumber: 'asc' },
          ],
        },
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dati non validi', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating workout session:', error)
    return NextResponse.json(
      { error: "Errore nell'aggiornamento della sessione" },
      { status: 500 }
    )
  }
}

// DELETE /api/workout-sessions/[id] - Elimina sessione
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verifica esistenza
    const exists = await prisma.workoutSession.findUnique({
      where: { id },
    })

    if (!exists) {
      return NextResponse.json(
        { error: 'Sessione non trovata' },
        { status: 404 }
      )
    }

    // Elimina (cascade eliminerà anche exercise logs)
    await prisma.workoutSession.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting workout session:', error)
    return NextResponse.json(
      { error: "Errore nell'eliminazione della sessione" },
      { status: 500 }
    )
  }
}
