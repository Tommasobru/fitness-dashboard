# Setup Database con Supabase

Guida completa per configurare il database PostgreSQL tramite Supabase.

## 1. Crea un Progetto Supabase

1. Vai su [supabase.com](https://supabase.com)
2. Clicca su "Start your project" o "New Project"
3. Accedi con GitHub (o crea un account)
4. Crea una nuova Organization (se non ne hai già una)
5. Clicca su "New Project"
6. Compila i campi:
   - **Name**: `fitness-dashboard` (o il nome che preferisci)
   - **Database Password**: scegli una password sicura (IMPORTANTE: salvala!)
   - **Region**: scegli la più vicina (es. Europe West per Italia)
   - **Pricing Plan**: Free (500 MB, più che sufficiente per iniziare)
7. Clicca "Create new project"
8. Attendi 2-3 minuti per il provisioning del database

## 2. Recupera la Connection String

### Opzione A: Connection Pooler (Consigliato per Vercel/Production)

1. Nel progetto Supabase, vai a **Settings** > **Database**
2. Nella sezione **Connection string**, seleziona il tab **Connection pooling**
3. Copia la stringa che inizia con `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@...`
4. Assicurati che sia nel formato:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Opzione B: Direct Connection (Per sviluppo locale)

1. Nel progetto Supabase, vai a **Settings** > **Database**
2. Nella sezione **Connection string**, seleziona il tab **URI**
3. Copia la stringa che inizia con `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@...`
4. Sostituisci `[YOUR-PASSWORD]` con la password che hai scelto al punto 1

## 3. Configura le Variabili d'Ambiente

1. Crea un file `.env` nella root del progetto:
   ```bash
   cp .env.example .env
   ```

2. Apri `.env` e incolla la connection string di Supabase:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

   **IMPORTANTE**: Sostituisci `[YOUR-PASSWORD]` con la tua password reale!

3. (Opzionale) Se usi il Connection Pooler, aggiungi anche la Direct Connection per le migrations:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

   E modifica `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

## 4. Esegui le Migrations

1. Genera il Prisma Client:
   ```bash
   npx prisma generate
   ```

2. Crea le tabelle nel database:
   ```bash
   npm run db:push
   ```

   Oppure usa le migrations (più robusto per produzione):
   ```bash
   npx prisma migrate dev --name init
   ```

3. Verifica che le tabelle siano state create:
   - Vai su Supabase > **Table Editor**
   - Dovresti vedere le tabelle: `workout_plans`, `workouts`, `exercises`, `workout_sessions`, `exercise_logs`

## 5. (Opzionale) Testa l'Importazione di una Scheda

1. Importa la scheda di esempio:
   ```bash
   npm run import:plan data/exports/example_plan.json
   ```

2. Verifica che la scheda sia stata creata:
   - Vai su Supabase > **Table Editor** > `workout_plans`
   - Dovresti vedere la scheda "PPL - Push Pull Legs"

## 6. (Opzionale) Usa Prisma Studio

Per visualizzare e modificare i dati in modo visuale:

```bash
npm run db:studio
```

Si aprirà un'interfaccia web su `http://localhost:5555` dove puoi:
- Vedere tutte le tabelle
- Aggiungere/modificare/eliminare record
- Visualizzare le relazioni

## Comandi Utili

```bash
# Genera Prisma Client dopo modifiche allo schema
npx prisma generate

# Push dello schema al database (sviluppo)
npm run db:push

# Crea una migration (produzione)
npx prisma migrate dev --name <nome-migration>

# Apri Prisma Studio
npm run db:studio

# Importa scheda da JSON
npm run import:plan <path-to-json>

# Reset completo database (ATTENZIONE: elimina tutti i dati!)
npx prisma migrate reset
```

## Troubleshooting

### Errore: "Can't reach database server"
- Verifica che la connection string sia corretta
- Controlla che la password non contenga caratteri speciali non escaped
- Assicurati di avere una connessione internet

### Errore: "Error parsing connection string"
- La password potrebbe contenere caratteri speciali che devono essere URL-encoded
- Esempio: `p@ssw0rd!` diventa `p%40ssw0rd%21`
- Tool: [URL Encoder](https://www.urlencoder.org/)

### Errore: "Prepared statements not supported in transaction mode"
- Stai usando il Connection Pooler con `pgbouncer=true`
- Aggiungi `DIRECT_URL` nel `.env` e `directUrl` nello schema Prisma (vedi punto 3)

### Il database è lento
- Il tier Free di Supabase può avere latenze più alte
- Considera di fare upgrade al tier Pro ($25/mese) per performance migliori
- Oppure usa caching lato applicazione (React Query, SWR)

## Sicurezza

⚠️ **IMPORTANTE**:
- Non committare mai il file `.env` su Git (è già nel `.gitignore`)
- Non condividere la connection string pubblicamente
- Ruota la password del database se pensi sia stata compromessa (Settings > Database > Reset password)
- Per produzione, usa variabili d'ambiente sicure (Vercel Env Variables, Railway Secrets, etc.)

## Prossimi Passi

Ora che il database è configurato, puoi:
1. Testare le API routes: `/api/workout-plans`, `/api/workout-sessions`, etc.
2. Creare l'interfaccia UI per interagire con il database
3. Importare le tue schede di allenamento personalizzate
4. Iniziare a registrare i tuoi workout!
