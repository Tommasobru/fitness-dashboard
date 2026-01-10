export default function WorkoutsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Allenamenti
        </h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nuovo allenamento
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <input
            type="text"
            placeholder="Cerca allenamenti..."
            className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="divide-y divide-gray-200 dark:divide-zinc-800">
          <WorkoutRow
            name="Push Day"
            date="10 Gennaio 2026"
            exercises={12}
            duration="60 min"
            completed
          />
          <WorkoutRow
            name="Pull Day"
            date="8 Gennaio 2026"
            exercises={10}
            duration="55 min"
            completed
          />
          <WorkoutRow
            name="Leg Day"
            date="6 Gennaio 2026"
            exercises={8}
            duration="70 min"
            completed
          />
          <WorkoutRow
            name="Push Day"
            date="4 Gennaio 2026"
            exercises={12}
            duration="58 min"
            completed
          />
        </div>
      </div>
    </div>
  );
}

function WorkoutRow({
  name,
  date,
  exercises,
  duration,
  completed,
}: {
  name: string;
  date: string;
  exercises: number;
  duration: string;
  completed?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            completed
              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
              : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400"
          }`}
        >
          {completed ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
        <span>{exercises} esercizi</span>
        <span>{duration}</span>
        <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          Dettagli
        </button>
      </div>
    </div>
  );
}
