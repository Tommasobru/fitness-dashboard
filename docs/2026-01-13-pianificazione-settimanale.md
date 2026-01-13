# Pianificazione Settimanale Allenamenti

**Data**: 2026-01-13
**Tipo**: Nuova funzionalità Dashboard

## Descrizione della Funzionalità

Sostituire le sezioni "Statistiche settimanali" e "Attività recenti" con un nuovo sistema di pianificazione settimanale degli allenamenti con le seguenti caratteristiche:

1. **Riquadro principale** che mostra i 7 giorni della settimana
2. **Selettore settimana** (fuori dal riquadro, in alto a sinistra) per navigare tra settimane diverse
3. **Selettore scheda** (dentro il riquadro, in alto a destra) per scegliere la scheda di allenamento della settimana
4. **Tasto "+" per ogni giorno** per programmare un allenamento specifico per quel giorno
5. **Allenamenti filtrati per scheda**: gli allenamenti disponibili dipendono dalla scheda selezionata

## Approccio Tecnico e Architetturale

### 1. Struttura Dati

**Scheda di allenamento** (Plan):
```typescript
interface Plan {
  id: number;
  name: string;
  active: boolean;
  workouts: Workout[];  // allenamenti specifici della scheda
}

interface Workout {
  id: number;
  name: string;
  type: string;  // es. "Upper Body", "Lower Body", "Push", "Pull", ecc.
  planId: number;
}
```

**Programmazione settimanale**:
```typescript
interface WeekSchedule {
  weekId: string;  // es. "2026-W02" (anno-settimana ISO)
  planId: number;  // scheda selezionata per quella settimana
  schedule: DaySchedule[];
}

interface DaySchedule {
  date: string;     // ISO date "2026-01-13"
  dayName: string;  // "Lunedì", "Martedì", ecc.
  workoutId: number | null;  // null se riposo
}
```

### 2. Gestione dello Stato

**LocalStorage** per persistere:
- Programmazioni settimanali: `weekSchedules` (array di WeekSchedule)
- Schede disponibili: mock data inizialmente, poi da DB

**State React**:
- `selectedWeekOffset`: number (0 = settimana corrente, -1 = scorsa, +1 = prossima)
- `selectedPlanId`: number (scheda selezionata per la settimana corrente)
- `weekSchedule`: WeekSchedule (programmazione della settimana visualizzata)

### 3. UI Components

**Layout principale**:
```
┌─────────────────────────────────────────┐
│ [< Settimana 13-19 Gen 2026 >]          │  <- Fuori dal riquadro
└─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Programmazione Settimanale    [Select: Forza - Fase 1 ▼]  │ <- Header del riquadro
├─────────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐              │
│  │  Lun   │ │  Mar   │ │  Mer   │ │  Gio   │  ...         │
│  │  13    │ │  14    │ │  15    │ │  16    │              │
│  │────────│ │────────│ │────────│ │────────│              │
│  │ Upper  │ │  [+]   │ │ Lower  │ │  [+]   │              │
│  │  Body  │ │        │ │  Body  │ │        │              │
│  └────────┘ └────────┘ └────────┘ └────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Card singolo giorno**:
- Se workout programmato: mostra nome workout, click per dettagli/modifica/rimuovi
- Se riposo: mostra pulsante "+" per aggiungere workout

### 4. Componenti da Creare

**Componente principale**: `WeeklyScheduleView.tsx`
- Gestisce stato settimana e scheda selezionata
- Renderizza selettore settimana + riquadro
- Gestisce logica di navigazione settimana

**Componente secondario**: `DayCard.tsx`
- Card per singolo giorno
- Props: data, workout programmato, onClick
- Rendering condizionale: workout vs pulsante "+"

**Modal/Dropdown**: `WorkoutSelector.tsx`
- Modal o dropdown per selezionare workout da aggiungere
- Filtra workout per scheda selezionata
- Chiamato quando si clicca "+" su un giorno

### 5. Funzionalità Chiave

**Navigazione settimana**:
- Frecce "< >" per settimana precedente/successiva
- Calcolo automatico del range di date (lunedì-domenica)
- Highlight del giorno corrente se nella settimana visualizzata

**Selezione scheda**:
- Dropdown con tutte le schede attive
- Cambio scheda aggiorna gli allenamenti disponibili
- Salva associazione settimana-scheda in localStorage

**Programmazione workout**:
- Click "+" apre modal con lista workout della scheda
- Selezione workout lo assegna al giorno
- Click su workout programmato mostra opzioni: modifica/rimuovi
- Salvataggio automatico in localStorage

**Integrazione con "Allenamento di oggi"**:
- Il riquadro "Allenamento di oggi" legge dalla programmazione settimanale
- Se per oggi c'è un workout programmato, mostra "Programmato" + nome
- Click "Inizia" carica il workout programmato specifico

## File da Creare o Modificare

### File da Creare:

1. **`src/components/WeeklyScheduleView.tsx`**
   - Componente principale per la pianificazione settimanale
   - Gestisce selettore settimana e scheda
   - Renderizza grid di DayCard

2. **`src/components/DayCard.tsx`**
   - Card per singolo giorno della settimana
   - Mostra workout programmato o pulsante "+"
   - Click handlers per add/edit/remove

3. **`src/components/WorkoutSelector.tsx`**
   - Modal/Dialog per selezionare workout da programmare
   - Lista workout filtrati per scheda
   - Conferma e cancellazione

4. **`src/lib/scheduleStorage.ts`**
   - Utility per gestire localStorage della programmazione
   - CRUD per week schedules
   - Funzioni helper per date e settimane

5. **`src/lib/mockData.ts`** (opzionale)
   - Dati mock per schede e workout
   - Facilita testing e sviluppo
   - Centralizza i dati mock

### File da Modificare:

1. **`src/app/page.tsx`**
   - Rimuovere sezioni "Statistiche settimanali" e "Attività recenti"
   - Aggiungere WeeklyScheduleView al loro posto
   - Aggiornare layout grid (da 2 colonne a full width)

2. **`src/components/TodayWorkoutCard.tsx`**
   - Integrare lettura dalla programmazione settimanale
   - Verificare se oggi c'è un workout programmato
   - Passare dati workout specifico quando si inizia

3. **`src/lib/workoutStorage.ts`**
   - Modificare `createNewWorkout` per accettare workout specifico
   - Non più solo mock fisso, ma basato su programmazione

## Dipendenze e Considerazioni

### Dipendenze:
- Nessuna nuova dipendenza npm richiesta
- Usare `date-fns` o logica custom per gestione date/settimane
- Modal: usare dialog HTML nativo o componente custom

### Considerazioni:

1. **Gestione Date e Settimane**:
   - Settimana ISO: Lunedì-Domenica
   - Funzioni helper: `getWeekDates(offset)`, `formatWeekRange()`, `isToday(date)`
   - Timezone: usare date locali

2. **LocalStorage Schema**:
```typescript
{
  "weekSchedules": [
    {
      "weekId": "2026-W02",
      "planId": 1,
      "schedule": [
        { "date": "2026-01-13", "dayName": "Lunedì", "workoutId": 1 },
        { "date": "2026-01-14", "dayName": "Martedì", "workoutId": null },
        // ... altri giorni
      ]
    }
  ],
  "plans": [
    {
      "id": 1,
      "name": "Forza - Fase 1",
      "active": true,
      "workouts": [
        { "id": 1, "name": "Upper Body", "type": "Upper", "planId": 1 },
        { "id": 2, "name": "Lower Body", "type": "Lower", "planId": 1 },
        { "id": 3, "name": "Full Body", "type": "Full", "planId": 1 }
      ]
    }
  ]
}
```

3. **Mock Data Iniziali**:
   - 2 schede predefinite: "Forza - Fase 1" e "Ipertrofia"
   - Ogni scheda con 3-4 workout diversi
   - Programmazione esempio per settimana corrente

4. **UX/UI**:
   - Responsive: su mobile, scroll orizzontale per i giorni
   - Colori: giorno corrente evidenziato
   - Animazioni smooth per cambio settimana
   - Feedback visivo quando si programma/rimuove workout

5. **Validazioni**:
   - Non permettere di programmare più workout nello stesso giorno (sostituisce)
   - Warning se si cambia scheda con workout già programmati

6. **Accessibilità**:
   - Keyboard navigation per frecce settimana
   - ARIA labels per pulsanti "+"
   - Focus management nel modal

7. **Future Enhancements**:
   - Drag & drop per riordinare workout tra giorni
   - Template settimanali salvati
   - Duplicare settimana precedente
   - Notifiche per allenamenti programmati
   - Sincronizzazione con calendar esterno

## Mock Data Proposti

```typescript
// Schede mock
const mockPlans: Plan[] = [
  {
    id: 1,
    name: "Forza - Fase 1",
    active: true,
    workouts: [
      { id: 1, name: "Upper Body", type: "Upper", planId: 1 },
      { id: 2, name: "Lower Body", type: "Lower", planId: 1 },
      { id: 3, name: "Full Body", type: "Full", planId: 1 },
      { id: 4, name: "Core & Cardio", type: "Accessory", planId: 1 }
    ]
  },
  {
    id: 2,
    name: "Ipertrofia",
    active: true,
    workouts: [
      { id: 5, name: "Push", type: "Push", planId: 2 },
      { id: 6, name: "Pull", type: "Pull", planId: 2 },
      { id: 7, name: "Legs", type: "Legs", planId: 2 },
      { id: 8, name: "Upper", type: "Upper", planId: 2 }
    ]
  }
];
```

## Flusso Utente

1. **Visualizzare programmazione**:
   - Apre Dashboard
   - Vede settimana corrente con workout programmati
   - Giorno corrente evidenziato

2. **Programmare workout**:
   - Click "+" su un giorno (es. Martedì)
   - Si apre modal con lista workout della scheda selezionata
   - Seleziona "Upper Body"
   - Il giorno ora mostra "Upper Body"

3. **Cambiare scheda**:
   - Seleziona "Ipertrofia" dal dropdown in alto a destra
   - I workout disponibili cambiano (Push/Pull/Legs/Upper)
   - Può programmare i nuovi workout

4. **Navigare tra settimane**:
   - Click freccia "<" per vedere settimana scorsa
   - Click freccia ">" per vedere settimana prossima
   - Ogni settimana può avere scheda diversa

5. **Rimuovere workout**:
   - Click su workout programmato
   - Opzioni: Rimuovi / Cambia
   - Conferma rimozione

6. **Iniziare allenamento oggi**:
   - Se oggi (es. Lunedì) ha "Upper Body" programmato
   - Riquadro "Allenamento di oggi" mostra "Programmato: Upper Body"
   - Click "Inizia" carica gli esercizi di Upper Body
