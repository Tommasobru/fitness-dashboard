import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/stats/personal-records - Record personali per esercizio
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const exerciseName = searchParams.get('exerciseName')

    // Query per trovare il peso massimo per ogni esercizio
    const records = await prisma.$queryRaw<
      Array<{
        exercise_name: string
        max_weight: number
        reps: number
        date: Date
        session_id: string
      }>
    >`
      SELECT DISTINCT ON (exercise_name)
        exercise_name,
        weight as max_weight,
        reps,
        ws.date,
        el.session_id
      FROM exercise_logs el
      JOIN workout_sessions ws ON el.session_id = ws.id
      ${exerciseName ? prisma.$queryRawUnsafe`WHERE exercise_name = ${exerciseName}` : prisma.$queryRaw``}
      ORDER BY exercise_name, weight DESC, reps DESC, ws.date DESC
    `

    // Trasforma i risultati
    const formattedRecords = records.map((record) => ({
      exerciseName: record.exercise_name,
      maxWeight: Number(record.max_weight),
      reps: record.reps,
      date: record.date.toISOString(),
      sessionId: record.session_id,
    }))

    return NextResponse.json(formattedRecords)
  } catch (error) {
    console.error('Error fetching personal records:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei record personali' },
      { status: 500 }
    )
  }
}
