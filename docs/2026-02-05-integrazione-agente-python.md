# Integrazione Agente Python per Generazione Schede

**Data**: 2026-02-05
**Tipo**: Nuova Funzionalità - Infrastruttura

## Descrizione

Predisporre l'infrastruttura del progetto per permettere l'integrazione di uno script Python/agente che prenderà come input i dati del form "Crea Nuova Scheda" (nome, descrizione, tipo allenamento, equipaggiamento, ecc.) e genererà suggerimenti o schede di allenamento personalizzate.

## Obiettivi

1. Creare una struttura di cartelle per ospitare script Python
2. Definire un formato di scambio dati (JSON) tra l'applicazione Next.js e lo script Python
3. Creare file di esempio/template per lo script Python
4. Preparare un sistema di export dei dati del form in formato compatibile con Python
5. Documentare l'interfaccia di comunicazione

## Architettura Proposta

### Struttura Cartelle

```
fitness-dashboard/
├── src/
│   └── app/plans/new/page.tsx (esistente)
├── scripts/
│   └── python/
│       ├── agents/
│       │   ├── __init__.py
│       │   └── workout_generator.py (template per agente)
│       ├── utils/
│       │   ├── __init__.py
│       │   └── data_loader.py (carica dati da JSON)
│       ├── requirements.txt (dipendenze Python)
│       └── README.md (documentazione)
└── data/
    └── exports/
        └── .gitkeep (placeholder)
```

### Formato Dati (JSON Schema)

Il form esporterà i dati in questo formato:

```json
{
  "planData": {
    "name": "string",
    "description": "string",
    "trainingType": "ipertrofia" | "forza" | "resistenza",
    "equipment": ["string"],
    "daysPerWeek": "number",
    "weeks": "number",
    "notes": "string",
    "timestamp": "ISO 8601 datetime"
  }
}
```

### Template Script Python

File: `scripts/python/agents/workout_generator.py`

```python
"""
Template per agente di generazione schede allenamento.
Questo file può essere personalizzato dall'utente per implementare la logica
di generazione basata su AI, regole, o qualsiasi altro approccio.
"""

import json
from typing import Dict, List, Any

class WorkoutGenerator:
    def __init__(self):
        """Inizializza l'agente generatore."""
        pass

    def load_plan_data(self, json_path: str) -> Dict[str, Any]:
        """
        Carica i dati del piano da un file JSON.

        Args:
            json_path: Percorso al file JSON con i dati del form

        Returns:
            Dizionario con i dati del piano
        """
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def generate_workout_plan(self, plan_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Genera un piano di allenamento basato sui dati forniti.

        Args:
            plan_data: Dati dal form (nome, tipo, equipaggiamento, ecc.)

        Returns:
            Piano di allenamento generato con esercizi e programmazione
        """
        # TODO: Implementare logica di generazione
        # Questo è un template - l'utente implementerà la propria logica
        pass

    def export_to_json(self, workout_plan: Dict[str, Any], output_path: str):
        """
        Esporta il piano generato in formato JSON.

        Args:
            workout_plan: Piano generato
            output_path: Dove salvare il file JSON
        """
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(workout_plan, f, indent=2, ensure_ascii=False)

# Esempio di utilizzo
if __name__ == "__main__":
    # Carica dati dal form esportato
    generator = WorkoutGenerator()
    plan_data = generator.load_plan_data("../../data/exports/plan_export.json")

    # Genera piano
    workout_plan = generator.generate_workout_plan(plan_data)

    # Esporta risultato
    generator.export_to_json(workout_plan, "../../data/exports/generated_plan.json")
    print("Piano generato con successo!")
```

## Modifiche Necessarie

### File da Creare

1. **`scripts/python/agents/workout_generator.py`**
   - Template per l'agente generatore
   - Metodi stub per caricamento dati, generazione, export

2. **`scripts/python/utils/data_loader.py`**
   - Utility per validazione e caricamento dati JSON
   - Gestione errori e validazione schema

3. **`scripts/python/requirements.txt`**
   - Dipendenze Python base (es. json, typing)
   - Placeholder per future dipendenze (openai, anthropic, ecc.)

4. **`scripts/python/README.md`**
   - Documentazione completa
   - Istruzioni per setup ambiente Python
   - Esempi di utilizzo
   - Schema dati JSON

5. **`data/exports/.gitkeep`**
   - Crea la cartella per i file di export
   - Aggiunge .gitkeep per mantenere la cartella in git

### File da Modificare

**`src/app/plans/new/page.tsx`**
- Aggiungere funzione `exportPlanData()` che crea un file JSON con i dati del form
- Aggiungere bottone "Esporta dati per AI" (opzionale, per testing)
- O automatizzare l'export quando viene creata una scheda

**`.gitignore`**
- Aggiungere `data/exports/*.json` per non committare file di export
- Aggiungere `scripts/python/**/__pycache__/`

## Workflow Utente

1. L'utente compila il form "Crea Nuova Scheda"
2. I dati vengono salvati normalmente + esportati come JSON in `data/exports/`
3. L'utente esegue lo script Python manualmente:
   ```bash
   cd scripts/python
   python agents/workout_generator.py
   ```
4. Lo script Python legge il JSON, esegue la logica personalizzata, genera suggerimenti
5. Output può essere:
   - Stampato a console
   - Salvato come JSON strutturato
   - Importato manualmente nell'app

## Estensioni Future (Non implementate ora)

- API endpoint Next.js per eseguire script Python
- Integrazione diretta con LLM (OpenAI, Anthropic, ecc.)
- UI per visualizzare suggerimenti generati dall'agente
- Import automatico dei piani generati

## Vantaggi

- ✅ Separazione chiara tra frontend Next.js e logica Python
- ✅ Flessibilità totale per l'utente nell'implementare l'agente
- ✅ Formato JSON standard per interoperabilità
- ✅ Nessuna dipendenza hard tra i due sistemi
- ✅ Facile testing e sviluppo iterativo dello script Python
