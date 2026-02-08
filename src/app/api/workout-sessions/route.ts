import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createWorkoutSessionSchema } from '@/lib/validations/workout'
import { ZodError } from 'zod'

// GET /api/workout-sessions - Lista sessioni con filtri
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const planId = searchParams.get('planId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}

    if (planId) {
      where.planId = planId
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }

    const [sessions, total] = await Promise.all([
      prisma.workoutSession.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: {
          date: 'desc',
        },
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
      }),
      prisma.workoutSession.count({ where }),
    ])

    return NextResponse.json({
      sessions,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching workout sessions:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero delle sessioni' },
      { status: 500 }
    )
  }
}

// POST /api/workout-sessions - Crea nuova sessione
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validazione input
    const validatedData = createWorkoutSessionSchema.parse(body)

    const session = await prisma.workoutSession.create({
      data: {
        planId: validatedData.planId,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        duration: validatedData.duration,
        notes: validatedData.notes,
        completed: validatedData.completed ?? true,
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dati non validi', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating workout session:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione della sessione' },
      { status: 500 }
    )
  }
}
