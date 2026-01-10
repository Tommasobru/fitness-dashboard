import StatsCard from "@/components/StatsCard";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Allenamenti questa settimana"
          value="3"
          subtitle="di 5 pianificati"
        />
        <StatsCard
          title="Calorie bruciate"
          value="1,250"
          subtitle="questa settimana"
        />
        <StatsCard
          title="Tempo totale"
          value="4h 30m"
          subtitle="questa settimana"
        />
        <StatsCard
          title="Schede attive"
          value="2"
          subtitle="in corso"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Prossimi allenamenti
          </h2>
          <div className="space-y-3">
            <WorkoutItem
              name="Push Day"
              date="Oggi, 18:00"
              duration="60 min"
            />
            <WorkoutItem
              name="Pull Day"
              date="Domani, 18:00"
              duration="55 min"
            />
            <WorkoutItem
              name="Leg Day"
              date="Mercoledì, 18:00"
              duration="70 min"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Attività recenti
          </h2>
          <div className="space-y-3">
            <ActivityItem
              action="Completato allenamento"
              description="Push Day - 12 esercizi"
              time="Ieri"
            />
            <ActivityItem
              action="Aggiornato scheda"
              description="Forza - Settimana 3"
              time="2 giorni fa"
            />
            <ActivityItem
              action="Nuovo record personale"
              description="Panca piana: 100kg"
              time="3 giorni fa"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkoutItem({
  name,
  date,
  duration,
}: {
  name: string;
  date: string;
  duration: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300">{duration}</span>
    </div>
  );
}

function ActivityItem({
  action,
  description,
  time,
}: {
  action: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{action}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300">{time}</span>
    </div>
  );
}
