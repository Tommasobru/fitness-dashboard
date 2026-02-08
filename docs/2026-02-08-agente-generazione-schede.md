# Agente Python per Generazione Schede Allenamento

**Data**: 2026-02-08

## Descrizione

Implementazione dell'agente Python che, partendo dai dati del form "Crea Nuova Scheda" (`plan_export.json`), genera una scheda di allenamento completa utilizzando l'API di Anthropic Claude. La scheda generata viene salvata in formato compatibile con lo script di import nel database (`import-workout-plan.ts`).

## Flusso Operativo

```
Form UI (/plans/new)
    │ "Esporta per AI"
    ▼
plan_export.json (data/exports/)
    │
    ▼
workout_generator.py (Python agent)
    │ Anthropic Claude API
    ▼
generated_plan.json (data/exports/)
    │
    ▼
import-workout-plan.ts → Database PostgreSQL
```

## Approccio Tecnico

### Integrazione Anthropic Claude API
- L'agente usa `anthropic` Python SDK per chiamare Claude
- La API key viene letta da variabile d'ambiente `ANTHROPIC_API_KEY` (o file `.env`)
- L'utente inserirà la key autonomamente quando pronto
- Se la key non è configurata, l'agente mostra un messaggio di errore chiaro

### Prompt Engineering
- System prompt con ruolo di esperto di programmazione allenamenti
- Il prompt include tutti i dati dal form: tipo allenamento, equipaggiamento, frequenza, durata, note
- Il prompt richiede output JSON strutturato nel formato `WorkoutPlanJSON`
- Mapping automatico: `trainingType` (ita) → `goal` (eng) per il DB

### Formato Output
Il JSON generato deve rispettare esattamente il formato di `example_plan.json`:

```json
{
  "name": "...",
  "description": "...",
  "duration": 8,
  "level": "intermediate",
  "goal": "hypertrophy",
  "workouts": [
    {
      "dayNumber": 1,
      "name": "...",
      "description": "...",
      "exercises": [
        {
          "name": "...",
          "sets": 4,
          "reps": "8-10",
          "restSeconds": 90,
          "notes": "...",
          "order": 1
        }
      ]
    }
  ]
}
```

### Mapping trainingType → goal/level
- `ipertrofia` → `goal: "hypertrophy"`
- `forza` → `goal: "strength"`
- `resistenza` → `goal: "endurance"`
- `level`: inferito dall'agente in base al contesto (default: `"intermediate"`)

## File Modificati

| File | Azione | Descrizione |
|------|--------|-------------|
| `scripts/python/agents/workout_generator.py` | **Modifica** | Implementazione completa con Anthropic API |
| `scripts/python/requirements.txt` | **Modifica** | Aggiunta dipendenza `anthropic` |
| `scripts/python/.env.example` | **Crea** | Template per variabili d'ambiente |

## Dipendenze

- `anthropic>=0.18.0` - SDK Python per Claude API
- `python-dotenv>=1.0.0` - Caricamento variabili d'ambiente da `.env`

## Considerazioni

- L'agente NON contiene API key hardcoded
- Il file `.env` è già nel `.gitignore`
- Il prompt viene costruito dinamicamente in base ai dati del form
- La risposta di Claude viene validata e parsata come JSON prima dell'export
- In caso di errore nella generazione o parsing, vengono mostrati messaggi chiari
