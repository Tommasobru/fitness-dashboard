# Data Exports

Questa cartella contiene i file JSON esportati dal form "Crea Nuova Scheda" per essere utilizzati dagli agenti Python.

## File

- **`example_plan.json`** - Esempio di file esportato (committato in git come riferimento)
- **`plan_export.json`** - File generato quando clicchi "Esporta Dati per Agente AI" (ignorato da git)
- **`generated_plan.json`** - Output generato dallo script Python (ignorato da git)

## Utilizzo

1. **Esporta dati dal form**:
   - Apri l'app web e vai su "Schede" → "Crea Nuova Scheda"
   - Compila il form
   - Clicca su "Esporta Dati per Agente AI"
   - Salva il file come `plan_export.json` in questa cartella

2. **Esegui lo script Python**:
   ```bash
   cd scripts/python
   python agents/workout_generator.py
   ```

3. **Risultato**:
   - Lo script leggerà `plan_export.json`
   - Genererà `generated_plan.json` con i suggerimenti

## Formato JSON

Vedi `example_plan.json` per un esempio completo del formato.

## Note

- I file `*.json` (eccetto `example_plan.json`) sono ignorati da git
- Puoi creare più file di test con nomi diversi
- Lo script Python di default cerca `plan_export.json` ma puoi personalizzarlo
