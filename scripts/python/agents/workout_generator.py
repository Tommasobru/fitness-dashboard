"""
Agente per la generazione di schede allenamento personalizzate.
Utilizza l'API di Anthropic Claude per creare piani strutturati
a partire dai dati inseriti nel form dell'applicazione.
"""

import json
import os
import re
from typing import Dict, Any

import anthropic
from dotenv import load_dotenv

# Carica variabili d'ambiente da .env (se presente)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))

# Mapping tipo allenamento (italiano) → goal (database)
TRAINING_TYPE_TO_GOAL = {
    'ipertrofia': 'hypertrophy',
    'forza': 'strength',
    'resistenza': 'endurance',
}

SYSTEM_PROMPT = """Sei un esperto personal trainer e programmatore di allenamenti con anni di esperienza.
Il tuo compito è creare piani di allenamento dettagliati e personalizzati.

REGOLE IMPORTANTI:
- Rispondi ESCLUSIVAMENTE con un oggetto JSON valido, senza testo aggiuntivo prima o dopo
- Non usare commenti nel JSON
- Ogni esercizio deve avere: name, sets (numero), reps (stringa es. "8-10"), restSeconds (numero), order (numero progressivo per workout)
- Il campo "notes" degli esercizi è opzionale ma consigliato per i movimenti principali
- Scegli esercizi appropriati in base all'equipaggiamento disponibile
- Se non viene specificato equipaggiamento, usa esercizi a corpo libero
- Bilancia i gruppi muscolari nell'arco della settimana
- Adatta volume e intensità al tipo di allenamento richiesto:
  - Ipertrofia: 3-5 serie, 8-12 rep, 60-90s recupero, volume alto
  - Forza: 3-5 serie, 3-6 rep, 120-180s recupero, intensità alta
  - Resistenza: 2-4 serie, 15-20 rep, 30-60s recupero, circuiti
- Usa nomi degli esercizi in italiano"""

USER_PROMPT_TEMPLATE = """Crea un piano di allenamento completo con queste specifiche:

- **Nome**: {name}
- **Descrizione**: {description}
- **Tipo**: {training_type}
- **Equipaggiamento disponibile**: {equipment}
- **Frequenza**: {days_per_week} giorni a settimana
- **Durata**: {weeks} settimane
- **Note dell'utente**: {notes}

Genera esattamente {days_per_week} workout diversi (uno per ogni giorno di allenamento).
Ogni workout deve contenere 4-6 esercizi appropriati.

Rispondi con questo formato JSON esatto:

{{
  "name": "{name}",
  "description": "descrizione dettagliata del programma",
  "duration": {weeks},
  "level": "beginner|intermediate|advanced",
  "goal": "{goal}",
  "workouts": [
    {{
      "dayNumber": 1,
      "name": "Nome del Workout",
      "description": "Descrizione del focus di questo giorno",
      "exercises": [
        {{
          "name": "Nome Esercizio",
          "sets": 4,
          "reps": "8-10",
          "restSeconds": 90,
          "notes": "note tecniche opzionali",
          "order": 1
        }}
      ]
    }}
  ]
}}"""


class WorkoutGenerator:
    """Agente per la generazione di piani di allenamento personalizzati."""

    def __init__(self, model: str = "claude-sonnet-4-5-20250514"):
        """
        Inizializza l'agente generatore.

        Args:
            model: Modello Claude da utilizzare
        """
        self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.exports_dir = os.path.join(self.base_dir, "data", "exports")
        self.model = model

        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            raise EnvironmentError(
                "ANTHROPIC_API_KEY non configurata.\n"
                "Imposta la variabile d'ambiente o crea un file .env con:\n"
                "  ANTHROPIC_API_KEY=sk-ant-..."
            )

        self.client = anthropic.Anthropic(api_key=api_key)

    def load_plan_data(self, json_path: str) -> Dict[str, Any]:
        """
        Carica i dati del piano da un file JSON esportato dal form.

        Args:
            json_path: Percorso al file JSON con i dati del form

        Returns:
            Dizionario con i dati del piano

        Raises:
            FileNotFoundError: Se il file non esiste
            json.JSONDecodeError: Se il JSON non è valido
            ValueError: Se manca il campo planData
        """
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if 'planData' not in data:
            raise ValueError("Il file JSON deve contenere un campo 'planData'")

        return data['planData']

    def _build_prompt(self, plan_data: Dict[str, Any]) -> str:
        """Costruisce il prompt utente a partire dai dati del form."""
        training_type = plan_data.get('trainingType', 'ipertrofia')
        equipment_list = plan_data.get('equipment', [])
        equipment_str = ', '.join(equipment_list) if equipment_list else 'Solo corpo libero'

        return USER_PROMPT_TEMPLATE.format(
            name=plan_data.get('name', 'Piano Allenamento'),
            description=plan_data.get('description', ''),
            training_type=training_type,
            equipment=equipment_str,
            days_per_week=plan_data.get('daysPerWeek', 3),
            weeks=plan_data.get('weeks', 4),
            notes=plan_data.get('notes', 'Nessuna nota specifica'),
            goal=TRAINING_TYPE_TO_GOAL.get(training_type, 'hypertrophy'),
        )

    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        """
        Estrae e parsa il JSON dalla risposta di Claude.

        Args:
            response_text: Testo della risposta

        Returns:
            Dizionario con il piano generato

        Raises:
            ValueError: Se il JSON non è valido o non è estraibile
        """
        # Prova parsing diretto
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            pass

        # Prova a estrarre JSON da blocco ```json ... ```
        match = re.search(r'```(?:json)?\s*({\s*".*?})\s*```', response_text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass

        # Prova a estrarre il primo oggetto JSON trovato
        match = re.search(r'(\{[\s\S]*\})', response_text)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass

        raise ValueError(
            "Impossibile estrarre JSON valido dalla risposta di Claude.\n"
            f"Risposta ricevuta:\n{response_text[:500]}..."
        )

    def _validate_plan(self, plan: Dict[str, Any], expected_days: int) -> None:
        """
        Valida la struttura del piano generato.

        Args:
            plan: Piano da validare
            expected_days: Numero di workout attesi

        Raises:
            ValueError: Se la struttura non è valida
        """
        required_fields = ['name', 'duration', 'level', 'goal', 'workouts']
        for field in required_fields:
            if field not in plan:
                raise ValueError(f"Campo obbligatorio mancante nel piano generato: '{field}'")

        if plan['level'] not in ('beginner', 'intermediate', 'advanced'):
            plan['level'] = 'intermediate'

        valid_goals = ('strength', 'hypertrophy', 'endurance', 'powerlifting', 'general')
        if plan['goal'] not in valid_goals:
            plan['goal'] = 'hypertrophy'

        workouts = plan.get('workouts', [])
        if len(workouts) != expected_days:
            print(f"  Attenzione: attesi {expected_days} workout, generati {len(workouts)}")

        for i, workout in enumerate(workouts):
            if 'dayNumber' not in workout:
                workout['dayNumber'] = i + 1
            if 'name' not in workout:
                workout['name'] = f"Giorno {i + 1}"
            if 'exercises' not in workout or not workout['exercises']:
                raise ValueError(f"Workout '{workout.get('name', i)}' non ha esercizi")

            for j, exercise in enumerate(workout['exercises']):
                if 'name' not in exercise:
                    raise ValueError(f"Esercizio senza nome nel workout '{workout['name']}'")
                if 'sets' not in exercise:
                    exercise['sets'] = 3
                if 'reps' not in exercise:
                    exercise['reps'] = '10'
                if 'restSeconds' not in exercise:
                    exercise['restSeconds'] = 60
                if 'order' not in exercise:
                    exercise['order'] = j + 1

                # Assicura che sets sia un intero
                exercise['sets'] = int(exercise['sets'])
                exercise['reps'] = str(exercise['reps'])
                exercise['restSeconds'] = int(exercise['restSeconds'])
                exercise['order'] = int(exercise['order'])

    def generate_workout_plan(self, plan_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Genera un piano di allenamento tramite Claude API.

        Args:
            plan_data: Dati dal form (nome, tipo, equipaggiamento, ecc.)

        Returns:
            Piano di allenamento generato nel formato WorkoutPlanJSON
        """
        print(f"\n{'='*60}")
        print("DATI RICEVUTI DAL FORM:")
        print(f"{'='*60}")
        print(f"  Nome:              {plan_data.get('name')}")
        print(f"  Descrizione:       {plan_data.get('description')}")
        print(f"  Tipo allenamento:  {plan_data.get('trainingType')}")
        print(f"  Equipaggiamento:   {', '.join(plan_data.get('equipment', [])) or 'Nessuno'}")
        print(f"  Giorni/settimana:  {plan_data.get('daysPerWeek')}")
        print(f"  Durata:            {plan_data.get('weeks')} settimane")
        print(f"  Note:              {plan_data.get('notes') or 'Nessuna'}")
        print(f"{'='*60}\n")

        # Costruisci prompt
        user_prompt = self._build_prompt(plan_data)

        # Chiama Claude API
        print(f"  Modello: {self.model}")
        print("  Invio richiesta a Claude...\n")

        message = self.client.messages.create(
            model=self.model,
            max_tokens=4096,
            messages=[
                {"role": "user", "content": user_prompt}
            ],
            system=SYSTEM_PROMPT,
        )

        response_text = message.content[0].text

        # Parsa la risposta JSON
        print("  Parsing risposta...")
        generated_plan = self._parse_response(response_text)

        # Valida la struttura
        print("  Validazione struttura...")
        expected_days = plan_data.get('daysPerWeek', 3)
        self._validate_plan(generated_plan, expected_days)

        # Conta esercizi
        total_exercises = sum(len(w.get('exercises', [])) for w in generated_plan['workouts'])
        print(f"\n  Piano generato con successo!")
        print(f"  - Workout: {len(generated_plan['workouts'])}")
        print(f"  - Esercizi totali: {total_exercises}")
        print(f"  - Livello: {generated_plan['level']}")
        print(f"  - Obiettivo: {generated_plan['goal']}\n")

        return generated_plan

    def export_to_json(self, workout_plan: Dict[str, Any], output_path: str):
        """
        Esporta il piano generato in formato JSON.

        Args:
            workout_plan: Piano generato
            output_path: Dove salvare il file JSON
        """
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(workout_plan, f, indent=2, ensure_ascii=False)

        print(f"  Piano esportato in: {output_path}\n")

    def run(self, input_filename: str = "plan_export.json",
            output_filename: str = "generated_plan.json"):
        """
        Esegue il workflow completo: carica → genera → esporta.

        Args:
            input_filename: Nome del file JSON di input
            output_filename: Nome del file JSON di output
        """
        input_path = os.path.join(self.exports_dir, input_filename)
        output_path = os.path.join(self.exports_dir, output_filename)

        try:
            # Carica dati dal form esportato
            print(f"  Caricamento dati da: {input_path}")
            plan_data = self.load_plan_data(input_path)

            # Genera piano
            print("  Generazione piano di allenamento in corso...")
            workout_plan = self.generate_workout_plan(plan_data)

            # Esporta risultato
            print("  Esportazione risultati...")
            self.export_to_json(workout_plan, output_path)

            print("  Processo completato con successo!")
            print(f"\n  Per importare nel database esegui:")
            print(f"  npx tsx scripts/import-workout-plan.ts data/exports/{output_filename}\n")

        except FileNotFoundError:
            print(f"\n  Errore: File non trovato: {input_path}")
            print(f"  Assicurati di aver esportato i dati dal form prima.")
        except EnvironmentError as e:
            print(f"\n  Errore configurazione: {e}")
        except Exception as e:
            print(f"\n  Errore durante l'esecuzione: {str(e)}")
            raise


def main():
    """Punto di ingresso principale dello script."""
    print("\n" + "=" * 60)
    print("  WORKOUT GENERATOR - Agente Generazione Schede")
    print("=" * 60 + "\n")

    try:
        generator = WorkoutGenerator()
    except EnvironmentError as e:
        print(f"  {e}")
        return

    # Esegui il workflow
    generator.run(
        input_filename="plan_export.json",
        output_filename="generated_plan.json"
    )


if __name__ == "__main__":
    main()
