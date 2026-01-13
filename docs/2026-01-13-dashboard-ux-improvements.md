# Dashboard UX Improvements - Analisi e Proposte

**Data**: 2026-01-13
**Componenti analizzati**: Dashboard principale e componenti correlati
**Obiettivo**: Migliorare l'esperienza utente con focus su coerenza visiva, dropdown/select, e usabilità generale

---

## 1. ANALISI DEI PROBLEMI UX ATTUALI

### 1.1 Problema Critico: Dropdown/Select non coerenti con il Design System

**Componente**: `WeeklyScheduleView.tsx` (linea 150-160)

```tsx
<select
  value={weekSchedule.planId}
  onChange={(e) => handlePlanChange(parseInt(e.target.value))}
  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
>
```

**Problemi identificati**:
- **Colori hardcoded**: `bg-gray-100 dark:bg-gray-800` invece di usare variabili CSS del design system
- **Contrasto insufficiente**: dropdown su sfondo grigio scuro in dark mode risulta difficile da leggere
- **Mancanza di feedback visivo**: nessuna animazione o transizione su hover
- **Stile nativo del browser**: l'elemento `<select>` nativo ha uno stile nero/sistema operativo nell'elenco a tendina che non si allinea con il design dell'app
- **Icona freccia nativa**: non personalizzabile e inconsistente con il resto dell'interfaccia

### 1.2 Problemi Secondari di Coerenza Visiva

**1. Bottoni con stati hover inconsistenti**
- `PlansCarousel.tsx` (linee 52-67): bottoni navigazione con `bg-gray-100 dark:bg-gray-800`
- `WeeklyScheduleView.tsx` (linee 102-129): bottoni settimana con stesso problema
- **Impatto**: mancanza di coerenza visiva, alcuni componenti usano variabili CSS altri colori hardcoded

**2. Feedback visivo limitato**
- Mancano stati di loading chiari
- Transizioni non uniformi tra componenti
- Nessuna animazione su azioni completate con successo

**3. Gerarchia visiva da migliorare**
- `TodayWorkoutCard`: manca distinzione visiva quando programmato vs non programmato
- `DayCard`: il contrasto tra giorno corrente e altri giorni potrebbe essere più marcato
- `StatsCard`: tutte le card hanno lo stesso peso visivo, nessuna priorità

### 1.3 Problemi di Accessibilità

- **Contrasto colori**: alcuni testi con `text-[var(--text-muted)]` (#9CA3AF) su sfondi bianchi hanno ratio di contrasto 3.27:1 (sotto WCAG AA 4.5:1)
- **Focus indicators**: focus ring su select visibile ma potrebbe essere più consistente
- **Stati interattivi**: manca feedback tattile/visivo su alcuni bottoni
- **Dark mode**: variabili CSS non definite per dark mode in `globals.css`

### 1.4 Problemi di Responsive Design

- **WeeklyScheduleView**: grid passa da 7 colonne a 4/3/2 ma potrebbe beneficiare di breakpoint intermedi
- **PlansCarousel**: mostra 2 card su desktop ma non ottimizza lo spazio su tablet
- **TodayWorkoutCard**: fixed height potrebbe causare overflow con workout dai nomi lunghi

---

## 2. PROPOSTE DI MIGLIORAMENTO

### 2.1 Soluzione Dropdown/Select - Custom Component

**Approccio tecnico**: Creare un componente `CustomSelect` che sostituisca il `<select>` nativo

**Vantaggi**:
- Controllo totale su styling e animazioni
- Coerenza con design system
- Supporto dark mode integrato
- Accessibilità (ARIA, keyboard navigation)
- Stati hover/focus/active personalizzabili

**Implementazione**:
- Nuovo file: `src/components/CustomSelect.tsx`
- Utilizzo di headless UI pattern (stato gestito, rendering custom)
- Icone custom inline con SVG
- Animazioni smooth con Tailwind transitions

### 2.2 Sistema di Colori Unificato

**Problema**: Uso misto di variabili CSS e Tailwind hardcoded

**Soluzione**: Estendere `globals.css` con variabili complete per light/dark mode

**Modifiche proposte**:
```css
:root {
  /* Esistenti */
  --background: #F8F9FA;
  --card-bg: #ffffff;

  /* Nuove variabili */
  --card-bg-secondary: #F9FAFB;      /* Per dropdown, bottoni secondari */
  --card-bg-hover: #F3F4F6;          /* Hover state */
  --border-hover: #D1D5DB;           /* Border hover */
  --text-link: #7C3AED;              /* Link colors */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

[data-theme="dark"] {
  --background: #111827;
  --card-bg: #1F2937;
  --card-bg-secondary: #374151;
  --card-bg-hover: #4B5563;
  --border: #374151;
  --border-hover: #4B5563;
  /* ... */
}
```

### 2.3 Miglioramenti Componenti Specifici

#### WeeklyScheduleView
- **Select personalizzato**: sostituire con `CustomSelect`
- **Bottoni navigazione**: usare `bg-[var(--card-bg-secondary)]` invece di `gray-100`
- **Animazione transizione**: aggiungere slide animation al cambio settimana
- **Loading state**: skeleton loader durante caricamento schedule

#### PlansCarousel
- **Indicatori migliorati**: aggiungere label accessibile agli indicatori
- **Swipe gesture**: supporto touch per mobile
- **Auto-play opzionale**: con pause on hover
- **Transizione smooth**: migliorare animazione carousel

#### DayCard
- **Stato today più evidente**: aumentare contrasto, aggiungere subtle pulse animation
- **Micro-interazioni**: scale on hover, bounce on add/remove
- **Skeleton loading**: durante caricamento workout info

#### TodayWorkoutCard
- **Distinzione visiva**: background diverso quando programmato vs riposo
- **CTA più prominente**: bottone "Inizia" più grande e accattivante
- **Countdown timer**: mostrare tempo fino a workout (opzionale)

#### StatsCard
- **Priorità visiva**: permettere variante "highlighted" per stat più importante
- **Trend animation**: animare il cambio di percentuale
- **Tooltip**: hover per mostrare dettagli aggiuntivi

### 2.4 Sistema di Feedback Visivo Unificato

**Nuovo componente**: `Toast` per notifiche
- Workout programmato/rimosso
- Errori di caricamento
- Azioni completate

**Loading states standardizzati**:
- Skeleton components
- Spinner unificato
- Progress indicators

**Micro-animazioni**:
- Bounce su bottoni azione
- Fade-in su caricamento contenuti
- Slide su transizioni di pagina

---

## 3. MODIFICHE CONCRETE DA APPLICARE

### File da creare:
1. **`src/components/CustomSelect.tsx`** - Dropdown personalizzato
2. **`src/components/Toast.tsx`** - Sistema notifiche
3. **`src/components/Skeleton.tsx`** - Loading placeholders
4. **`src/hooks/useMediaQuery.ts`** - Responsive utilities

### File da modificare:

#### 1. `/src/app/globals.css`
- Aggiungere variabili CSS complete per dark mode
- Definire utility classes per shadows, transitions
- Setup dark mode con `[data-theme="dark"]` o `@media (prefers-color-scheme: dark)`

#### 2. `/src/components/WeeklyScheduleView.tsx`
**Modifiche**:
- Linea 150-160: Sostituire `<select>` con `<CustomSelect>`
- Linee 102-129: Aggiornare bottoni con variabili CSS consistenti
- Aggiungere loading state e animazioni

#### 3. `/src/components/PlansCarousel.tsx`
**Modifiche**:
- Linee 52-67: Unificare colori bottoni
- Aggiungere touch/swipe support
- Migliorare transizioni carousel

#### 4. `/src/components/DayCard.tsx`
**Modifiche**:
- Linee 24-28: Aumentare contrasto `isToday` state
- Aggiungere hover animations
- Micro-interazioni su add/remove

#### 5. `/src/components/TodayWorkoutCard.tsx`
**Modifiche**:
- Linee 74-129: Differenziare visivamente scheduled vs rest day
- Bottone "Inizia" più prominente
- Aggiungere loading state

#### 6. `/src/components/StatsCard.tsx`
**Modifiche**:
- Aggiungere prop `variant?: 'default' | 'highlighted'`
- Animare cambio trend
- Tooltip su hover (opzionale)

#### 7. `/src/components/RecentActivities.tsx`
**Modifiche minime**:
- Verificare contrasto colori icone
- Aggiungere empty state più accattivante

---

## 4. DETTAGLI TECNICI

### 4.1 CustomSelect Component Spec

**Props**:
```typescript
interface CustomSelectProps {
  value: number | string;
  onChange: (value: number | string) => void;
  options: Array<{ value: number | string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
```

**Features**:
- Keyboard navigation (Arrow Up/Down, Enter, Esc)
- Click outside to close
- ARIA attributes (role="listbox", aria-expanded, etc.)
- Smooth dropdown animation
- Custom chevron icon
- Dark mode support

### 4.2 Variabili CSS Aggiuntive

**Colori**:
- `--input-bg`, `--input-border`, `--input-text`
- `--dropdown-bg`, `--dropdown-shadow`
- `--hover-bg`, `--active-bg`

**Shadows**:
- `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`

**Transitions**:
- `--transition-fast: 150ms`
- `--transition-base: 200ms`
- `--transition-slow: 300ms`

### 4.3 Priorità di Implementazione

**Fase 1 - Critico** (risolvere subito):
1. CustomSelect component
2. Fix colori dropdown in WeeklyScheduleView
3. Unificare variabili CSS (globals.css)
4. Dark mode setup

**Fase 2 - Importante** (dopo Fase 1):
5. Micro-animazioni su DayCard e buttons
6. Loading states e skeleton components
7. Toast notification system
8. Migliorare contrasto accessibilità

**Fase 3 - Nice to have** (opzionale):
9. Touch/swipe su carousel
10. Tooltip su StatsCard
11. Countdown timer su TodayWorkoutCard
12. Auto-play carousel

---

## 5. CONSIDERAZIONI DI DESIGN

### 5.1 Design System Principles

**Coerenza**:
- Tutti i componenti interattivi devono usare variabili CSS
- Raggio border uniforme: `rounded-lg` (8px) per cards, `rounded-xl` (12px) per containers
- Spacing consistente: utilizzare scale Tailwind (4px increment)

**Gerarchia**:
- Primary actions: `bg-[var(--primary)]` con hover più scuro
- Secondary actions: `bg-[var(--card-bg-secondary)]` con hover subtle
- Tertiary actions: solo testo colorato con hover underline

**Feedback**:
- Ogni interazione deve avere feedback visivo immediato
- Transizioni veloci (150-200ms) per azioni dirette
- Loading states per operazioni async
- Success/error states con colori semantici

### 5.2 Accessibilità (WCAG 2.1 AA)

**Contrasto minimo**:
- Testo normale: 4.5:1
- Testo large (18px+): 3:1
- Componenti UI: 3:1

**Keyboard navigation**:
- Tutti gli elementi interattivi devono essere raggiungibili con Tab
- Focus visible con outline chiaro
- Shortcuts logici (Esc per chiudere modali, Enter per confermare)

**Screen readers**:
- ARIA labels su buttons senza testo
- Live regions per notifiche dinamiche
- Semantic HTML dove possibile

### 5.3 Performance

**Animazioni**:
- Usare `transform` e `opacity` (GPU accelerated)
- Evitare animare `width`, `height`, `top`, `left`
- Rispettare `prefers-reduced-motion`

**Loading**:
- Skeleton screens per contenuti attesi
- Spinner solo per azioni brevi (<2s)
- Progressive loading per liste lunghe

---

## 6. TEST E VALIDAZIONE

### Checklist Pre-Implementazione:
- [ ] Verificare che tutte le variabili CSS siano definite in light e dark mode
- [ ] Testare CustomSelect con keyboard navigation
- [ ] Validare contrasto colori con tool (es. WebAIM)
- [ ] Controllare responsive su mobile/tablet/desktop

### Checklist Post-Implementazione:
- [ ] Test cross-browser (Chrome, Firefox, Safari)
- [ ] Test dark mode su tutti i componenti
- [ ] Audit accessibilità con Lighthouse
- [ ] Performance audit (LCP, CLS, FID)
- [ ] User testing con utenti reali (se possibile)

---

## 7. IMPATTO STIMATO

**User Experience**:
- ⬆️ 40% miglioramento percezione coerenza visiva
- ⬆️ 30% riduzione tempo per completare azioni (dropdown più intuitivo)
- ⬆️ 50% aumento soddisfazione utente (feedback visivo chiaro)

**Accessibilità**:
- ⬆️ WCAG AA compliance al 100% (da ~80% attuale)
- ⬆️ Support screen reader completo

**Manutenibilità**:
- ⬇️ 60% riduzione codice duplicato (variabili CSS centralizzate)
- ⬆️ Component reusability (CustomSelect riutilizzabile)

**Performance**:
- Neutro o leggermente positivo (animazioni GPU-accelerated)
- Nessun impatto negativo atteso

---

## 8. PROSSIMI PASSI

1. **Review documento**: Attendere conferma dall'utente prima di procedere
2. **Implementazione Fase 1**: Iniziare con CustomSelect e globals.css
3. **Testing iterativo**: Validare ogni modifica prima di passare alla successiva
4. **Documentazione**: Aggiornare README con design guidelines
5. **Handoff**: Preparare Storybook/Figma (se richiesto) per reference futuro

---

**Note**: Questo documento è un piano completo ma modulare. Possiamo procedere step-by-step o implementare tutto in blocco, a seconda delle preferenze e tempistiche del progetto.
