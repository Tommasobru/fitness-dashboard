# Dashboard - Allenamento di Oggi

**Data**: 2026-01-13
**Tipo**: Modifica funzionalità Dashboard

## Descrizione della Funzionalità

Semplificare e migliorare la sezione dei riquadri statistici nella Dashboard principale con le seguenti modifiche:

1. **Rimuovere** i riquadri "Calorie bruciate" e "Tempo totale"
2. **Mantenere** i riquadri:
   - Allenamenti completati (primo riquadro)
   - Schede attive (ultimo riquadro)
3. **Aggiungere** un nuovo riquadro "Allenamento di oggi" che:
   - Mostra se ci sono allenamenti programmati per oggi
   - Se CI SONO allenamenti programmati: visualizza un pulsante "Inizia allenamento"
   - Se NON ci sono allenamenti: mostra un messaggio neutro (es. "Nessun allenamento oggi")
   - Il pulsante "Inizia allenamento" apre una nuova pagina/schermata dedicata all'esecuzione dell'allenamento

## Approccio Tecnico e Architetturale

### 1. Modifica della Dashboard (`src/app/page.tsx`)

**Layout dei riquadri**:
- Cambiare il grid da `lg:grid-cols-4` a `lg:grid-cols-3` (per 3 riquadri)
- Rimuovere i riquadri "Calorie bruciate" e "Tempo totale"
- Mantenere i riquadri esistenti nell'ordine:
  1. Allenamenti completati
  2. Schede attive
  3. Allenamento di oggi (nuovo)

### 2. Nuovo Componente "Allenamento di Oggi"

Per il terzo riquadro, ci sono due approcci possibili:

**Opzione A - Componente dedicato riutilizzabile**:
- Creare `src/components/TodayWorkoutCard.tsx`
- Gestire logica dello stato (allenamento programmato o no)
- Includere il pulsante condizionale

**Opzione B - Inline nella Dashboard**:
- Usare StatsCard esistente con personalizzazioni
- Aggiungere un link/button personalizzato sotto il valore

**Scelta consigliata**: Opzione A - componente dedicato, perché:
- Isola la logica specifica per "allenamento di oggi"
- Più facile da testare e mantenere
- Permette di aggiungere logica futura (es. chiamate API per verificare programma reale)

### 3. Nuova Pagina "Workout Session" (`src/app/workout-session/page.tsx`)

Creare una nuova pagina dedicata per l'esecuzione dell'allenamento di oggi:
- Path: `/workout-session`
- Features iniziali:
  - Titolo dell'allenamento
  - Lista degli esercizi programmati
  - Possibilità di segnare esercizi come completati
  - Timer/cronometro per i riposi
  - Pulsante "Termina allenamento"

### 4. Gestione Dati

Per ora useremo dati mock/statici. In futuro si potrà integrare con:
- Context API per stato globale
- Database per salvare i programmi e progressi
- API per recuperare allenamenti programmati

**Struttura dati iniziale** (mock):
```typescript
interface TodayWorkout {
  scheduled: boolean;
  workoutName?: string;
  planName?: string;
  exercises?: Exercise[];
}
```

## File da Creare o Modificare

### File da Modificare:
1. **`src/app/page.tsx`**
   - Rimuovere 2 riquadri StatsCard
   - Cambiare grid layout da 4 a 3 colonne
   - Aggiungere import e utilizzo del nuovo componente TodayWorkoutCard
   - Passare dati mock al componente

### File da Creare:
1. **`src/components/TodayWorkoutCard.tsx`**
   - Nuovo componente per il riquadro "Allenamento di oggi"
   - Props: `scheduled: boolean`, `workoutName?: string`
   - Rendering condizionale: pulsante vs messaggio
   - Link a `/workout-session`

2. **`src/app/workout-session/page.tsx`**
   - Nuova pagina App Router per sessione allenamento
   - Layout base con esercizi mock
   - Possibilità di iniziare/completare allenamento
   - Usare "use client" se necessario per interattività

## Dipendenze e Considerazioni

### Dipendenze:
- Nessuna nuova dipendenza npm richiesta
- Usa componenti e stili esistenti (TailwindCSS, Next.js Link)

### Considerazioni:
1. **Dark Mode**: Mantenere supporto per varianti `dark:`
2. **Responsive**: Il nuovo layout a 3 colonne funziona bene su mobile (stacking verticale)
3. **Accessibilità**: Pulsante "Inizia allenamento" deve essere accessibile da tastiera
4. **Future Enhancement**:
   - Integrare con dati reali da database
   - Aggiungere logica di scheduling (giorni della settimana)
   - Notifiche push per allenamenti programmati
   - Storia delle sessioni completate

### Flusso Utente:
1. Utente apre Dashboard
2. Vede riquadro "Allenamento di oggi"
3. Se programmato: clicca "Inizia allenamento"
4. Viene reindirizzato a `/workout-session`
5. Completa allenamento nella nuova schermata
6. Ritorna alla Dashboard (via navigazione)

## Mock Data Iniziali

Per testare la funzionalità, useremo questi dati statici:

```typescript
// In page.tsx
const todayWorkout = {
  scheduled: true,
  workoutName: "Forza - Upper Body",
  planName: "Forza - Fase 1"
};
```

Questo permetterà di visualizzare il pulsante "Inizia allenamento". Per testare il caso opposto, basta impostare `scheduled: false`.
