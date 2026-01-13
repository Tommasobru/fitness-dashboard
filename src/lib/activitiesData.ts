// Mock data per attività recenti

export type ActivityType = 'workout_completed' | 'personal_record' | 'streak' | 'badge';
export type ActivityIcon = 'check' | 'trophy' | 'fire' | 'star';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;     // Formato relativo: "Oggi, 18:30", "Ieri", ecc.
  icon: ActivityIcon;
  iconBg: string;        // Tailwind class
  iconColor: string;     // Tailwind class
}

// Mock data attività recenti
export const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'workout_completed',
    title: 'Completato Push',
    description: 'Ipertrofia',
    timestamp: 'Oggi, 18:30',
    icon: 'check',
    iconBg: 'bg-[var(--success-light)]',
    iconColor: 'text-[var(--success)]'
  },
  {
    id: '2',
    type: 'personal_record',
    title: 'Nuovo record personale',
    description: 'Panca piana: 100kg',
    timestamp: 'Ieri',
    icon: 'trophy',
    iconBg: 'bg-[var(--warning-light)]',
    iconColor: 'text-[var(--warning)]'
  },
  {
    id: '3',
    type: 'streak',
    title: 'Streak di 5 giorni',
    description: 'Continua così!',
    timestamp: '2 giorni fa',
    icon: 'fire',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-500'
  },
  {
    id: '4',
    type: 'workout_completed',
    title: 'Completato Legs',
    description: 'Ipertrofia',
    timestamp: '3 giorni fa',
    icon: 'check',
    iconBg: 'bg-[var(--success-light)]',
    iconColor: 'text-[var(--success)]'
  },
  {
    id: '5',
    type: 'personal_record',
    title: 'Nuovo record: Squat',
    description: '140kg x 5 rip',
    timestamp: '4 giorni fa',
    icon: 'trophy',
    iconBg: 'bg-[var(--warning-light)]',
    iconColor: 'text-[var(--warning)]'
  }
];

/**
 * Filtra attività per settimana corrente (mock - per ora restituisce tutte)
 */
export function getWeekActivities(): Activity[] {
  // TODO: implementare filtro reale quando avremo date
  return recentActivities;
}

/**
 * Ottiene le ultime N attività
 */
export function getRecentActivities(limit: number = 5): Activity[] {
  return recentActivities.slice(0, limit);
}
