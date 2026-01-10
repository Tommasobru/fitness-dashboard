export default function PlansPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Schede di allenamento
        </h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nuova scheda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PlanCard
          name="Forza - Fase 1"
          description="Programma di 4 settimane per aumentare la forza massimale"
          weeks={4}
          daysPerWeek={4}
          active
        />
        <PlanCard
          name="Ipertrofia"
          description="Programma per la crescita muscolare con alto volume"
          weeks={8}
          daysPerWeek={5}
        />
        <PlanCard
          name="Full Body"
          description="Allenamento completo per principianti"
          weeks={6}
          daysPerWeek={3}
        />
        <PlanCard
          name="Push Pull Legs"
          description="Classica divisione PPL per intermedi"
          weeks={12}
          daysPerWeek={6}
        />
      </div>
    </div>
  );
}

function PlanCard({
  name,
  description,
  weeks,
  daysPerWeek,
  active,
}: {
  name: string;
  description: string;
  weeks: number;
  daysPerWeek: number;
  active?: boolean;
}) {
  return (
    <div
      className={`bg-white dark:bg-zinc-950 rounded-xl p-6 border transition-colors ${
        active
          ? "border-blue-500 ring-1 ring-blue-500"
          : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
        {active && (
          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded">
            Attiva
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {description}
      </p>
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
        <span>{weeks} settimane</span>
        <span>{daysPerWeek}x/settimana</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
          Visualizza
        </button>
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
          {active ? "Continua" : "Inizia"}
        </button>
      </div>
    </div>
  );
}
