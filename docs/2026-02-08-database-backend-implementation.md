# Database e Sistema Backend - Fitness Dashboard
**Data**: 2026-02-08

## Descrizione della Funzionalità

Implementazione di un database PostgreSQL e sistema backend per gestire:
1. **Schede di allenamento**: memorizzazione di programmi di training generati (inizialmente da JSON a tabelle relazionali)
2. **Sessioni di allenamento**: registrazione degli allenamenti effettuati
3. **Esercizi eseguiti**: tracciamento di ripetizioni, serie e pesi per ogni esercizio

## Approccio Tecnico

### Stack Tecnologico
- **Database**: PostgreSQL
- **ORM**: Prisma (integrazione nativa con Next.js, type-safe, migrations)
- **Backend**: Next.js API Routes (App Router - Route Handlers)
- **Validazione**: Zod per validazione dati
- **Client**: Prisma Client per query type-safe

### Schema Database

#### Tabella `WorkoutPlan` (Schede di allenamento)
```prisma
model WorkoutPlan {
  id          String   @id @default(uuid())
  name        String
  description String?
  duration    Int      // durata in settimane
  level       String   // beginner, intermediate, advanced
  goal        String   // strength, hypertrophy, endurance
  jsonData    Json     // dati completi del JSON originale
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workouts    Workout[]
  sessions    WorkoutSession[]
}
```

#### Tabella `Workout` (Allenamenti nella scheda)
```prisma
model Workout {
  id            String   @id @default(uuid())
  planId        String
  dayNumber     Int      // giorno nella settimana (1-7)
  name          String
  description   String?

  plan          WorkoutPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  exercises     Exercise[]

  @@unique([planId, dayNumber])
}
```

#### Tabella `Exercise` (Esercizi nel workout)
```prisma
model Exercise {
  id          String   @id @default(uuid())
  workoutId   String
  name        String
  sets        Int
  reps        String   // può essere "8-12" o "10"
  restSeconds Int
  notes       String?
  order       Int      // ordine nell'allenamento

  workout     Workout @relation(fields: [workoutId], references: [id], onDelete: Cascade)
  logs        ExerciseLog[]
}
```

#### Tabella `WorkoutSession` (Sessione di allenamento effettuata)
```prisma
model WorkoutSession {
  id          String   @id @default(uuid())
  planId      String?
  workoutId   String?
  date        DateTime @default(now())
  duration    Int?     // durata in minuti
  notes       String?
  completed   Boolean  @default(true)

  plan        WorkoutPlan? @relation(fields: [planId], references: [id])
  exerciseLogs ExerciseLog[]

  createdAt   DateTime @default(now())
}
```

#### Tabella `ExerciseLog` (Registro esecuzione esercizio)
```prisma
model ExerciseLog {
  id          String   @id @default(uuid())
  sessionId   String
  exerciseId  String?  // riferimento all'esercizio nella scheda (opzionale)
  exerciseName String  // nome dell'esercizio
  setNumber   Int      // numero della serie
  reps        Int      // ripetizioni effettuate
  weight      Float    // peso utilizzato (kg)
  rpe         Int?     // Rate of Perceived Exertion (1-10)
  notes       String?

  session     WorkoutSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  exercise    Exercise? @relation(fields: [exerciseId], references: [id])

  createdAt   DateTime @default(now())
}
```

### API Routes

#### Workout Plans
- `POST /api/workout-plans` - Crea nuova scheda (da JSON)
- `GET /api/workout-plans` - Lista tutte le schede
- `GET /api/workout-plans/[id]` - Dettaglio scheda
- `PUT /api/workout-plans/[id]` - Aggiorna scheda
- `DELETE /api/workout-plans/[id]` - Elimina scheda

#### Workout Sessions
- `POST /api/workout-sessions` - Crea nuova sessione
- `GET /api/workout-sessions` - Lista sessioni (con filtri: data, piano)
- `GET /api/workout-sessions/[id]` - Dettaglio sessione
- `PUT /api/workout-sessions/[id]` - Aggiorna sessione
- `DELETE /api/workout-sessions/[id]` - Elimina sessione

#### Exercise Logs
- `POST /api/workout-sessions/[sessionId]/exercises` - Aggiungi esercizio a sessione
- `PUT /api/exercise-logs/[id]` - Aggiorna log esercizio
- `DELETE /api/exercise-logs/[id]` - Elimina log esercizio

#### Statistics
- `GET /api/stats/personal-records` - Record personali per esercizio
- `GET /api/stats/progress` - Progressi nel tempo

### Script di Importazione JSON
File: `scripts/import-workout-plan.ts`
- Legge file JSON con scheda di allenamento
- Valida struttura dati
- Crea record in database con relazioni

## File da Creare

### Setup e Configurazione
1. **`prisma/schema.prisma`** - Schema database Prisma
2. **`.env.example`** - Template variabili ambiente
3. **`src/lib/prisma.ts`** - Client Prisma singleton
4. **`src/lib/validations/workout.ts`** - Schemi Zod per validazione

### API Routes (App Router)
5. **`src/app/api/workout-plans/route.ts`** - GET/POST piani
6. **`src/app/api/workout-plans/[id]/route.ts`** - GET/PUT/DELETE piano specifico
7. **`src/app/api/workout-sessions/route.ts`** - GET/POST sessioni
8. **`src/app/api/workout-sessions/[id]/route.ts`** - GET/PUT/DELETE sessione
9. **`src/app/api/workout-sessions/[sessionId]/exercises/route.ts`** - POST esercizio
10. **`src/app/api/exercise-logs/[id]/route.ts`** - PUT/DELETE log esercizio
11. **`src/app/api/stats/personal-records/route.ts`** - GET record personali
12. **`src/app/api/stats/progress/route.ts`** - GET progressi

### Utility e Script
13. **`scripts/import-workout-plan.ts`** - Script importazione JSON
14. **`src/lib/db/queries.ts`** - Query comuni riutilizzabili
15. **`src/types/workout.ts`** - TypeScript types per workout data

## File da Modificare

1. **`package.json`** - Aggiungere dipendenze:
   - `prisma` e `@prisma/client`
   - `zod`

2. **`.gitignore`** - Aggiungere:
   - `.env`
   - `prisma/migrations/` (opzionale per dev)

## Dipendenze da Installare

```bash
npm install @prisma/client
npm install -D prisma
npm install zod
```

## Setup Database

### Opzioni per PostgreSQL:

#### Opzione 1: Locale (Docker)
```bash
docker run --name fitness-postgres \
  -e POSTGRES_PASSWORD=fitness2024 \
  -e POSTGRES_DB=fitness_dashboard \
  -p 5432:5432 \
  -d postgres:16-alpine
```

**Database URL**: `postgresql://postgres:fitness2024@localhost:5432/fitness_dashboard`

#### Opzione 2: Cloud (Supabase - Free Tier)
- Setup veloce senza infrastruttura locale
- Include dashboard per gestione DB
- Free tier: 500 MB database, connessioni illimitate
- **Consigliato per sviluppo e testing**

#### Opzione 3: Cloud (Neon - Free Tier)
- PostgreSQL serverless
- Free tier: 512 MB storage
- Auto-scaling e branching

### Primo Setup

1. Installare dipendenze
2. Creare `.env` con `DATABASE_URL`
3. Eseguire `npx prisma migrate dev --name init` (crea database e tabelle)
4. Eseguire `npx prisma generate` (genera Prisma Client)
5. (Opzionale) Eseguire seed per dati di test

## Formato JSON Scheda di Allenamento

```json
{
  "name": "PPL - Push Pull Legs",
  "description": "Programma 6 giorni per ipertrofia",
  "duration": 12,
  "level": "intermediate",
  "goal": "hypertrophy",
  "workouts": [
    {
      "dayNumber": 1,
      "name": "Push A",
      "exercises": [
        {
          "name": "Panca Piana Bilanciere",
          "sets": 4,
          "reps": "8-10",
          "restSeconds": 120,
          "order": 1
        },
        {
          "name": "Shoulder Press Manubri",
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 90,
          "order": 2
        }
      ]
    }
  ]
}
```

## Considerazioni

### Sicurezza
- Validazione input con Zod su tutte le API
- Rate limiting sulle API (implementabile con middleware)
- Sanitizzazione dati JSON prima del salvataggio

### Performance
- Indici su campi frequentemente cercati (date, planId, exerciseName)
- Pagination per liste lunghe (sessioni, logs)
- Caching con React Query/SWR lato client

### Scalabilità
- Schema relazionale normalizzato
- Soft delete per dati sensibili (opzionale)
- Supporto per multi-utente futuro (aggiungere campo `userId`)

### Migration Path
1. **Fase 1**: Setup base (schema + API CRUD)
2. **Fase 2**: Script importazione JSON
3. **Fase 3**: Integrazione UI con API
4. **Fase 4**: Statistiche e analytics

## Prossimi Passi

Dopo conferma:
1. Installare dipendenze (Prisma, Zod)
2. Creare schema Prisma
3. Decidere opzione database (Docker locale, Supabase, o Neon)
4. Setup database e prima migration
5. Implementare API Routes base
6. Creare script importazione JSON
7. Testare flusso completo con dati di esempio
