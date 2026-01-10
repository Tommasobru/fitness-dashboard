export default function ProgressPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Progressi
        </h1>
        <p className="text-[var(--text-muted)] mt-1">Monitora i tuoi miglioramenti nel tempo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Riepilogo mensile
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-[var(--primary-light)] rounded-xl">
              <p className="text-3xl font-bold text-[var(--primary)]">16</p>
              <p className="text-sm text-[var(--text-muted)]">
                Allenamenti
              </p>
            </div>
            <div className="text-center p-4 bg-[var(--success-light)] rounded-xl">
              <p className="text-3xl font-bold text-[var(--success)]">12h</p>
              <p className="text-sm text-[var(--text-muted)]">
                Tempo totale
              </p>
            </div>
            <div className="text-center p-4 bg-[var(--warning-light)] rounded-xl">
              <p className="text-3xl font-bold text-[var(--warning)]">5,200</p>
              <p className="text-sm text-[var(--text-muted)]">
                Calorie
              </p>
            </div>
            <div className="text-center p-4 bg-[var(--primary-light)] rounded-xl">
              <p className="text-3xl font-bold text-[var(--primary)]">3</p>
              <p className="text-sm text-[var(--text-muted)]">
                Record personali
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
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

      <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Storico misurazioni
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-4 font-medium text-[var(--text-muted)]">
                  Data
                </th>
                <th className="text-left py-3 px-4 font-medium text-[var(--text-muted)]">
                  Peso
                </th>
                <th className="text-left py-3 px-4 font-medium text-[var(--text-muted)]">
                  Massa grassa
                </th>
                <th className="text-left py-3 px-4 font-medium text-[var(--text-muted)]">
                  Massa muscolare
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
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
        <button className="mt-4 flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-dark)] text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Aggiungi misurazione
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
    <div className="flex items-center justify-between p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--warning-light)] flex items-center justify-center">
          <svg className="w-5 h-5 text-[var(--warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-[var(--text-primary)]">{exercise}</p>
          <p className="text-sm text-[var(--text-muted)]">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-[var(--text-primary)]">{value}</p>
        <p className="text-sm font-medium text-[var(--success)]">{improvement}</p>
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
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="py-3 px-4 text-[var(--text-primary)]">{date}</td>
      <td className="py-3 px-4 text-[var(--text-secondary)]">{weight}</td>
      <td className="py-3 px-4 text-[var(--text-secondary)]">{bodyFat}</td>
      <td className="py-3 px-4 text-[var(--text-secondary)]">{muscleMass}</td>
    </tr>
  );
}
