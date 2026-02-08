import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateWorkoutPlanSchema } from '@/lib/validations/workout'
import { ZodError } from 'zod'

// GET /api/workout-plans/[id] - Dettaglio scheda
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const plan = await prisma.workoutPlan.findUnique({
      where: { id },
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

    if (!plan) {
      return NextResponse.json(
        { error: 'Scheda non trovata' },
        { status: 404 }
      )
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error fetching workout plan:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero della scheda' },
      { status: 500 }
    )
  }
}

// PUT /api/workout-plans/[id] - Aggiorna scheda
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validazione input
    const validatedData = updateWorkoutPlanSchema.parse(body)

    // Verifica esistenza
    const exists = await prisma.workoutPlan.findUnique({
      where: { id },
    })

    if (!exists) {
      return NextResponse.json(
        { error: 'Scheda non trovata' },
        { status: 404 }
      )
    }

    // Aggiorna solo campi forniti
    const plan = await prisma.workoutPlan.update({
      where: { id },
      data: validatedData,
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

    return NextResponse.json(plan)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dati non validi', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating workout plan:', error)
    return NextResponse.json(
      { error: "Errore nell'aggiornamento della scheda" },
      { status: 500 }
    )
  }
}

// DELETE /api/workout-plans/[id] - Elimina scheda
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verifica esistenza
    const exists = await prisma.workoutPlan.findUnique({
      where: { id },
    })

    if (!exists) {
      return NextResponse.json(
        { error: 'Scheda non trovata' },
        { status: 404 }
      )
    }

    // Elimina (cascade eliminerà anche workouts ed exercises)
    await prisma.workoutPlan.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting workout plan:', error)
    return NextResponse.json(
      { error: "Errore nell'eliminazione della scheda" },
      { status: 500 }
    )
  }
}
