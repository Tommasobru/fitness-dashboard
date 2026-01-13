# Workout Tracking Dettagliato e Allenamento Attivo

**Data**: 2026-01-13
**Tipo**: Miglioramento funzionalità workout session

## Descrizione della Funzionalità

Migliorare il sistema di tracking degli allenamenti con le seguenti funzionalità:

1. **Tasto "Inizia"** più conciso nel riquadro della Dashboard
2. **Input dettagliato per ogni serie**:
   - Carico (peso in kg)
   - Numero di ripetizioni effettuate
3. **Indicatore allenamento attivo**:
   - Pallino rosso in alto a sinistra nella Dashboard quando c'è un allenamento in corso
   - Cliccando sul pallino si riapre la sessione di allenamento attiva
4. **Navigazione migliorata**:
   - Freccia in alto a sinistra per tornare alla Dashboard
   - Mantenimento dello stato dell'allenamento quando si naviga
5. **Pulsante Termina** in fondo alla schermata workout

## Approccio Tecnico e Architetturale

### 1. Gestione dello Stato dell'Allenamento (LocalStorage)

Per persistere lo stato dell'allenamento tra le navigazioni, useremo `localStorage`:

```typescript
interface WorkoutSet {
  completed: boolean;
  weight: number | null;  // kg
  reps: number | null;    // ripetizioni effettuate
}

interface ExerciseWithSets {
  id: number;
  name: string;
  targetSets: number;
  targetReps: string;  // es. "8-10"
  rest: number;
  sets: WorkoutSet[];  // array di serie per questo esercizio
}

interface ActiveWorkout {
  id: string;  // unique ID per questa sessione
  name: string;
  planName: string;
  startTime: string;  // ISO timestamp
  exercises: ExerciseWithSets[];
}
```

**LocalStorage Key**: `"activeWorkout"`

### 2. Modifiche al Componente TodayWorkoutCard

**Cambiamenti minimi**:
- Cambiare testo pulsante da "Inizia allenamento" a "Inizia"
- Nessuna altra modifica necessaria

### 3. Modifiche alla Dashboard (page.tsx)

**Aggiungere**:
1. Controllo del localStorage per verificare se esiste un allenamento attivo
2. Indicatore visivo (pallino rosso) in alto a sinistra se allenamento attivo
3. Click handler sul pallino per navigare a `/workout-session`

**Posizionamento pallino rosso**:
- Position: fixed, top-left (es. `top-4 left-4`)
- Badge rosso con animazione pulse
- Z-index alto per essere sempre visibile
- Mostrare solo se `localStorage.getItem("activeWorkout")` esiste

### 4. Refactoring Workout Session Page

**Struttura dati modificata**:
- Ogni esercizio ha un array di `sets` (invece di un semplice boolean `completed`)
- Ogni set può avere: `completed`, `weight`, `reps`
- Un esercizio è considerato completato quando tutti i suoi set sono completati

**UI per input serie**:

Opzione A - **Accordion/Espandibile** (Consigliata):
- Di default mostrare esercizio collassato con info base
- Click per espandere e mostrare tutte le serie
- Ogni serie ha:
  - Numero serie (1, 2, 3, 4...)
  - Input carico (kg)
  - Input ripetizioni
  - Checkbox completato

Opzione B - Sempre visibili:
- Mostrare tutte le serie sempre
- Può diventare lungo con molti esercizi

**Scelta consigliata**: Opzione A per mantenere la UI pulita e scrollabile.

**Layout serie**:
```
Esercizio: Panca piana [▼]
  Serie 1: [___ kg] [___ rip] [✓]
  Serie 2: [___ kg] [___ rip] [✓]
  Serie 3: [___ kg] [___ rip] [✓]
  Serie 4: [___ kg] [___ rip] [ ]
  [Pulsante Riposo]
```

### 5. Persistenza e Sincronizzazione

**Quando salvare in localStorage**:
- Quando si inizia un allenamento (dalla Dashboard)
- Ogni volta che si completa una serie
- Ogni volta che si inserisce peso/rip
- Quando si termina l'allenamento (rimuovere da localStorage)

**Quando leggere da localStorage**:
- Dashboard: al mount, per mostrare il pallino rosso
- Workout Session: al mount, per recuperare lo stato se esiste

**Pulizia**:
- Rimuovere da localStorage quando si clicca "Termina allenamento"
- Opzionalmente: pulizia automatica se l'allenamento è più vecchio di 24h

### 6. Componente Indicatore Allenamento Attivo

Creare un nuovo componente per il pallino rosso:
`src/components/ActiveWorkoutIndicator.tsx`

Features:
- Badge circolare rosso con icona dumbbell
- Animazione pulse
- Click per navigare a `/workout-session`
- Mostrare conteggio tempo trascorso (opzionale)

Posizionamento: In alto a sinistra, fisso sopra tutto

## File da Creare o Modificare

### File da Modificare:

1. **`src/components/TodayWorkoutCard.tsx`**
   - Cambiare testo pulsante da "Inizia allenamento" a "Inizia"
   - Aggiungere logica per creare nuovo workout attivo in localStorage quando si clicca

2. **`src/app/page.tsx`**
   - Aggiungere import del nuovo componente `ActiveWorkoutIndicator`
   - Renderizzare condizionalmente l'indicatore se esiste workout attivo
   - Usare `"use client"` perché dobbiamo accedere a localStorage

3. **`src/app/workout-session/page.tsx`**
   - **Refactoring completo** della struttura dati
   - Cambiare da array di esercizi semplici a esercizi con array di serie
   - Aggiungere UI per input carico e ripetizioni per ogni serie
   - Accordion per espandere/collassare esercizi
   - Sincronizzare con localStorage ad ogni modifica
   - Al mount, controllare se esiste workout attivo in localStorage
   - Gestire correttamente il pulsante "Termina" (pulire localStorage)

### File da Creare:

1. **`src/components/ActiveWorkoutIndicator.tsx`**
   - Componente client per l'indicatore allenamento attivo
   - Badge rosso con animazione pulse
   - Click handler per navigare a workout-session

2. **`src/lib/workoutStorage.ts` (opzionale ma consigliato)**
   - Utility functions per gestire localStorage
   - `saveWorkout(workout: ActiveWorkout): void`
   - `loadWorkout(): ActiveWorkout | null`
   - `clearWorkout(): void`
   - `isWorkoutActive(): boolean`
   - Incapsulare la logica di storage in un unico posto

## Dipendenze e Considerazioni

### Dipendenze:
- Nessuna nuova dipendenza npm richiesta
- Usa React hooks (useState, useEffect)
- LocalStorage API nativa del browser

### Considerazioni:

1. **SSR e LocalStorage**:
   - LocalStorage è disponibile solo nel client
   - Usare `"use client"` e controllare `typeof window !== 'undefined'`
   - Evitare errori di hydration usando `useEffect` per leggere localStorage

2. **Validazione Input**:
   - Carico: numeri positivi con decimali (es. 67.5 kg)
   - Ripetizioni: numeri interi positivi
   - Validazione client-side basilare

3. **UX/UI**:
   - Input numerici con tastiera numerica su mobile (`type="number"`)
   - Placeholder con valori suggeriti (es. ultimo peso usato)
   - Autofocus sul primo input quando si espande una serie
   - Disabilitare input quando la serie è completata (optional)

4. **Accessibilità**:
   - Label appropriati per screen reader
   - Focus management quando si espande accordion
   - Feedback visivo chiaro per stati (completato, in corso, da fare)

5. **Performance**:
   - Debounce degli aggiornamenti localStorage se necessario
   - Evitare re-render inutili con useCallback/useMemo

6. **Future Enhancements**:
   - Salvare storico allenamenti in database
   - Suggerimenti peso basati su storico
   - Grafici di progressione
   - Export dati allenamento

## Mock Data Modificati

Struttura dati aggiornata per esercizi con serie:

```typescript
const mockExercises: ExerciseWithSets[] = [
  {
    id: 1,
    name: "Panca piana",
    targetSets: 4,
    targetReps: "8-10",
    rest: 180,
    sets: [
      { completed: false, weight: null, reps: null },
      { completed: false, weight: null, reps: null },
      { completed: false, weight: null, reps: null },
      { completed: false, weight: null, reps: null },
    ]
  },
  // ... altri esercizi
];
```

## Flusso Utente Completo

1. **Iniziare allenamento**:
   - Dashboard → Click "Inizia" su riquadro allenamento
   - Crea nuovo workout attivo in localStorage
   - Naviga a `/workout-session`

2. **Durante l'allenamento**:
   - Espande un esercizio
   - Inserisce peso e ripetizioni per la prima serie
   - Completa la serie (checkbox)
   - Click "Riposo" → timer countdown
   - Ripete per tutte le serie e tutti gli esercizi

3. **Navigare via e tornare**:
   - Click freccia in alto a sinistra → torna alla Dashboard
   - Vede pallino rosso in alto a sinistra
   - Click pallino rosso → riapre workout-session con stato preservato

4. **Terminare allenamento**:
   - Click "Termina allenamento" in fondo alla pagina
   - Conferma (se non tutto completato)
   - Rimuove da localStorage
   - Torna alla Dashboard
   - Pallino rosso scompare

## UI/UX Dettagli

### Badge Allenamento Attivo:
```
Posizione: fixed top-4 left-4
Dimensioni: w-12 h-12 (tailwind)
Colore: bg-red-500
Animazione: animate-pulse
Icona: dumbbell bianca
```

### Input Serie:
```
Layout: Grid 3 colonne (Peso | Rip | Check)
Peso: input number con "kg" suffix
Rip: input number
Check: checkbox grande e cliccabile
Border: evidenziato quando è la serie corrente
```

### Accordion Esercizio:
```
Header: Nome + badge progresso serie (2/4)
Collapsed: Mostra solo header + target
Expanded: Mostra tutte le serie + pulsante riposo
Transizione: smooth con duration-200
```
