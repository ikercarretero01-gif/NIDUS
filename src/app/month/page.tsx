'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { TaskItem } from '@/components/tasks/task-item';
import { QuickAdd } from '@/components/tasks/quick-add';
import { TaskForm } from '@/components/tasks/task-form';
import { useTaskStore } from '@/store/task-store';
import { useRecurrenceStore } from '@/store/recurrence-store';
import { generateVirtualTasks } from '@/lib/recurrence-engine';
import type { Task } from '@/types';
import { PRIORITY_CONFIG } from '@/types';
import { cn } from '@/lib/cn';

const MAX_PILLS = 3;

export default function MonthPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const tasks = useTaskStore((s) => s.tasks);
  const rules = useRecurrenceStore((s) => s.rules);
  const completions = useRecurrenceStore((s) => s.completions);

  // Generar todas las celdas del calendario (42 celdas máximo: 6 semanas × 7 días)
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    let current = calStart;
    while (current <= calEnd) {
      days.push(current);
      current = addDays(current, 1);
    }
    return days;
  }, [calStart, calEnd]);

  // Todas las tareas del rango visible
  const allTasks = useMemo(() => {
    const startStr = format(calStart, 'yyyy-MM-dd');
    const endStr = format(calEnd, 'yyyy-MM-dd');
    const normalTasks = tasks.filter(
      (t) => t.date >= startStr && t.date <= endStr
    );
    const virtualTasks = generateVirtualTasks(rules, completions, calStart, calEnd);
    const normalIds = new Set(normalTasks.map((t) => t.id));
    const uniqueVirtual = virtualTasks.filter((vt) => !normalIds.has(vt.id));
    return [...normalTasks, ...uniqueVirtual];
  }, [tasks, rules, completions, calStart, calEnd]);

  // Index por fecha
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    allTasks.forEach((task) => {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    });
    return map;
  }, [allTasks]);

  const selectedDateTasks = selectedDate
    ? (tasksByDate[selectedDate] || []).sort((a, b) =>
        (a.time || '').localeCompare(b.time || '')
      )
    : [];

  const monthLabel = format(currentDate, 'MMMM yyyy', { locale: es });

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Mes" subtitle={monthLabel}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-default"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="rounded-md px-3 py-1 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-default"
          >
            Hoy
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-default"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </Header>

      <div className="flex flex-1 overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex-1 flex flex-col p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(
              (day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider py-2"
                >
                  {day}
                </div>
              )
            )}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 flex-1 border-t border-l border-[var(--border)]">
            {calendarDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayTasks = tasksByDate[dateStr] || [];
              const isCurrentMonth = isSameMonth(day, currentDate);
              const dayIsToday = isToday(day);
              const isSelected = selectedDate === dateStr;
              const extraCount = Math.max(0, dayTasks.length - MAX_PILLS);

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={cn(
                    'relative min-h-[100px] border-r border-b border-[var(--border)] p-1.5 cursor-pointer transition-default hover:bg-[var(--accent)]/50',
                    !isCurrentMonth && 'opacity-40',
                    isSelected && 'bg-[var(--accent)]/50 ring-1 ring-inset ring-[var(--foreground)]/10'
                  )}
                >
                  {/* Day number */}
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                      dayIsToday
                        ? 'bg-[var(--foreground)] text-[var(--background)]'
                        : 'text-[var(--foreground)]'
                    )}
                  >
                    {format(day, 'd')}
                  </span>

                  {/* Task pills */}
                  <div className="mt-0.5 space-y-0.5">
                    {dayTasks.slice(0, MAX_PILLS).map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          'flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] leading-tight truncate',
                          task.isCompleted
                            ? 'bg-[var(--muted)] text-[var(--muted-foreground)] line-through'
                            : 'bg-[var(--accent)] text-[var(--foreground)]'
                        )}
                      >
                        <span
                          className={cn(
                            'h-1 w-1 rounded-full shrink-0',
                            PRIORITY_CONFIG[task.priority].dotClass
                          )}
                        />
                        <span className="truncate">{task.title}</span>
                      </div>
                    ))}
                    {extraCount > 0 && (
                      <span className="text-[10px] text-[var(--muted-foreground)] px-1.5">
                        +{extraCount} más
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Detail Drawer (Side Panel) */}
        {selectedDate && (
          <div className="w-80 border-l border-[var(--border)] bg-[var(--background)] flex flex-col animate-slide-in-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold">
                  {format(new Date(selectedDate + 'T12:00:00'), "EEEE d", {
                    locale: es,
                  })}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] capitalize">
                  {format(new Date(selectedDate + 'T12:00:00'), "MMMM yyyy", {
                    locale: es,
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-default"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
              {selectedDateTasks.length === 0 && (
                <p className="text-center text-sm text-[var(--muted-foreground)] py-8">
                  Sin tareas para este día
                </p>
              )}
              {selectedDateTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={setEditingTask}
                />
              ))}
            </div>

            {/* Quick add in drawer */}
            <div className="border-t border-[var(--border)] px-2 py-2">
              <QuickAdd date={selectedDate} />
            </div>
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
