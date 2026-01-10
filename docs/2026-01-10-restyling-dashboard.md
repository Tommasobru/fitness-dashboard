# Restyling Dashboard - Stile SweatIQ

**Data:** 10 Gennaio 2026

## Descrizione della funzionalità richiesta

L'utente richiede di modificare l'aspetto del sito per seguire lo stile dell'immagine di riferimento (SweatIQ dashboard) e di riorganizzare la navigazione eliminando la sezione "Allenamenti" e mantenendo solo "Schede", con l'aggiunta di un modale per la visualizzazione/modifica delle schede.

### Modifiche richieste:

1. **Restyling completo** seguendo lo stile dell'immagine di riferimento:
   - Sfondo grigio chiaro (#F8F9FA) per l'area principale
   - Sidebar bianca con sezioni "MAIN MENU" 
   - Colore di accento viola (#7C3AED) per elementi interattivi
   - Card bianche con bordi arrotondati e ombre sottili
   - Badge colorati per stati (verde per completato, arancione per in corso)
   - Sezione profilo utente in basso nella sidebar

2. **Rimozione sezione Allenamenti**:
   - Eliminare la voce "Allenamenti" dalla navigazione
   - Eliminare la pagina `/workouts`

3. **Modifica funzionalità Schede**:
   - Il pulsante "Visualizza" nelle card delle schede aprirà un modale
   - Il modale avrà uno stile simile alla pagina Allenamenti attuale
   - Permetterà di visualizzare e modificare gli esercizi della scheda

## Approccio tecnico e architetturale

### 1. Aggiornamento stile globale (`globals.css`)
- Definire variabili CSS per il nuovo tema (colori viola, sfondo grigio)
- Aggiornare lo schema colori per light/dark mode

### 2. Aggiornamento Sidebar (`Sidebar.tsx`)
- Rimuovere link "Allenamenti"
- Aggiungere sezioni "MAIN MENU" e "ACCOUNT"
- Aggiungere sezione profilo utente in basso
- Aggiornare stile con nuovo colore di accento viola

### 3. Aggiornamento Layout (`layout.tsx`)
- Modificare colore di sfondo dell'area principale

### 4. Aggiornamento Dashboard (`page.tsx`)
- Rimuovere sezione "Prossimi allenamenti"
- Aggiornare StatsCard con nuovo stile
- Aggiornare colori e stili delle card

### 5. Aggiornamento pagina Schede (`plans/page.tsx`)
- Trasformare in client component per gestire lo stato del modale
- Aggiungere componente Modal per visualizzazione/modifica scheda
- Aggiornare stile delle card con colori viola

### 6. Creazione componente Modal (`components/Modal.tsx`)
- Componente riutilizzabile per modale
- Overlay scuro con animazione
- Chiusura con click esterno o pulsante X

### 7. Creazione componente SchemaEditor (`components/SchemaEditor.tsx`)
- Contenuto del modale per visualizzare/modificare scheda
- Lista esercizi con possibilità di modifica
- Pulsanti per aggiungere/rimuovere esercizi

## File che verranno creati o modificati

### File da modificare:
- `src/app/globals.css` - Nuove variabili CSS e stile tema
- `src/components/Sidebar.tsx` - Nuovo layout e stile sidebar
- `src/app/layout.tsx` - Aggiornamento sfondo
- `src/app/page.tsx` - Aggiornamento dashboard
- `src/components/StatsCard.tsx` - Nuovo stile card statistiche
- `src/app/plans/page.tsx` - Aggiunta gestione modale

### File da creare:
- `src/components/Modal.tsx` - Componente modale riutilizzabile
- `src/components/SchemaEditor.tsx` - Editor scheda nel modale

### File da eliminare:
- `src/app/workouts/page.tsx` - Pagina allenamenti

## Considerazioni

- Il nuovo design usa un colore di accento viola (#7C3AED) che sostituisce il blu attuale
- Il supporto dark mode verrà mantenuto ma adattato al nuovo schema colori
- I dati delle schede rimarranno statici (mock data) per questa implementazione
- Il modale userà animazioni CSS per una transizione fluida

---

## Implementazione completata

**Data completamento:** 10 Gennaio 2026

### Modifiche effettuate

#### 1. `src/app/globals.css`
Aggiunte variabili CSS per il nuovo tema:
- `--primary: #7C3AED` (viola)
- `--primary-light: #EDE9FE`
- `--primary-dark: #5B21B6`
- `--success: #10B981` (verde)
- `--warning: #F59E0B` (arancione)
- `--background: #F8F9FA` (sfondo grigio chiaro)
- `--card-bg`, `--sidebar-bg`, `--border`, `--text-primary`, `--text-secondary`, `--text-muted`
- Supporto completo dark mode con varianti per tutti i colori

#### 2. `src/components/Sidebar.tsx`
- Rimosso link "Allenamenti" dalla navigazione
- Aggiunta sezione "Menu Principale" con Dashboard, Schede, Progressi
- Aggiunta sezione "Account" con Impostazioni
- Aggiunto profilo utente in basso con avatar, nome, email e pulsante logout
- Logo "FitDash" con icona viola
- Stile aggiornato con colore viola per elementi attivi

#### 3. `src/app/layout.tsx`
- Sfondo aggiornato a `bg-[var(--background)]`
- Padding aumentato a `p-8`

#### 4. `src/components/Modal.tsx` (NUOVO)
- Componente modale riutilizzabile con props: `isOpen`, `onClose`, `title`, `children`
- Overlay scuro con `backdrop-blur-sm`
- Chiusura con tasto Escape o click esterno
- Blocco scroll del body quando aperto
- Larghezza massima 4xl, altezza massima 90vh

#### 5. `src/components/SchemaEditor.tsx` (NUOVO)
- Editor per gestire gli esercizi di una scheda
- Tabella con colonne: Esercizio, Serie, Ripetizioni, Peso, Azioni
- Modifica inline degli esercizi (click su icona matita)
- Aggiunta nuovi esercizi con pulsante "Aggiungi esercizio"
- Eliminazione esercizi con conferma
- Pulsante "Salva modifiche" per confermare le modifiche
- Tipi TypeScript esportati: `Exercise`, `Plan`

#### 6. `src/app/plans/page.tsx`
- Convertito in client component (`"use client"`)
- Gestione stato con `useState` per: plans, selectedPlan, activePlanId
- Dati mock per 4 schede con esercizi predefiniti
- Card ridisegnate con:
  - Badge "Attiva" verde per scheda attiva
  - Icone per settimane e frequenza
  - Preview esercizi con avatar circolari
  - Pulsanti "Visualizza" e "Inizia/Continua"
- Integrazione Modal + SchemaEditor per modifica schede

#### 7. `src/components/StatsCard.tsx`
- Aggiunta prop `icon` per icona personalizzata
- Aggiunta prop `trend` per mostrare percentuale di variazione (+/-%)
- Stile aggiornato con variabili CSS
- Icona in box viola in alto a destra

#### 8. `src/app/page.tsx` (Dashboard)
- Header con saluto "Ciao, Utente" e sottotitolo
- Pulsante "Nuova scheda" che linka a /plans
- 4 StatsCard con icone e trend
- Grafico a barre "Statistiche settimanali" con dati mock
- Sezione "Attività recenti" con 3 attività
- Sezione "Le mie schede" con preview e barra progresso
- Link "Vedi tutte" verso /plans e /progress

#### 9. `src/app/progress/page.tsx`
- Stile uniformato con variabili CSS
- Riepilogo mensile con box colorati (viola, verde, arancione)
- Record personali con icone stella
- Tabella misurazioni con stile aggiornato

#### 10. `src/app/workouts/` (ELIMINATO)
- Rimossa intera cartella workouts con page.tsx

### Build verificato
Il comando `npm run build` completa con successo. Route disponibili:
- `/` - Dashboard
- `/plans` - Schede di allenamento
- `/progress` - Progressi
