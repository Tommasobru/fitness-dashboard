interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export default function StatsCard({ title, value, subtitle, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-5 md:p-6 border border-[var(--border)] hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-[var(--text-muted)]">{title}</p>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)]">
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-[var(--text-primary)]">
        {value}
      </p>
      <div className="flex items-center gap-2 mt-3">
        {trend && (
          <span className={`text-sm font-medium ${trend.positive ? 'text-[var(--success)]' : 'text-red-500'}`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
        {subtitle && (
          <p className="text-sm text-[var(--text-muted)]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
