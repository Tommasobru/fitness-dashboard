export default function ProgressPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Progressi
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Riepilogo mensile
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">16</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allenamenti
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
              <p className="text-3xl font-bold text-green-600">12h</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tempo totale
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">5,200</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Calorie
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">3</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Record personali
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Record personali recenti
          </h2>
          <div className="space-y-3">
            <RecordItem
              exercise="Panca piana"
              value="100 kg"
              date="3 giorni fa"
              improvement="+5 kg"
            />
            <RecordItem
              exercise="Squat"
              value="140 kg"
              date="1 settimana fa"
              improvement="+10 kg"
            />
            <RecordItem
              exercise="Stacco"
              value="160 kg"
              date="2 settimane fa"
              improvement="+5 kg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Storico misurazioni
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-800">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  Data
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  Peso
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  Massa grassa
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  Massa muscolare
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              <MeasurementRow
                date="10 Gen 2026"
                weight="78 kg"
                bodyFat="15%"
                muscleMass="42 kg"
              />
              <MeasurementRow
                date="1 Gen 2026"
                weight="79 kg"
                bodyFat="16%"
                muscleMass="41.5 kg"
              />
              <MeasurementRow
                date="15 Dic 2025"
                weight="80 kg"
                bodyFat="17%"
                muscleMass="41 kg"
              />
            </tbody>
          </table>
        </div>
        <button className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
          + Aggiungi misurazione
        </button>
      </div>
    </div>
  );
}

function RecordItem({
  exercise,
  value,
  date,
  improvement,
}: {
  exercise: string;
  value: string;
  date: string;
  improvement: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{exercise}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-green-600">{improvement}</p>
      </div>
    </div>
  );
}

function MeasurementRow({
  date,
  weight,
  bodyFat,
  muscleMass,
}: {
  date: string;
  weight: string;
  bodyFat: string;
  muscleMass: string;
}) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-zinc-900">
      <td className="py-3 px-4 text-gray-900 dark:text-white">{date}</td>
      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{weight}</td>
      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{bodyFat}</td>
      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{muscleMass}</td>
    </tr>
  );
}
