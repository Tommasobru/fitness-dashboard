"""
Template per agente di generazione schede allenamento.
Questo file può essere personalizzato dall'utente per implementare la logica
di generazione basata su AI, regole, o qualsiasi altro approccio.
"""

import json
import os
from typing import Dict, Any
from datetime import datetime


class WorkoutGenerator:
    """Agente per la generazione di piani di allenamento personalizzati."""

    def __init__(self):
        """Inizializza l'agente generatore."""
        self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.exports_dir = os.path.join(self.base_dir, "data", "exports")

    def load_plan_data(self, json_path: str) -> Dict[str, Any]:
        """
        Carica i dati del piano da un file JSON.

        Args:
            json_path: Percorso al file JSON con i dati del form

        Returns:
            Dizionario con i dati del piano

        Raises:
            FileNotFoundError: Se il file non esiste
            json.JSONDecodeError: Se il JSON non è valido
        """
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Validazione base
        if 'planData' not in data:
            raise ValueError("Il file JSON deve contenere un campo 'planData'")

        return data['planData']

    def generate_workout_plan(self, plan_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Genera un piano di allenamento basato sui dati forniti.

        Args:
            plan_data: Dati dal form (nome, tipo, equipaggiamento, ecc.)

        Returns:
            Piano di allenamento generato con esercizi e programmazione

        TODO: Implementare la logica di generazione personalizzata qui.
        Esempi di cosa puoi fare:
        - Integrazione con LLM (OpenAI, Anthropic, ecc.)
        - Logica basata su regole
        - Machine Learning personalizzato
        - Consultazione di database di esercizi
        """
        print(f"\n{'='*60}")
        print("DATI RICEVUTI DAL FORM:")
        print(f"{'='*60}")
        print(f"Nome: {plan_data.get('name')}")
        print(f"Descrizione: {plan_data.get('description')}")
        print(f"Tipo allenamento: {plan_data.get('trainingType')}")
        print(f"Equipaggiamento: {', '.join(plan_data.get('equipment', []))}")
        print(f"Giorni/settimana: {plan_data.get('daysPerWeek')}")
        print(f"Durata: {plan_data.get('weeks')} settimane")
        print(f"Note: {plan_data.get('notes')}")
        print(f"{'='*60}\n")

        # Template di output - personalizza questa struttura
        generated_plan = {
            "metadata": {
                "generatedAt": datetime.now().isoformat(),
                "basedOn": plan_data.get('name'),
                "trainingType": plan_data.get('trainingType')
            },
            "exercises": [
                # TODO: Qui andranno gli esercizi generati
                # Esempio:
                # {
                #     "name": "Squat",
                #     "sets": 4,
                #     "reps": "8-10",
                #     "rest": "90s",
                #     "notes": "Focus sulla profondità"
                # }
            ],
            "weeklySchedule": [
                # TODO: Programmazione settimanale
                # Esempio:
                # {
                #     "day": 1,
                #     "exercises": ["squat", "panca", "trazioni"],
                #     "focus": "Upper Body"
                # }
            ],
            "recommendations": [
                # TODO: Suggerimenti personalizzati
            ]
        }

        print("⚠️  NOTA: Questo è un template vuoto.")
        print("    Implementa la tua logica di generazione in questo metodo.\n")

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

        print(f"✅ Piano esportato in: {output_path}\n")

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
            print(f"📥 Caricamento dati da: {input_path}")
            plan_data = self.load_plan_data(input_path)

            # Genera piano
            print("🤖 Generazione piano di allenamento...")
            workout_plan = self.generate_workout_plan(plan_data)

            # Esporta risultato
            print("💾 Esportazione risultati...")
            self.export_to_json(workout_plan, output_path)

            print("✨ Processo completato con successo!")

        except FileNotFoundError:
            print(f"❌ Errore: File non trovato: {input_path}")
            print(f"   Assicurati di aver esportato i dati dal form prima.")
        except Exception as e:
            print(f"❌ Errore durante l'esecuzione: {str(e)}")
            raise


def main():
    """Punto di ingresso principale dello script."""
    print("\n" + "="*60)
    print("🏋️  WORKOUT GENERATOR - Agente Generazione Schede")
    print("="*60 + "\n")

    generator = WorkoutGenerator()

    # Esegui il workflow
    # Puoi passare nomi di file diversi se necessario
    generator.run(
        input_filename="plan_export.json",
        output_filename="generated_plan.json"
    )


if __name__ == "__main__":
    main()
