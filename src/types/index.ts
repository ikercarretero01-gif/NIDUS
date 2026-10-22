export type Priority = 'baja' | 'media' | 'alta';

export interface Task {
  id: string;
  userId: string;
  title: string;
  notes: string;
  date: string;           // YYYY-MM-DD
  time?: string;           // HH:mm
  isCompleted: boolean;
  isPersistentReminder: boolean;
  priority: Priority;
  tag?: string;
  projectId?: string;     // ID del proyecto vinculado
  projectGoalId?: string; // ID de la meta del roadmap asociada (opcional)
  recurrenceRuleId?: string;
  isRecurrenceException: boolean;
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

export type ProjectGoalStatus = 'todo' | 'in_progress' | 'completed';

export interface ProjectGoal {
  id: string;
  userId?: string;
  projectId: string;
  title: string;
  description?: string;
  status: ProjectGoalStatus;
  priority: Priority;
  targetDate?: string;    // Fecha estimada / objetivo del roadmap (YYYY-MM-DD)
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  color: string;          // Hex / color token (ej: '#3b82f6', '#10b981', etc.)
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

export interface RecurrenceRule {
  id: string;
  userId: string;
  taskTemplate: {
    title: string;
    notes: string;
    time?: string;
    isPersistentReminder: boolean;
    priority: Priority;
    tag?: string;
    projectId?: string;
  };
  frequency: RecurrenceFrequency;
  interval: number;        // cada N días/semanas/meses
  daysOfWeek?: number[];   // 0=Dom, 1=Lun, ..., 6=Sáb
  dayOfMonth?: number;     // para frecuencia mensual
  startDate: string;       // YYYY-MM-DD
  endDate?: string;        // YYYY-MM-DD (opcional)
  count?: number;          // número máximo de ocurrencias
  createdAt: string;
  updatedAt: string;
}

export interface CompletionRecord {
  id: string;
  userId: string;
  recurrenceRuleId: string;
  date: string;            // YYYY-MM-DD
  completedAt: string;     // ISO timestamp
}

export type ViewType = 'today' | 'week' | 'month' | 'recurring' | 'projects' | 'settings';

export interface TimeBlock {
  label: string;
  key: 'morning' | 'afternoon' | 'evening' | 'no-time';
  startHour?: number;
  endHour?: number;
}

export const TIME_BLOCKS: TimeBlock[] = [
  { label: 'Mañana', key: 'morning', startHour: 0, endHour: 12 },
  { label: 'Tarde', key: 'afternoon', startHour: 12, endHour: 18 },
  { label: 'Noche', key: 'evening', startHour: 18, endHour: 24 },
  { label: 'Sin hora', key: 'no-time' },
];

export const PRIORITY_CONFIG: Record<Priority, { label: string; class: string; dotClass: string }> = {
  alta: {
    label: 'Alta',
    class: 'text-[var(--priority-alta)]',
    dotClass: 'bg-[var(--priority-alta)]',
  },
  media: {
    label: 'Media',
    class: 'text-[var(--priority-media)]',
    dotClass: 'bg-[var(--priority-media)]',
  },
  baja: {
    label: 'Baja',
    class: 'text-[var(--priority-baja)]',
    dotClass: 'bg-[var(--priority-baja)]',
  },
};
