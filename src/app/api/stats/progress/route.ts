import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/stats/progress - Progressi nel tempo per esercizio
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const exerciseName = searchParams.get('exerciseName')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!exerciseName) {
      return NextResponse.json(
        { error: 'exerciseName è richiesto' },
        { status: 400 }
      )
    }

    // Costruisce where clause
    const where: any = {
      exerciseName,
    }

    if (startDate || endDate) {
      where.session = {
        date: {},
      }
      if (startDate) {
        where.session.date.gte = new Date(startDate)
      }
      if (endDate) {
        where.session.date.lte = new Date(endDate)
      }
    }

    // Recupera logs con data della sessione
    const logs = await prisma.exerciseLog.findMany({
      where,
      include: {
        session: {
          select: {
            date: true,
          },
        },
      },
      orderBy: {
        session: {
          date: 'asc',
        },
      },
    })

    // Raggruppa per data e calcola volume (weight * reps)
    const progressMap = new Map<string, { weight: number; reps: number; volume: number; count: number }>()

    logs.forEach((log) => {
      const dateKey = log.session.date.toISOString().split('T')[0]
      const volume = log.weight * log.reps

      if (progressMap.has(dateKey)) {
        const existing = progressMap.get(dateKey)!
        existing.weight = Math.max(existing.weight, log.weight)
        existing.reps += log.reps
        existing.volume += volume
        existing.count++
      } else {
        progressMap.set(dateKey, {
          weight: log.weight,
          reps: log.reps,
          volume,
          count: 1,
        })
      }
    })

    // Trasforma in array
    const progress = Array.from(progressMap.entries()).map(([date, data]) => ({
      date,
      weight: data.weight,
      reps: Math.round(data.reps / data.count), // media reps
      volume: data.volume,
    }))

    return NextResponse.json({
      exerciseName,
      logs: progress,
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei progressi' },
      { status: 500 }
    )
  }
}
