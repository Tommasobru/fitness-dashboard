# Reimplementazione Sezione "Schede" con Filtro Attive e Form Creazione

**Data**: 2026-02-05
**Tipo**: Feature - Gestione Schede di Allenamento

## Descrizione

Riimplementazione completa della sezione "Schede" nel menu principale con le seguenti funzionalità:

1. **Filtro Schede Attive**: Visualizzare solo le schede con flag `active: true` nella sezione "Schede Attive"
2. **Nuovo Form Creazione Scheda**: Sostituire il comportamento del pulsante "+ Nuova scheda" con un form completo per la creazione guidata di nuove schede
3. **Navigazione Migliorata**: Aggiungere navigazione breadcrumb con freccia di ritorno alla Dashboard

### Requisiti Funzionali

#### 1. Sezione Schede Attive
- Mostrare solo le schede con proprietà `active: true`
- Design coerente con le card esistenti
- Badge visivo per indicare lo stato "Attiva"

#### 2. Form Creazione Nuova Scheda
Il pulsante "+ Nuova scheda" deve aprire una nuova pagina/modale con i seguenti campi:

**Campi del Form:**
- **Nome scheda** (text input, required)
- **Tipo di allenamento** (dropdown select, required)
  - Opzioni: Ipertrofia, Forza, Resistenza
- **Tipi di attrezzi** (multi-select checkbox)
  - Opzioni: Manubri, Elastici, Ketball, Bilancieri, Sbarra per trazioni, Parallele
- **Frequenza settimanale** (number input, min: 1, max: 7)
- **Durata programma (settimane)** (number input, min: 1)
- **Note/Commento** (textarea)
  - Questo campo sarà utilizzato in futuro per generare suggerimenti tramite LLM
  - Placeholder: "Descrivi i tuoi obiettivi, eventuali limitazioni o preferenze..."

**Azioni:**
- Pulsante "Crea scheda" (primary) - Salva e torna alla lista
- Pulsante "Annulla" (secondary) - Torna alla lista senza salvare

#### 3. Navigazione
- Header con freccia "← Torna alla Dashboard" in alto a sinistra
- Breadcrumb path visibile: Dashboard > Schede > [Nuova Scheda]

## Approccio Tecnico

### 1. Modifica Modello Dati

**File: `src/components/SchemaEditor.tsx`**

Aggiornare l'interfaccia `Plan` per includere i nuovi campi:

```typescript
export interface Plan {
  id: string;
  name: string;
  description: string;
  weeks: number;
  daysPerWeek: number;
  exercises: Exercise[];
  // Nuovi campi
  active?: boolean;                    // Flag per schede attive
  trainingType?: 'ipertrofia' | 'forza' | 'resistenza';
  equipment?: string[];                // Array di attrezzi
  notes?: string;                      // Commento per futuro LLM
}
```

### 2. Aggiornamento Pagina Schede

**File: `src/app/plans/page.tsx`**

Modifiche:
- Aggiungere sezione "Schede Attive" che filtra `plans.filter(p => p.active === true)`
- Mantenere sezione "Tutte le Schede" con lista completa
- Modificare il pulsante "+ Nuova scheda" per navigare a `/plans/new`

Layout proposto:
```
┌─────────────────────────────────────────┐
│ ← Torna alla Dashboard                  │
│                                         │
│ Schede Attive                           │
│ [Card Active 1] [Card Active 2]         │
│                                         │
│ Tutte le Schede              [+ Nuova]  │
│ [Card 1] [Card 2] [Card 3]              │
└─────────────────────────────────────────┘
```

### 3. Creazione Form Nuova Scheda

**Nuovo file: `src/app/plans/new/page.tsx`**

Componente client-side con form strutturato:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPlanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    trainingType: "" as 'ipertrofia' | 'forza' | 'resistenza' | "",
    equipment: [] as string[],
    daysPerWeek: 3,
    weeks: 4,
    notes: "",
  });

  // Form handlers e validazione
  // Submit: creare nuovo Plan e salvare
  // Cancel: router.push("/plans")

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header con navigazione */}
      {/* Form con tutti i campi */}
      {/* Azioni: Crea / Annulla */}
    </div>
  );
}
```

**Componenti UI necessari:**
- Custom Select per tipo allenamento
- Checkbox group per attrezzi
- Number input con validazione min/max
- Textarea autosize per note

### 4. Componente Select/Dropdown

**Nuovo file (opzionale): `src/components/FormSelect.tsx`**

Componente riutilizzabile per dropdown con stili coerenti.

### 5. Gestione Stato

**Opzioni:**

a) **Stato locale (per MVP)**: Usare `useState` in PlansPage e passare via props/Context
b) **localStorage (raccomandato)**: Creare `src/lib/plansStorage.ts` simile a `workoutStorage.ts`

```typescript
// src/lib/plansStorage.ts
const PLANS_KEY = "fitness-plans";

export function loadPlans(): Plan[] {
  // Carica da localStorage o ritorna mock data
}

export function savePlan(plan: Plan): void {
  // Salva in localStorage
}

export function getActivePlans(): Plan[] {
  return loadPlans().filter(p => p.active === true);
}
```

c) **Future**: Integrazione con backend API

## File Coinvolti

### File da Modificare
- ✏️ `src/components/SchemaEditor.tsx` - Aggiornare interfaccia `Plan`
- ✏️ `src/app/plans/page.tsx` - Aggiungere sezione "Schede Attive" e modificare navigazione
- ✏️ `src/components/Sidebar.tsx` - (Opzionale) Aggiungere link a "Schede" se rimosso

### File da Creare
- ✨ `src/app/plans/new/page.tsx` - Form creazione nuova scheda
- ✨ `src/lib/plansStorage.ts` - Gestione persistenza schede (opzionale ma raccomandato)
- ✨ `src/components/FormSelect.tsx` - Componente select personalizzato (opzionale)
- ✨ `src/components/CheckboxGroup.tsx` - Componente checkbox multipli (opzionale)

## Design UI/UX

### Form Creazione Scheda

```
┌────────────────────────────────────────────┐
│ ← Torna alla Dashboard                     │
│                                            │
│ Crea Nuova Scheda                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                            │
│ Nome scheda *                              │
│ [__________________________]               │
│                                            │
│ Tipo di allenamento *                      │
│ [Seleziona tipo ▼         ]                │
│                                            │
│ Attrezzi disponibili                       │
│ ☐ Manubri      ☐ Elastici                 │
│ ☐ Ketball      ☐ Bilancieri               │
│ ☐ Sbarra       ☐ Parallele                │
│                                            │
│ Frequenza settimanale *                    │
│ [3] allenamenti/settimana                  │
│                                            │
│ Durata programma *                         │
│ [4] settimane                              │
│                                            │
│ Note e obiettivi                           │
│ [_____________________________]            │
│ [_____________________________]            │
│                                            │
│        [Annulla]  [Crea scheda]            │
└────────────────────────────────────────────┘
```

### Stile
- Utilizzare i CSS custom properties esistenti (`var(--primary)`, ecc.)
- Form responsive con grid layout
- Validazione inline con messaggi di errore
- Stati disabled/enabled coerenti
- Focus states accessibili

## Considerazioni

### Pro
✅ Separazione chiara tra schede attive e archiviate
✅ Processo guidato per creazione schede
✅ Raccolta dati strutturati per futura integrazione LLM
✅ Esperienza utente migliorata con navigazione chiara
✅ Scalabile per aggiungere più campi in futuro

### Contro / Limitazioni
⚠️ Aumenta la complessità del form (più campi = più validazione)
⚠️ Richiede decisioni UX su come gestire le schede "inattive"
⚠️ I dati delle note LLM non sono ancora utilizzati (feature futura)

### Domande Aperte
- [ ] Le schede inattive devono essere nascoste o visualizzate in una sezione separata?
- [ ] È necessario un pulsante per "attivare/disattivare" una scheda dalla lista?
- [ ] Il form dovrebbe essere una pagina separata o un modale?
- [ ] Permettere la selezione di "Nessun attrezzo" (bodyweight)?

## Implementazione Suggerita

### Fase 1: Modello Dati e Stato
1. Aggiornare interfaccia `Plan` in SchemaEditor
2. Creare `plansStorage.ts` per gestione localStorage
3. Aggiornare mock data in `plans/page.tsx` con flag `active`

### Fase 2: UI Schede Attive
1. Modificare `plans/page.tsx` per separare sezioni "Attive" e "Tutte"
2. Aggiungere logica filtro `getActivePlans()`
3. Aggiungere header con navigazione "← Torna alla Dashboard"

### Fase 3: Form Creazione
1. Creare route `/plans/new/page.tsx`
2. Implementare form con tutti i campi richiesti
3. Implementare validazione e gestione errori
4. Collegare salvataggio a `plansStorage`

### Fase 4: Testing e Refinement
1. Test navigazione tra Dashboard → Schede → Nuova Scheda
2. Test creazione e salvataggio schede
3. Verificare filtro schede attive
4. Test responsive design

## Note Tecniche

- **TypeScript**: Utilizzare strict typing per tutti i nuovi campi
- **Validazione**: Usare HTML5 validation + custom validators
- **Accessibilità**: Label corrette, ARIA attributes, keyboard navigation
- **Performance**: Form controllato con debounce per auto-save (futuro)

## Integrazione Futura LLM

Il campo `notes` è progettato per essere utilizzato come input per un modello LLM che potrà:
- Suggerire esercizi basati su tipo di allenamento e attrezzi
- Generare progressioni automatiche
- Personalizzare il volume e l'intensità
- Creare varianti degli esercizi

Struttura dati preparata per API call:
```typescript
interface LLMPlanRequest {
  trainingType: 'ipertrofia' | 'forza' | 'resistenza';
  equipment: string[];
  daysPerWeek: number;
  weeks: number;
  userNotes: string;
}
```

## Checklist Pre-Implementazione

- [ ] Documento approvato dall'utente
- [ ] Decisioni UX confermate (modale vs pagina, gestione inactive plans)
- [ ] Design UI approvato
- [ ] Struttura dati `Plan` estesa confermata
- [ ] Approccio storage definito (localStorage vs API)
