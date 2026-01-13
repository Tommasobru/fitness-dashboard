# Carosello Schede e Attività Recenti

**Data**: 2026-01-13
**Tipo**: Nuove sezioni Dashboard

## Descrizione della Funzionalità

Aggiungere due nuove sezioni nella Dashboard in basso, dopo la sezione "Le mie schede":

1. **Carosello Schede Attive** (a sinistra):
   - Mostra le schede attualmente attive
   - Formato carosello navigabile con frecce
   - Visualizza dettagli scheda: nome, progresso, giorni rimanenti

2. **Attività Recenti** (a destra):
   - Mostra record personali e novità degli allenamenti della settimana
   - Eventi come: allenamenti completati, nuovi record, badge ottenuti
   - Timeline con icone colorate

## Approccio Tecnico e Architetturale

### 1. Layout e Struttura

**Layout grid**:
```
┌──────────────────────────────────────────────────┐
│  Carosello Schede (2/3 width)                    │
├──────────────────────────────────────────────────┤
│  [< ] [Scheda 1] [Scheda 2] [ >]                │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  Attività Recenti (1/3 width)                    │
├──────────────────────────────────────────────────┤
│  • Completato Push (Oggi, 18:30)                 │
│  ★ Nuovo record: Panca 100kg (Ieri)             │
│  • Completato Legs (2 giorni fa)                 │
└──────────────────────────────────────────────────┘
```

**Grid responsive**:
- Desktop: `lg:grid-cols-3` - 2 colonne per carosello, 1 per attività
- Mobile: stack verticale

### 2. Carosello Schede

**Struttura dati**:
```typescript
interface ActivePlanCard {
  id: number;
  name: string;
  progress: number;      // 0-100
  daysLeft: number;
  workoutsThisWeek: number;
  totalWorkouts: number;
  active: boolean;
}
```

**Features carosello**:
- Mostra 1 scheda alla volta su mobile, 2 su tablet, 2 su desktop
- Frecce per navigare avanti/indietro
- Indicatori (dots) per numero totale schede
- Swipe gesture su mobile (opzionale, fase 2)
- Animazione slide smooth

**Card scheda**:
- Nome scheda
- Barra progresso con percentuale
- Giorni rimanenti
- Workout della settimana (es. "3/4 workout completati")
- Badge "Attiva" se è la scheda corrente

### 3. Attività Recenti

**Struttura dati**:
```typescript
interface Activity {
  id: string;
  type: 'workout_completed' | 'personal_record' | 'streak' | 'badge';
  title: string;
  description: string;
  timestamp: string;     // ISO date
  icon: ActivityIcon;
  iconBg: string;        // Tailwind class
  iconColor: string;     // Tailwind class
}

type ActivityIcon = 'check' | 'trophy' | 'fire' | 'star';
```

**Tipi di attività**:
1. **Workout completato**: Icona check verde
2. **Record personale**: Icona trofeo dorato
3. **Streak attivo**: Icona fuoco arancione
4. **Badge ottenuto**: Icona stella blu

**Mock data**:
```typescript
const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'workout_completed',
    title: 'Completato Push',
    description: 'Ipertrofia',
    timestamp: 'Oggi, 18:30',
    icon: 'check',
    iconBg: 'bg-[var(--success-light)]',
    iconColor: 'text-[var(--success)]'
  },
  {
    id: '2',
    type: 'personal_record',
    title: 'Nuovo record personale',
    description: 'Panca piana: 100kg',
    timestamp: 'Ieri',
    icon: 'trophy',
    iconBg: 'bg-[var(--warning-light)]',
    iconColor: 'text-[var(--warning)]'
  },
  {
    id: '3',
    type: 'streak',
    title: 'Streak di 5 giorni',
    description: 'Continua così!',
    timestamp: '2 giorni fa',
    icon: 'fire',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-500'
  }
];
```

**Filtro temporale**:
- Mostra solo attività della settimana corrente
- Max 5 attività mostrate
- Link "Vedi tutto" per pagina completa (future)

### 4. Componenti da Creare

**Componente principale**: `PlansCarousel.tsx`
- Gestisce stato carosello (index corrente)
- Frecce navigazione
- Rendering cards schede
- Indicatori pagination

**Componente card**: `PlanCarouselCard.tsx`
- Card singola scheda nel carosello
- Stile simile a PlanPreview esistente ma più compatto
- Mostra: nome, progresso, workout settimana, giorni rimanenti

**Componente attività**: `RecentActivities.tsx`
- Lista attività recenti
- Filtra per settimana corrente
- Rendering ActivityItem
- Header con titolo "Attività Recenti"

**Componente item**: `ActivityItem.tsx` (riutilizzare esistente)
- Icona colorata
- Titolo e descrizione
- Timestamp
- Già esiste nel codice attuale, lo possiamo riutilizzare

### 5. Integrazione con Dati Esistenti

**Schede attive**:
- Leggere da `mockPlans` (già disponibile)
- Filtrare solo `active: true`
- Calcolare progresso (mock per ora)

**Attività**:
- Mock data inizialmente
- Future: leggere da localStorage workout completati
- Future: calcolare record dal confronto con storico

## File da Creare o Modificare

### File da Creare:

1. **`src/components/PlansCarousel.tsx`**
   - Componente carosello schede attive
   - Gestione navigazione e stato
   - Indicatori pagination

2. **`src/components/PlanCarouselCard.tsx`**
   - Card singola scheda per carosello
   - Layout compatto con info essenziali

3. **`src/components/RecentActivities.tsx`**
   - Componente attività recenti
   - Lista attività con filtro temporale

4. **`src/lib/activitiesData.ts`** (opzionale)
   - Mock data per attività recenti
   - Funzioni helper per filtrare/ordinare

### File da Modificare:

1. **`src/app/page.tsx`**
   - Rimuovere sezione "Le mie schede" esistente
   - Aggiungere nuovo grid con carosello + attività
   - Layout: `lg:grid-cols-3 gap-6`

## Dipendenze e Considerazioni

### Dipendenze:
- Nessuna nuova dipendenza npm richiesta
- Usare animazioni CSS/Tailwind per slide

### Considerazioni:

1. **Carosello**:
   - Swipe gesture su mobile: implementare in fase 2 (opzionale)
   - Autoplay: NO, solo controllo manuale
   - Loop infinito: SI, da ultima scheda torna alla prima
   - Transizioni smooth: `transition-transform duration-300`

2. **Responsive**:
   - Mobile: carosello mostra 1 scheda, attività sotto
   - Tablet: carosello 2 schede, attività a destra
   - Desktop: carosello 2 schede, attività a destra

3. **Mock Data Attività**:
   - Timestamp: usare date relative ("Oggi", "Ieri", "X giorni fa")
   - Icone: usare SVG inline per coerenza
   - Colori: usare variabili CSS esistenti

4. **Accessibilità**:
   - Frecce carosello con ARIA labels
   - Keyboard navigation (frecce sinistra/destra)
   - Focus management

5. **Performance**:
   - Lazy load immagini (se aggiunte in futuro)
   - Animazioni CSS invece di JS per performance

6. **Future Enhancements**:
   - Attività real-time da workout completati
   - Calcolo automatico record personali
   - Badge system
   - Notifiche per nuove attività
   - Filtri per tipo attività
   - Pagina dedicata "Tutte le attività"

## Mock Data

### Schede Attive (usare mockPlans esistente)
```typescript
// Già disponibile in src/lib/mockData.ts
// Filtrare con: mockPlans.filter(p => p.active)
```

### Attività Recenti
```typescript
const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'workout_completed',
    title: 'Completato Push',
    description: 'Ipertrofia',
    timestamp: 'Oggi, 18:30',
    icon: 'check',
    iconBg: 'bg-[var(--success-light)]',
    iconColor: 'text-[var(--success)]'
  },
  {
    id: '2',
    type: 'personal_record',
    title: 'Nuovo record personale',
    description: 'Panca piana: 100kg',
    timestamp: 'Ieri',
    icon: 'trophy',
    iconBg: 'bg-[var(--warning-light)]',
    iconColor: 'text-[var(--warning)]'
  },
  {
    id: '3',
    type: 'streak',
    title: 'Streak di 5 giorni',
    description: 'Continua così!',
    timestamp: '2 giorni fa',
    icon: 'fire',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-500'
  },
  {
    id: '4',
    type: 'workout_completed',
    title: 'Completato Legs',
    description: 'Ipertrofia',
    timestamp: '3 giorni fa',
    icon: 'check',
    iconBg: 'bg-[var(--success-light)]',
    iconColor: 'text-[var(--success)]'
  },
  {
    id: '5',
    type: 'personal_record',
    title: 'Nuovo record: Squat',
    description: '140kg x 5 rip',
    timestamp: '4 giorni fa',
    icon: 'trophy',
    iconBg: 'bg-[var(--warning-light)]',
    iconColor: 'text-[var(--warning)]'
  }
];
```

## Flusso Utente

1. **Navigare schede**:
   - Scroll in fondo alla Dashboard
   - Vede carosello con schede attive
   - Click freccia destra per vedere scheda successiva
   - Click freccia sinistra per tornare indietro

2. **Visualizzare dettagli scheda**:
   - Ogni card mostra: nome, progresso, workout completati
   - Badge "Attiva" sulla scheda corrente
   - Barra progresso visuale

3. **Vedere attività recenti**:
   - A destra del carosello
   - Lista di 5 attività più recenti
   - Icone colorate per tipo
   - Timestamp relativo

4. **Click su attività** (future):
   - Apre dettaglio attività
   - Mostra workout completo o record

## UI/UX Details

### Card Scheda Carosello:
```
┌─────────────────────────────┐
│ Forza - Fase 1      [Attiva]│
├─────────────────────────────┤
│ Progresso: [████░░] 65%     │
│ 3/4 workout questa settimana│
│ 12 giorni rimanenti         │
└─────────────────────────────┘
```

### Item Attività:
```
┌─────────────────────────────┐
│ [✓] Completato Push         │
│     Ipertrofia              │
│     Oggi, 18:30             │
├─────────────────────────────┤
│ [★] Nuovo record            │
│     Panca: 100kg            │
│     Ieri                    │
└─────────────────────────────┘
```

### Controlli Carosello:
- Frecce: circoli con bg-card-bg, border
- Indicatori: dots in fondo, attivo = primary color
- Animazione: slide orizzontale smooth
