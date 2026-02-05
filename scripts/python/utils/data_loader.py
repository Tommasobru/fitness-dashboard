"""
Utility per il caricamento e validazione dei dati del piano di allenamento.
"""

import json
from typing import Dict, Any, List
from datetime import datetime


class PlanDataValidator:
    """Validatore per i dati del piano di allenamento."""

    REQUIRED_FIELDS = ['name', 'trainingType', 'daysPerWeek', 'weeks']
    VALID_TRAINING_TYPES = ['ipertrofia', 'forza', 'resistenza']

    @staticmethod
    def validate(plan_data: Dict[str, Any]) -> tuple[bool, List[str]]:
        """
        Valida i dati del piano.

        Args:
            plan_data: Dati da validare

        Returns:
            Tupla (is_valid, errors) dove errors è una lista di messaggi di errore
        """
        errors = []

        # Verifica campi obbligatori
        for field in PlanDataValidator.REQUIRED_FIELDS:
            if field not in plan_data or not plan_data[field]:
                errors.append(f"Campo obbligatorio mancante: {field}")

        # Valida tipo di allenamento
        if plan_data.get('trainingType') not in PlanDataValidator.VALID_TRAINING_TYPES:
            errors.append(
                f"Tipo di allenamento non valido: {plan_data.get('trainingType')}. "
                f"Valori accettati: {', '.join(PlanDataValidator.VALID_TRAINING_TYPES)}"
            )

        # Valida range numerici
        days = plan_data.get('daysPerWeek', 0)
        if not (1 <= days <= 7):
            errors.append(f"Giorni per settimana deve essere tra 1 e 7, ricevuto: {days}")

        weeks = plan_data.get('weeks', 0)
        if weeks < 1:
            errors.append(f"Durata in settimane deve essere almeno 1, ricevuto: {weeks}")

        return len(errors) == 0, errors


def load_and_validate_plan(json_path: str) -> Dict[str, Any]:
    """
    Carica e valida i dati del piano da un file JSON.

    Args:
        json_path: Percorso al file JSON

    Returns:
        Dati del piano validati

    Raises:
        FileNotFoundError: Se il file non esiste
        ValueError: Se i dati non sono validi
        json.JSONDecodeError: Se il JSON è malformato
    """
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'planData' not in data:
        raise ValueError("Il file JSON deve contenere un campo 'planData'")

    plan_data = data['planData']

    # Valida i dati
    is_valid, errors = PlanDataValidator.validate(plan_data)

    if not is_valid:
        error_msg = "Errori di validazione:\n" + "\n".join(f"  - {err}" for err in errors)
        raise ValueError(error_msg)

    return plan_data


def create_plan_summary(plan_data: Dict[str, Any]) -> str:
    """
    Crea un riepilogo testuale del piano.

    Args:
        plan_data: Dati del piano

    Returns:
        Stringa con il riepilogo
    """
    equipment_str = ", ".join(plan_data.get('equipment', [])) or "Nessuno"

    summary = f"""
╔══════════════════════════════════════════════════════════╗
║           RIEPILOGO PIANO DI ALLENAMENTO                 ║
╚══════════════════════════════════════════════════════════╝

📋 Nome: {plan_data.get('name', 'N/A')}
📝 Descrizione: {plan_data.get('description', 'N/A')}
🎯 Tipo: {plan_data.get('trainingType', 'N/A').capitalize()}
🏋️  Equipaggiamento: {equipment_str}
📅 Frequenza: {plan_data.get('daysPerWeek', 'N/A')} giorni/settimana
⏱️  Durata: {plan_data.get('weeks', 'N/A')} settimane
📌 Note: {plan_data.get('notes', 'N/A') or 'Nessuna'}

════════════════════════════════════════════════════════════
"""

    return summary


if __name__ == "__main__":
    # Test delle utility
    print("Questo è un modulo di utility.")
    print("Importalo nei tuoi script per usare le funzioni di validazione.")
