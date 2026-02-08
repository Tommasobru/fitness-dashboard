# API Documentation

Documentazione completa delle API REST per Fitness Dashboard.

## Base URL

```
http://localhost:3000/api
```

---

## Workout Plans (Schede di Allenamento)

### `GET /api/workout-plans`

Lista tutte le schede di allenamento.

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "PPL - Push Pull Legs",
    "description": "Programma 6 giorni settimanali...",
    "duration": 12,
    "level": "intermediate",
    "goal": "hypertrophy",
    "createdAt": "2026-02-08T10:00:00.000Z",
    "updatedAt": "2026-02-08T10:00:00.000Z"
  }
]
```

---

### `POST /api/workout-plans`

Crea una nuova scheda di allenamento.

**Body**:
```json
{
  "name": "PPL - Push Pull Legs",
  "description": "Programma 6 giorni settimanali",
  "duration": 12,
  "level": "intermediate",
  "goal": "hypertrophy",
  "workouts": [
    {
      "dayNumber": 1,
      "name": "Push A",
      "description": "Petto e spalle",
      "exercises": [
        {
          "name": "Panca Piana",
          "sets": 4,
          "reps": "8-10",
          "restSeconds": 120,
          "notes": "Controllato",
          "order": 1
        }
      ]
    }
  ]
}
```

**Validazione**:
- `name`: stringa (richiesto)
- `duration`: numero intero positivo (richiesto)
- `level`: "beginner" | "intermediate" | "advanced" (richiesto)
- `goal`: "strength" | "hypertrophy" | "endurance" | "powerlifting" | "general" (richiesto)
- `workouts`: array con almeno 1 workout (richiesto)
- `dayNumber`: 1-7
- `exercises`: array con almeno 1 esercizio

**Response**: `201 Created`
```json
{
  "id": "uuid",
  "name": "PPL - Push Pull Legs",
  "...": "...",
  "workouts": [
    {
      "id": "uuid",
      "exercises": [...]
    }
  ]
}
```

---

### `GET /api/workout-plans/{id}`

Recupera una scheda specifica con tutti i workout ed esercizi.

**Response**:
```json
{
  "id": "uuid",
  "name": "PPL - Push Pull Legs",
  "description": "...",
  "duration": 12,
  "level": "intermediate",
  "goal": "hypertrophy",
  "jsonData": { ... },
  "createdAt": "2026-02-08T10:00:00.000Z",
  "updatedAt": "2026-02-08T10:00:00.000Z",
  "workouts": [
    {
      "id": "uuid",
      "dayNumber": 1,
      "name": "Push A",
      "description": "...",
      "exercises": [
        {
          "id": "uuid",
          "name": "Panca Piana",
          "sets": 4,
          "reps": "8-10",
          "restSeconds": 120,
          "notes": "...",
          "order": 1
        }
      ]
    }
  ]
}
```

---

### `PUT /api/workout-plans/{id}`

Aggiorna i metadati di una scheda (non modifica workout/esercizi).

**Body** (tutti i campi opzionali):
```json
{
  "name": "PPL Modificato",
  "description": "Nuova descrizione",
  "duration": 16,
  "level": "advanced",
  "goal": "strength"
}
```

**Response**: `200 OK` con scheda aggiornata

---

### `DELETE /api/workout-plans/{id}`

Elimina una scheda (cascade elimina anche workout ed esercizi).

**Response**: `200 OK`
```json
{
  "success": true
}
```

---

## Workout Sessions (Sessioni di Allenamento)

### `GET /api/workout-sessions`

Lista sessioni di allenamento con filtri.

**Query Params**:
- `planId` (optional): UUID della scheda
- `startDate` (optional): ISO date string (es. "2026-02-01T00:00:00.000Z")
- `endDate` (optional): ISO date string
- `limit` (optional): numero (default 50, max 100)
- `offset` (optional): numero (default 0)

**Example**:
```
GET /api/workout-sessions?planId=uuid&startDate=2026-02-01T00:00:00.000Z&limit=10
```

**Response**:
```json
{
  "sessions": [
    {
      "id": "uuid",
      "planId": "uuid",
      "date": "2026-02-08T10:00:00.000Z",
      "duration": 75,
      "notes": "Ottimo workout",
      "completed": true,
      "createdAt": "2026-02-08T10:30:00.000Z",
      "plan": {
        "id": "uuid",
        "name": "PPL - Push Pull Legs"
      },
      "exerciseLogs": [...]
    }
  ],
  "total": 42,
  "limit": 10,
  "offset": 0
}
```

---

### `POST /api/workout-sessions`

Crea una nuova sessione di allenamento.

**Body**:
```json
{
  "planId": "uuid",
  "date": "2026-02-08T10:00:00.000Z",
  "duration": 75,
  "notes": "Buona sessione",
  "completed": true
}
```

**Validazione**:
- `planId`: UUID (opzionale)
- `date`: ISO date string (opzionale, default: now)
- `duration`: numero intero positivo (opzionale)
- `notes`: stringa (opzionale)
- `completed`: boolean (opzionale, default: true)

**Response**: `201 Created` con sessione creata

---

### `GET /api/workout-sessions/{id}`

Recupera una sessione specifica con tutti i log degli esercizi.

**Response**:
```json
{
  "id": "uuid",
  "planId": "uuid",
  "date": "2026-02-08T10:00:00.000Z",
  "duration": 75,
  "notes": "...",
  "completed": true,
  "createdAt": "2026-02-08T10:30:00.000Z",
  "plan": {
    "id": "uuid",
    "name": "PPL - Push Pull Legs"
  },
  "exerciseLogs": [
    {
      "id": "uuid",
      "exerciseName": "Panca Piana",
      "setNumber": 1,
      "reps": 10,
      "weight": 80.0,
      "rpe": 7,
      "notes": null,
      "createdAt": "2026-02-08T10:15:00.000Z"
    }
  ]
}
```

---

### `PUT /api/workout-sessions/{id}`

Aggiorna una sessione.

**Body** (tutti i campi opzionali):
```json
{
  "date": "2026-02-08T11:00:00.000Z",
  "duration": 90,
  "notes": "Aggiornamento note",
  "completed": true
}
```

**Response**: `200 OK` con sessione aggiornata

---

### `DELETE /api/workout-sessions/{id}`

Elimina una sessione (cascade elimina anche i log degli esercizi).

**Response**: `200 OK`
```json
{
  "success": true
}
```

---

## Exercise Logs (Log Esercizi)

### `POST /api/workout-sessions/{sessionId}/exercises`

Aggiungi un log di esercizio a una sessione.

**Body**:
```json
{
  "exerciseId": "uuid",
  "exerciseName": "Panca Piana",
  "setNumber": 1,
  "reps": 10,
  "weight": 80.0,
  "rpe": 7,
  "notes": "Buona serie"
}
```

**Validazione**:
- `exerciseId`: UUID (opzionale - riferimento all'esercizio nella scheda)
- `exerciseName`: stringa (richiesto)
- `setNumber`: numero intero positivo (richiesto)
- `reps`: numero intero >= 0 (richiesto)
- `weight`: numero >= 0 (richiesto)
- `rpe`: numero intero 1-10 (opzionale - Rate of Perceived Exertion)
- `notes`: stringa (opzionale)

**Response**: `201 Created` con log creato

---

### `PUT /api/exercise-logs/{id}`

Aggiorna un log di esercizio.

**Body** (tutti i campi opzionali):
```json
{
  "exerciseName": "Panca Piana Modificato",
  "setNumber": 2,
  "reps": 8,
  "weight": 85.0,
  "rpe": 8,
  "notes": "Serie difficile"
}
```

**Response**: `200 OK` con log aggiornato

---

### `DELETE /api/exercise-logs/{id}`

Elimina un log di esercizio.

**Response**: `200 OK`
```json
{
  "success": true
}
```

---

## Statistics (Statistiche)

### `GET /api/stats/personal-records`

Recupera i record personali (peso massimo) per ogni esercizio.

**Query Params**:
- `exerciseName` (optional): filtra per un esercizio specifico

**Example**:
```
GET /api/stats/personal-records?exerciseName=Panca%20Piana
```

**Response**:
```json
[
  {
    "exerciseName": "Panca Piana",
    "maxWeight": 100.0,
    "reps": 5,
    "date": "2026-02-08T10:00:00.000Z",
    "sessionId": "uuid"
  },
  {
    "exerciseName": "Squat",
    "maxWeight": 140.0,
    "reps": 8,
    "date": "2026-02-07T09:00:00.000Z",
    "sessionId": "uuid"
  }
]
```

---

### `GET /api/stats/progress`

Recupera i progressi nel tempo per un esercizio specifico.

**Query Params**:
- `exerciseName` (required): nome dell'esercizio
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Example**:
```
GET /api/stats/progress?exerciseName=Panca%20Piana&startDate=2026-01-01T00:00:00.000Z
```

**Response**:
```json
{
  "exerciseName": "Panca Piana",
  "logs": [
    {
      "date": "2026-02-01",
      "weight": 80.0,
      "reps": 10,
      "volume": 800.0
    },
    {
      "date": "2026-02-05",
      "weight": 85.0,
      "reps": 9,
      "volume": 765.0
    },
    {
      "date": "2026-02-08",
      "weight": 90.0,
      "reps": 8,
      "volume": 720.0
    }
  ]
}
```

**Note**:
- I dati sono raggruppati per data
- `weight`: peso massimo sollevato in quella data
- `reps`: media delle ripetizioni
- `volume`: volume totale (peso × reps) di tutte le serie

---

## Error Responses

Tutte le API possono restituire questi errori:

### `400 Bad Request`
```json
{
  "error": "Dati non validi",
  "details": [
    {
      "path": ["name"],
      "message": "Nome scheda richiesto"
    }
  ]
}
```

### `404 Not Found`
```json
{
  "error": "Scheda non trovata"
}
```

### `500 Internal Server Error`
```json
{
  "error": "Errore nel recupero delle schede"
}
```

---

## Testing con cURL

### Crea una scheda:
```bash
curl -X POST http://localhost:3000/api/workout-plans \
  -H "Content-Type: application/json" \
  -d @data/exports/example_plan.json
```

### Lista schede:
```bash
curl http://localhost:3000/api/workout-plans
```

### Crea una sessione:
```bash
curl -X POST http://localhost:3000/api/workout-sessions \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "your-plan-uuid",
    "date": "2026-02-08T10:00:00.000Z",
    "duration": 75
  }'
```

### Aggiungi esercizio a sessione:
```bash
curl -X POST http://localhost:3000/api/workout-sessions/{sessionId}/exercises \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseName": "Panca Piana",
    "setNumber": 1,
    "reps": 10,
    "weight": 80.0,
    "rpe": 7
  }'
```

### Record personali:
```bash
curl http://localhost:3000/api/stats/personal-records
```

### Progressi:
```bash
curl "http://localhost:3000/api/stats/progress?exerciseName=Panca%20Piana"
```

---

## Prossimi Passi

Ora che le API sono pronte, puoi:
1. Testare gli endpoints con cURL o Postman
2. Creare componenti React per l'UI
3. Integrare con React Query o SWR per il caching
4. Aggiungere autenticazione (NextAuth.js)
5. Implementare real-time updates (Supabase Realtime)
