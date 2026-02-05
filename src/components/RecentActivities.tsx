import { getRecentActivities, type Activity, type ActivityIcon } from "@/lib/activitiesData";

// Funzione per ottenere l'icona SVG
function getActivityIconSvg(icon: ActivityIcon): React.ReactNode {
  switch (icon) {
    case 'check':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'trophy':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case 'fire':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      );
    case 'star':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
  }
}

export default function RecentActivities() {
  const activities = getRecentActivities(5);

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-5 md:p-6 border border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 md:mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Attività Recenti
        </h2>
      </div>

      {/* Lista attività */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-[var(--text-muted)] text-center py-4">
            Nessuna attività recente
          </p>
        ) : (
          activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex items-start gap-3 md:gap-4 justify-between">
      {/* Icona */}
      <div className={`w-8 h-8 rounded-lg ${activity.iconBg} ${activity.iconColor} flex items-center justify-center flex-shrink-0`}>
        {getActivityIconSvg(activity.icon)}
      </div>

      {/* Contenuto */}
      <div className="flex-1 min-w-0 pr-4 md:pr-6">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {activity.title}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {activity.description}
        </p>
      </div>

      {/* Timestamp */}
      <span className="text-xs text-[var(--text-muted)] flex-shrink-0 whitespace-nowrap ml-2 md:ml-3">
        {activity.timestamp}
      </span>
    </div>
  );
}
