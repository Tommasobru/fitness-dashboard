# Storico Allenamenti

**Data:** 10 Gennaio 2026

## Descrizione della funzionalità richiesta

Aggiungere una sezione "Storico Allenamenti" che mostra tutti gli allenamenti completati ordinati per data di completamento (dal più recente al meno recente).

## Modifiche da effettuare

### 1. Aggiornare Sidebar (`Sidebar.tsx`)
- Aggiungere voce "Storico" nel menu principale tra "Schede" e "Progressi"
- Icona: cronologia/orologio

### 2. Creare pagina Storico (`src/app/history/page.tsx`)
- Titolo: "Storico Allenamenti"
- Lista di allenamenti completati con:
  - Data di completamento
  - Nome della scheda
  - Durata dell'allenamento
  - Esercizi completati
  - Note opzionali
- Ordinamento per data (più recente prima)
- Possibilità di filtrare per scheda

## File da creare/modificare

### File da modificare:
- `src/components/Sidebar.tsx` - Aggiungere link "Storico"

### File da creare:
- `src/app/history/page.tsx` - Pagina storico allenamenti

## Considerazioni

- I dati saranno mock data statici per questa implementazione
- Lo stile seguirà il tema viola già implementato
