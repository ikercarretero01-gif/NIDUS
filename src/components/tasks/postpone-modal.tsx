'use client';

import { useState, useMemo } from 'react';
import {
  format,
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Task } from '@/types';

interface PostponeModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onPostpone: (taskId: string, newDate: string) => void;
}

export function PostponeModal({
  task,
  isOpen,
  onClose,
  onPostpone,
}: PostponeModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fechas rápidas de sugerencia
  const today = useMemo(() => startOfDay(new Date()), []);
  const tomorrow = useMemo(() => addDays(today, 1), [today]);
  const inTwoDays = useMemo(() => addDays(today, 2), [today]);
  const nextWeek = useMemo(() => addDays(today, 7), [today]);

  // Generar cuadrícula del mes actual
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lunes
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  if (!isOpen || !task) return null;

  const handleSelectDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    onPostpone(task.id, dateStr);
    onClose();
  };

  const quickOptions = [
    { label: 'Hoy', date: today, badge: 'Recomendado' },
    { label: 'Mañana', date: tomorrow },
    { label: 'En 2 días', date: inTwoDays },
    { label: 'Próx. semana', date: nextWeek },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl animate-fade-in space-y-4">
        {/* Cabecera del modal */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Posponer tarea
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 max-w-[220px]">
                {task.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-default cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Opciones rápidas */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Opciones directas
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {quickOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleSelectDate(opt.date)}
                className="flex items-center justify-between rounded-xl border border-[var(--border)]/80 bg-[var(--background)] px-3 py-2 text-xs font-medium text-[var(--foreground)] hover:border-[var(--foreground)]/40 hover:bg-[var(--accent)] transition-default cursor-pointer group"
              >
                <span>{opt.label}</span>
                <span className="text-[10px] text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] capitalize">
                  {format(opt.date, 'EEE d', { locale: es })}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mini calendario interactivo */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 space-y-2.5">
          {/* Navegación del mes */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold capitalize text-[var(--foreground)]">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-default cursor-pointer"
                title="Mes anterior"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-default cursor-pointer"
                title="Mes siguiente"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 text-center text-[10px] font-medium text-[var(--muted-foreground)]">
            <span>L</span>
            <span>M</span>
            <span>X</span>
            <span>J</span>
            <span>V</span>
            <span>S</span>
            <span>D</span>
          </div>

          {/* Cuadrícula de días */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isDayToday = isToday(day);
              const isPast = isBefore(day, today);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDate(day)}
                  className={cn(
                    'h-7 w-7 mx-auto flex items-center justify-center rounded-lg text-xs transition-default cursor-pointer',
                    !isCurrentMonth && 'opacity-25',
                    isPast
                      ? 'text-[var(--muted-foreground)]/40 cursor-not-allowed line-through'
                      : 'hover:bg-[var(--foreground)] hover:text-[var(--background)]',
                    isDayToday &&
                      'font-bold border border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-500/10'
                  )}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-default cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
