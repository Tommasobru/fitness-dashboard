"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { savePlan, generatePlanId } from "@/lib/plansStorage";
import { Plan } from "@/components/SchemaEditor";

type TrainingType = 'ipertrofia' | 'forza' | 'resistenza';

const EQUIPMENT_OPTIONS = [
  { id: 'manubri', label: 'Manubri' },
  { id: 'elastici', label: 'Elastici' },
  { id: 'ketball', label: 'Kettlebell' },
  { id: 'bilancieri', label: 'Bilancieri' },
  { id: 'sbarra', label: 'Sbarra per trazioni' },
  { id: 'parallele', label: 'Parallele' },
];

export default function NewPlanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    trainingType: "" as TrainingType | "",
    equipment: [] as string[],
    daysPerWeek: 3,
    weeks: 4,
    notes: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEquipmentToggle = (equipmentId: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentId)
        ? prev.equipment.filter(e => e !== equipmentId)
        : [...prev.equipment, equipmentId]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Il nome della scheda è obbligatorio";
    }

    if (!formData.trainingType) {
      newErrors.trainingType = "Seleziona un tipo di allenamento";
    }

    if (formData.daysPerWeek < 1 || formData.daysPerWeek > 7) {
      newErrors.daysPerWeek = "La frequenza deve essere tra 1 e 7 giorni";
    }

    if (formData.weeks < 1) {
      newErrors.weeks = "La durata deve essere almeno 1 settimana";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const exportPlanData = () => {
    // Valida prima di esportare
    if (!validateForm()) {
      alert("Compila tutti i campi obbligatori prima di esportare");
      return;
    }

    // Crea l'oggetto dati nel formato atteso dallo script Python
    const exportData = {
      planData: {
        name: formData.name,
        description: formData.description || `Programma di ${formData.trainingType}`,
        trainingType: formData.trainingType,
        equipment: formData.equipment,
        daysPerWeek: formData.daysPerWeek,
        weeks: formData.weeks,
        notes: formData.notes,
        timestamp: new Date().toISOString(),
      }
    };

    // Crea e scarica il file JSON
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plan_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('✅ Dati esportati! Salva il file in data/exports/ e poi esegui lo script Python.');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Crea la nuova scheda
    const newPlan: Plan = {
      id: generatePlanId(),
      name: formData.name,
      description: formData.description || `Programma di ${formData.trainingType}`,
      weeks: formData.weeks,
      daysPerWeek: formData.daysPerWeek,
      exercises: [], // Inizialmente vuota, sarà popolata successivamente
      active: true, // Nuove schede sono attive di default
      trainingType: formData.trainingType as TrainingType,
      equipment: formData.equipment,
      notes: formData.notes,
    };

    // Salva la scheda
    savePlan(newPlan);

    // Torna alla pagina schede
    router.push("/plans");
  };

  const handleCancel = () => {
    router.push("/plans");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header con navigazione */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => router.push("/plans")}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Torna alle Schede
        </button>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Crea Nuova Scheda
        </h1>
        <p className="text-[var(--text-muted)] mt-1.5">
          Compila i campi per creare un nuovo programma di allenamento
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome Scheda */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-2.5">
            Nome scheda <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="es. Forza Upper Body, Ipertrofia Gambe..."
            className={`w-full px-4 py-3 bg-[var(--input-bg)] border ${
              errors.name ? 'border-red-500' : 'border-[var(--input-border)]'
            } text-[var(--input-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Descrizione */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Descrizione breve
          </label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="es. Programma per aumentare la forza massimale"
            className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Tipo di Allenamento */}
        <div>
          <label htmlFor="trainingType" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Tipo di allenamento <span className="text-red-500">*</span>
          </label>
          <select
            id="trainingType"
            value={formData.trainingType}
            onChange={(e) => setFormData({ ...formData, trainingType: e.target.value as TrainingType })}
            className={`w-full px-4 py-3 bg-[var(--input-bg)] border ${
              errors.trainingType ? 'border-red-500' : 'border-[var(--input-border)]'
            } text-[var(--input-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer`}
          >
            <option value="">Seleziona tipo di allenamento</option>
            <option value="ipertrofia">Ipertrofia</option>
            <option value="forza">Forza</option>
            <option value="resistenza">Resistenza</option>
          </select>
          {errors.trainingType && (
            <p className="mt-1 text-sm text-red-500">{errors.trainingType}</p>
          )}
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {formData.trainingType === 'ipertrofia' && 'Focus sulla crescita muscolare con alto volume'}
            {formData.trainingType === 'forza' && 'Mirato all\'aumento della forza massimale'}
            {formData.trainingType === 'resistenza' && 'Migliora la capacità aerobica e resistenza muscolare'}
          </p>
        </div>

        {/* Attrezzi Disponibili */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
            Attrezzi disponibili
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EQUIPMENT_OPTIONS.map((equipment) => (
              <label
                key={equipment.id}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.equipment.includes(equipment.id)
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                    : 'border-[var(--border)] hover:border-[var(--primary)]/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.equipment.includes(equipment.id)}
                  onChange={() => handleEquipmentToggle(equipment.id)}
                  className="w-4 h-4 text-[var(--primary)] rounded focus:ring-[var(--primary)]"
                />
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {equipment.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Frequenza e Durata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frequenza Settimanale */}
          <div>
            <label htmlFor="daysPerWeek" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Frequenza settimanale <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="daysPerWeek"
                min="1"
                max="7"
                value={formData.daysPerWeek}
                onChange={(e) => setFormData({ ...formData, daysPerWeek: parseInt(e.target.value) || 1 })}
                className={`w-full px-4 py-3 pr-32 bg-[var(--input-bg)] border ${
                  errors.daysPerWeek ? 'border-red-500' : 'border-[var(--input-border)]'
                } text-[var(--input-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
                giorni/settimana
              </span>
            </div>
            {errors.daysPerWeek && (
              <p className="mt-1 text-sm text-red-500">{errors.daysPerWeek}</p>
            )}
          </div>

          {/* Durata Programma */}
          <div>
            <label htmlFor="weeks" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Durata programma <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="weeks"
                min="1"
                value={formData.weeks}
                onChange={(e) => setFormData({ ...formData, weeks: parseInt(e.target.value) || 1 })}
                className={`w-full px-4 py-3 pr-24 bg-[var(--input-bg)] border ${
                  errors.weeks ? 'border-red-500' : 'border-[var(--input-border)]'
                } text-[var(--input-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
                settimane
              </span>
            </div>
            {errors.weeks && (
              <p className="mt-1 text-sm text-red-500">{errors.weeks}</p>
            )}
          </div>
        </div>

        {/* Note e Obiettivi */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Note e obiettivi
          </label>
          <textarea
            id="notes"
            rows={5}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Descrivi i tuoi obiettivi, eventuali limitazioni o preferenze. Queste informazioni saranno utilizzate in futuro per generare suggerimenti personalizzati..."
            className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            💡 In futuro, queste note verranno utilizzate da un assistente AI per suggerirti esercizi personalizzati
          </p>
        </div>

        {/* Esporta per AI */}
        <div className="pt-4 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={exportPlanData}
            className="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Esporta Dati per Agente AI
          </button>
          <p className="mt-2 text-xs text-[var(--text-muted)] text-center">
            Scarica i dati in formato JSON per utilizzarli con lo script Python
          </p>
        </div>

        {/* Azioni */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg font-medium transition-colors"
          >
            Crea scheda
          </button>
        </div>
      </form>
    </div>
  );
}
