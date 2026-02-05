# Rimozione voce "Schede" dal Menu Principale

**Data**: 2026-02-05
**Tipo**: Ottimizzazione UX/UI

## Descrizione

Rimuovere la voce "Schede" dal menu principale della Sidebar, poiché la funzionalità di gestione e visualizzazione delle schede è già completamente accessibile dalla sezione Dashboard.

### Motivazione
- Evitare duplicazione di voci di menu
- Semplificare la navigazione principale
- La Dashboard già include un carosello delle schede e permette di gestirle completamente (come documentato in `2026-01-13-carosello-schede-attivita.md`)

## Approccio Tecnico

### File da Modificare

**`src/components/Sidebar.tsx`**
- Rimuovere l'elemento `{ name: "Schede", href: "/plans", icon: ClipboardIcon }` dall'array `mainMenu` (linea 8)
- Opzionalmente rimuovere la funzione `ClipboardIcon` se non utilizzata altrove (linee 111-117)

### Menu Risultante

Dopo la modifica, il menu principale conterrà solo:
1. **Dashboard** (`/`) - Panoramica con accesso alle schede
2. **Storico** (`/history`) - Cronologia allenamenti
3. **Progressi** (`/progress`) - Monitoraggio record personali

## Considerazioni

### Pro
- Menu più snello e focalizzato
- Meno confusione per l'utente
- Coerenza con il design documentato in cui la Dashboard è il punto centrale

### Impatto
- **Navigazione**: Gli utenti dovranno accedere alle schede tramite Dashboard invece che dal menu
- **Route esistente**: La route `/plans` continuerà a esistere e funzionare, ma non sarà più accessibile dal menu principale
- **Compatibilità**: Nessun breaking change, è solo una modifica UI

### Eventuali Alternative
Se in futuro si volesse mantenere un accesso rapido alle schede dal menu, si potrebbe:
- Aggiungere un sottomenu nella voce Dashboard
- Creare una sezione "Quick Actions" nella Sidebar

## File Coinvolti

- ✏️ **Modifica**: `src/components/Sidebar.tsx`
- 📄 **Nessuna nuova dipendenza richiesta**

## Implementazione

1. Rimuovere la voce dal `mainMenu` array
2. Rimuovere (opzionale) la funzione `ClipboardIcon` se non serve altrove
3. Testare la navigazione per verificare che tutto funzioni correttamente
