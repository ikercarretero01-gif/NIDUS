import {
  addDays,
  addWeeks,
  addMonths,
  format,
  parseISO,
  getDay,
  getDate,
  isBefore,
  isAfter,
  startOfDay,
} from 'date-fns';
import type { Task, RecurrenceRule, CompletionRecord } from '@/types';

/**
 * Genera tareas virtuales a partir de reglas de recurrencia
 * para un rango de fechas dado.
 *
 * - No crea filas en la DB: las tareas se proyectan "al vuelo"
 * - IDs deterministas: `${ruleId}-${YYYY-MM-DD}` para idempotencia
 * - Marca completadas si existe un CompletionRecord para esa fecha
 */
export function generateVirtualTasks(
  rules: RecurrenceRule[],
  completions: CompletionRecord[],
  rangeStart: Date,
  rangeEnd: Date
): Task[] {
  const virtualTasks: Task[] = [];

  // Index de completions por clave compuesta para O(1) lookup
  const completionIndex = new Set<string>();
  for (const c of completions) {
    completionIndex.add(`${c.recurrenceRuleId}:${c.date}`);
  }

  for (const rule of rules) {
    const dates = generateOccurrenceDates(rule, rangeStart, rangeEnd);

    for (const date of dates) {
      const dateStr = format(date, 'yyyy-MM-dd');
      const taskId = `${rule.id}-${dateStr}`;
      const isCompleted = completionIndex.has(`${rule.id}:${dateStr}`);

      virtualTasks.push({
        id: taskId,
        userId: rule.userId,
        title: rule.taskTemplate.title,
        notes: rule.taskTemplate.notes,
        date: dateStr,
        time: rule.taskTemplate.time,
        isCompleted,
        isPersistentReminder: rule.taskTemplate.isPersistentReminder,
        priority: rule.taskTemplate.priority,
        tag: rule.taskTemplate.tag,
        recurrenceRuleId: rule.id,
        isRecurrenceException: false,
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt,
      });
    }
  }

  return virtualTasks;
}

/**
 * Genera las fechas de ocurrencia de una regla dentro de un rango.
 * Soporta 3 modos:
 *   1. Días específicos de la semana (con rango de fechas)
 *   2. Repetición finita (count ocurrencias)
 *   3. Periódica estándar (daily/weekly/monthly con o sin endDate)
 */
function generateOccurrenceDates(
  rule: RecurrenceRule,
  rangeStart: Date,
  rangeEnd: Date
): Date[] {
  const ruleStart = startOfDay(parseISO(rule.startDate));
  const ruleEnd = rule.endDate ? startOfDay(parseISO(rule.endDate)) : null;

  // Límite efectivo del rango
  const effectiveStart = isBefore(rangeStart, ruleStart) ? ruleStart : rangeStart;
  const effectiveEnd = ruleEnd && isBefore(ruleEnd, rangeEnd) ? ruleEnd : rangeEnd;

  if (isAfter(effectiveStart, effectiveEnd)) {
    return []; // El rango no intersecta con la regla
  }

  switch (rule.frequency) {
    case 'daily':
      return generateDaily(rule, ruleStart, effectiveStart, effectiveEnd);
    case 'weekly':
      return generateWeekly(rule, ruleStart, effectiveStart, effectiveEnd);
    case 'monthly':
      return generateMonthly(rule, ruleStart, effectiveStart, effectiveEnd);
    default:
      return [];
  }
}

/**
 * Frecuencia diaria: genera cada `interval` días desde startDate.
 * Respeta `count` si está definido.
 */
function generateDaily(
  rule: RecurrenceRule,
  ruleStart: Date,
  effectiveStart: Date,
  effectiveEnd: Date
): Date[] {
  const dates: Date[] = [];
  let current = startOfDay(ruleStart);
  let occurrenceCount = 0;

  while (!isAfter(current, effectiveEnd)) {
    if (rule.count && occurrenceCount >= rule.count) break;

    if (!isBefore(current, effectiveStart)) {
      dates.push(new Date(current));
    }

    occurrenceCount++;
    current = addDays(current, rule.interval);
  }

  return dates;
}

/**
 * Frecuencia semanal:
 * - Si daysOfWeek está definido: genera solo en esos días de la semana
 * - Si no: genera cada `interval` semanas desde startDate
 * Respeta `count` (total de ocurrencias, no semanas)
 */
function generateWeekly(
  rule: RecurrenceRule,
  ruleStart: Date,
  effectiveStart: Date,
  effectiveEnd: Date
): Date[] {
  const dates: Date[] = [];
  let occurrenceCount = 0;

  if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
    // Modo: días específicos de la semana
    // Empezar desde el lunes de la semana de ruleStart
    const dayOfWeekStart = getDay(ruleStart);
    const mondayOffset = dayOfWeekStart === 0 ? -6 : 1 - dayOfWeekStart;
    let weekStart = addDays(ruleStart, mondayOffset);

    while (!isAfter(weekStart, effectiveEnd)) {
      if (rule.count && occurrenceCount >= rule.count) break;

      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const candidateDate = addDays(weekStart, dayOffset);
        if (isAfter(candidateDate, effectiveEnd)) break;
        if (rule.count && occurrenceCount >= rule.count) break;

        const dayOfWeek = getDay(candidateDate);
        if (
          rule.daysOfWeek.includes(dayOfWeek) &&
          !isBefore(candidateDate, ruleStart) &&
          !isBefore(candidateDate, effectiveStart)
        ) {
          dates.push(new Date(candidateDate));
          occurrenceCount++;
        }
      }

      weekStart = addWeeks(weekStart, rule.interval);
    }
  } else {
    // Modo simple: cada N semanas desde startDate
    let current = startOfDay(ruleStart);
    while (!isAfter(current, effectiveEnd)) {
      if (rule.count && occurrenceCount >= rule.count) break;

      if (!isBefore(current, effectiveStart)) {
        dates.push(new Date(current));
        occurrenceCount++;
      }

      current = addWeeks(current, rule.interval);
    }
  }

  return dates;
}

/**
 * Frecuencia mensual:
 * - Si dayOfMonth está definido: genera en ese día de cada mes
 * - Si no: genera en el mismo día del mes que startDate
 * Respeta `count`. Maneja meses cortos (ej: 31 en febrero → 28/29)
 */
function generateMonthly(
  rule: RecurrenceRule,
  ruleStart: Date,
  effectiveStart: Date,
  effectiveEnd: Date
): Date[] {
  const dates: Date[] = [];
  const targetDay = rule.dayOfMonth || getDate(ruleStart);
  let current = startOfDay(ruleStart);
  let occurrenceCount = 0;

  while (!isAfter(current, effectiveEnd)) {
    if (rule.count && occurrenceCount >= rule.count) break;

    // Ajustar al día objetivo del mes (manejar meses cortos)
    const daysInMonth = new Date(
      current.getFullYear(),
      current.getMonth() + 1,
      0
    ).getDate();
    const adjustedDay = Math.min(targetDay, daysInMonth);
    const candidateDate = new Date(
      current.getFullYear(),
      current.getMonth(),
      adjustedDay
    );

    if (
      !isBefore(candidateDate, ruleStart) &&
      !isAfter(candidateDate, effectiveEnd) &&
      !isBefore(candidateDate, effectiveStart)
    ) {
      dates.push(startOfDay(candidateDate));
      occurrenceCount++;
    }

    current = addMonths(current, rule.interval);
  }

  return dates;
}

/**
 * Genera un UUID v4
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Obtiene las tareas persistentes (recordatorios) no completadas
 * de días anteriores o del día actual que deben hacer rollover
 */
export function getPersistentReminders(
  tasks: Task[],
  today: string
): Task[] {
  return tasks.filter(
    (t) =>
      t.isPersistentReminder &&
      !t.isCompleted &&
      t.date <= today
  );
}

/**
 * Clasifica tareas por bloque horario
 */
export function getTaskTimeBlock(time?: string): 'morning' | 'afternoon' | 'evening' | 'no-time' {
  if (!time) return 'no-time';
  const hour = parseInt(time.split(':')[0], 10);
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
