# 🏋️ Agenti Python per Generazione Schede Allenamento

Questa directory contiene script Python per generare automaticamente piani di allenamento personalizzati basati sui dati inseriti nel form "Crea Nuova Scheda".

## 📁 Struttura

```
scripts/python/
├── agents/
│   ├── __init__.py
│   └── workout_generator.py    # Template agente principale
├── utils/
│   ├── __init__.py
│   └── data_loader.py          # Utility validazione/caricamento
├── requirements.txt            # Dipendenze Python
└── README.md                   # Questa documentazione
```

## 🚀 Quick Start

### 1. Setup Ambiente Python

```bash
# Assicurati di avere Python 3.8+ installato
python --version

# (Opzionale) Crea un ambiente virtuale
python -m venv venv
source venv/bin/activate  # Su Windows: venv\Scripts\activate

# Installa dipendenze (se necessario)
cd scripts/python
pip install -r requirements.txt
```

### 2. Esporta Dati dal Form

1. Apri l'applicazione web (`npm run dev`)
2. Vai su "Schede" → "Crea Nuova Scheda"
3. Compila il form con i tuoi dati
4. Clicca su "Esporta per AI" (funzionalità aggiunta)
5. Il file `plan_export.json` verrà creato in `data/exports/`

### 3. Esegui l'Agente

```bash
cd scripts/python
python agents/workout_generator.py
```

### 4. Risultati

L'agente genererà:
- Output su console con i dati ricevuti
- File `data/exports/generated_plan.json` con il piano generato

## 📊 Formato Dati

### Input (plan_export.json)

Il form esporta i dati in questo formato:

```json
{
  "planData": {
    "name": "Forza Upper Body",
    "description": "Programma per aumentare la forza massimale",
    "trainingType": "forza",
    "equipment": ["manubri", "bilancieri", "sbarra"],
    "daysPerWeek": 4,
    "weeks": 8,
    "notes": "Focus su panca e trazioni. Limitazione: dolore spalla destra",
    "timestamp": "2026-02-05T10:30:00.000Z"
  }
}
```

**Campi**:
- `name` (string, obbligatorio): Nome della scheda
- `description` (string): Descrizione breve
- `trainingType` (enum, obbligatorio): `"ipertrofia"` | `"forza"` | `"resistenza"`
- `equipment` (array): Lista attrezzi disponibili
- `daysPerWeek` (number, 1-7, obbligatorio): Giorni allenamento/settimana
- `weeks` (number, ≥1, obbligatorio): Durata programma
- `notes` (string): Note, obiettivi, limitazioni
- `timestamp` (ISO 8601): Quando è stato creato

### Output (generated_plan.json)

Formato suggerito (personalizzabile):

```json
{
  "metadata": {
    "generatedAt": "2026-02-05T10:31:00.000Z",
    "basedOn": "Forza Upper Body",
    "trainingType": "forza"
  },
  "exercises": [
    {
      "name": "Panca Piana con Bilanciere",
      "sets": 5,
      "reps": "3-5",
      "rest": "3-5 min",
      "notes": "Focus sulla forza massimale"
    }
  ],
  "weeklySchedule": [
    {
      "day": 1,
      "exercises": ["panca", "trazioni"],
      "focus": "Push & Pull"
    }
  ],
  "recommendations": [
    "Progressione di carico del 2.5% settimanale",
    "Attenzione al dolore spalla destra - evitare overhead press"
  ]
}
```

## 🛠️ Personalizzazione

### Opzione 1: Modifica il Template

Apri `agents/workout_generator.py` e implementa la tua logica nel metodo `generate_workout_plan()`:

```python
def generate_workout_plan(self, plan_data: Dict[str, Any]) -> Dict[str, Any]:
    # La tua logica qui
    # Esempio: chiamata a OpenAI API

    import openai

    prompt = f"""
    Crea un piano di allenamento {plan_data['trainingType']}
    per {plan_data['daysPerWeek']} giorni/settimana.
    Equipaggiamento: {', '.join(plan_data['equipment'])}
    Note: {plan_data['notes']}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    # Processa e struttura la risposta
    return structured_plan
```

### Opzione 2: Crea un Nuovo Agente

Crea un nuovo file in `agents/` basandoti sul template:

```python
# agents/my_custom_agent.py

from workout_generator import WorkoutGenerator

class MyCustomAgent(WorkoutGenerator):
    def generate_workout_plan(self, plan_data):
        # La tua implementazione custom
        pass
```

## 📚 Esempi di Integrazione

### Con OpenAI GPT

```bash
pip install openai
```

```python
import openai

openai.api_key = "your-api-key"

def generate_with_gpt(plan_data):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{
            "role": "system",
            "content": "Sei un esperto di programmazione di allenamenti."
        }, {
            "role": "user",
            "content": f"Crea un piano di {plan_data['trainingType']}..."
        }]
    )
    return response.choices[0].message.content
```

### Con Anthropic Claude

```bash
pip install anthropic
```

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

def generate_with_claude(plan_data):
    message = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": f"Crea un piano di {plan_data['trainingType']}..."
        }]
    )
    return message.content[0].text
```

### Con Regole Custom

```python
def generate_with_rules(plan_data):
    exercises = []

    if plan_data['trainingType'] == 'forza':
        if 'bilancieri' in plan_data['equipment']:
            exercises.append({
                'name': 'Squat',
                'sets': 5,
                'reps': '3-5',
                'rest': '3-5 min'
            })

    return {'exercises': exercises}
```

## 🔧 Utility Disponibili

### Validazione Dati

```python
from utils.data_loader import load_and_validate_plan

# Carica e valida automaticamente
plan_data = load_and_validate_plan("../../data/exports/plan_export.json")
```

### Riepilogo Testuale

```python
from utils.data_loader import create_plan_summary

summary = create_plan_summary(plan_data)
print(summary)
```

## ⚙️ Configurazione Avanzata

### Variabili d'Ambiente

Crea un file `.env` nella root del progetto:

```bash
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

Carica nel tuo script:

```python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
```

### Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)
logger.info("Piano generato con successo!")
```

## 🧪 Testing

Crea file di test in `tests/`:

```python
# tests/test_generator.py

import unittest
from agents.workout_generator import WorkoutGenerator

class TestWorkoutGenerator(unittest.TestCase):
    def test_load_plan_data(self):
        generator = WorkoutGenerator()
        data = generator.load_plan_data("fixtures/sample_plan.json")
        self.assertIn('name', data)

if __name__ == '__main__':
    unittest.main()
```

## 📝 Note

- I file in `data/exports/` sono ignorati da git (vedi `.gitignore`)
- Questo è un sistema **manuale** - l'esecuzione dello script Python è separata dall'app Next.js
- Per integrazioni automatiche, considera di creare API endpoints Next.js che chiamano Python

## 🔮 Estensioni Future

Idee per miglioramenti:

- [ ] API Next.js per eseguire script Python dal browser
- [ ] UI per visualizzare piani generati
- [ ] Import automatico dei piani nell'app
- [ ] Database di esercizi
- [ ] Feedback loop per migliorare suggerimenti
- [ ] Multi-agent system per specializzazioni

## 📖 Risorse

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Python JSON](https://docs.python.org/3/library/json.html)

## 🆘 Supporto

Se hai problemi:
1. Controlla che Python 3.8+ sia installato
2. Verifica che il file `plan_export.json` esista
3. Controlla i log di errore per dettagli
4. Leggi la documentazione delle API che stai usando

---

**Buon allenamento!** 💪
