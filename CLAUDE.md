# CLAUDE.md

Questo file fornisce indicazioni a Claude Code (claude.ai/code) per lavorare con il codice di questo repository.

## Panoramica del Progetto

Fitness Dashboard è un'applicazione web per monitorare i progressi degli allenamenti e gestire programmi di training. Costruita con Next.js 16 (App Router), React 19, TailwindCSS 4 e TypeScript.

## Comandi

```bash
npm run dev      # Avvia server di sviluppo (localhost:3000)
npm run build    # Build di produzione
npm run start    # Avvia server di produzione
npm run lint     # Esegue ESLint
```

## Architettura

### Struttura App Router
- `src/app/` - Pagine Next.js App Router
  - `layout.tsx` - Layout principale con navigazione Sidebar
  - `page.tsx` - Home Dashboard con panoramica statistiche
  - `workouts/` - Registrazione allenamenti e storico
  - `plans/` - Gestione programmi di allenamento
  - `progress/` - Monitoraggio progressi e record personali

### Componenti
- `src/components/` - Componenti UI riutilizzabili
- I componenti usano TailwindCSS per lo styling con supporto dark mode tramite varianti `dark:`

### Alias dei Percorsi
- `@/*` mappa a `./src/*` (es. `import Sidebar from "@/components/Sidebar"`)

## Convenzioni

- Lingua italiana per i testi dell'interfaccia
- Tutte le pagine sono server components di default; usare la direttiva `"use client"` solo quando necessario (es. Sidebar usa `usePathname`)
- Supporto dark mode: usare varianti Tailwind `dark:` per tutte le classi di colore

## Workflow per Nuove Funzionalità

Prima di implementare qualsiasi nuova funzionalità o feature richiesta dall'utente:

1. **Verificare la data corrente** - Controllare sempre la data del giorno per nominare correttamente il documento
2. **Creare un documento di progetto** nella cartella `/docs` con nome formato `YYYY-MM-DD-nome-funzione.md`
3. **Contenuto del documento**:
   - Descrizione della funzionalità richiesta
   - Approccio tecnico e architetturale
   - File che verranno creati o modificati
   - Eventuali dipendenze o considerazioni
4. **Attendere conferma** - Non procedere con l'implementazione fino a quando l'utente non conferma il documento di progetto
