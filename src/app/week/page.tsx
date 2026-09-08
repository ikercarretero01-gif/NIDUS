'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { TaskItem } from '@/components/tasks/task-item';
import { QuickAdd } from '@/components/tasks/quick-add';
import { TaskForm } from '@/components/tasks/task-form';
import { useTaskStore } from '@/store/task-store';
import { useRecurrenceStore } from '@/store/recurrence-store';
import { generateVirtualTasks } from '@/lib/recurrence-engine';
import type { Task } from '@/types';
import { cn } from '@/lib/cn';

export default function WeekPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Lunes
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const tasks = useTaskStore((s) => s.tasks);
  const rules = useRecurrenceStore((s) => s.rules);
  const completions = useRecurrenceStore((s) => s.completions);
  const updateTask = useTaskStore((s) => s.updateTask);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Generar los 7 días de la semana
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  // Obtener todas las tareas de la semana (normales + virtuales)
  const weekTasks = useMemo(() => {
    const startStr = format(weekStart, 'yyyy-MM-dd');
    const endStr = format(weekEnd, 'yyyy-MM-dd');

    const normalTasks = tasks.filter(
      (t) => t.date >= startStr && t.date <= endStr
    );
    const virtualTasks = generateVirtualTasks(
      rules,
      completions,
      weekStart,
      weekEnd
    );
    const normalIds = new Set(normalTasks.map((t) => t.id));
    const uniqueVirtual = virtualTasks.filter((vt) => !normalIds.has(vt.id));
    return [...normalTasks, ...uniqueVirtual];
  }, [tasks, rules, completions, weekStart, weekEnd]);

  // Agrupar tareas por día
  const tasksByDay = useMemo(() => {
    const map: Record<string, Task[]> = {};
    weekDays.forEach((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      map[dateStr] = weekTasks
        .filter((t) => t.date === dateStr)
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    });
    return map;
  }, [weekDays, weekTasks]);

  const weekLabel = `${format(weekStart, "d 'de' MMM", { locale: es })} – ${format(weekEnd, "d 'de' MMM yyyy", { locale: es })}`;

  // Drag and drop simplificado (sin dnd-kit por ahora, se agrega en Fase 3 completa)
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      // Solo mover tareas no-recurrentes
      const task = tasks.find((t) => t.id === taskId);
      if (task && !task.recurrenceRuleId) {
        updateTask(taskId, { date: targetDate });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Semana" subtitle={weekLabel}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
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
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-default"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </Header>

      <div className="flex-1 overflow-x-auto">
        <div className="grid grid-cols-7 min-w-[900px] h-full">
          {weekDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayTasks = tasksByDay[dateStr] || [];
            const dayIsToday = isToday(day);

            return (
              <div
                key={dateStr}
                className={cn(
                  'flex flex-col border-r border-[var(--border)] last:border-r-0',
                  dayIsToday && 'bg-[var(--accent)]/30'
                )}
                onDrop={(e) => handleDrop(e, dateStr)}
                onDragOver={handleDragOver}
              >
                {/* Day header */}
                <div
                  className={cn(
                    'sticky top-0 z-10 flex flex-col items-center border-b border-[var(--border)] bg-[var(--background)] py-3',
                    dayIsToday && 'bg-[var(--accent)]/30'
                  )}
                >
                  <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
                    {format(day, 'EEE', { locale: es })}
                  </span>
                  <span
                    className={cn(
                      'mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
                      dayIsToday
                        ? 'bg-[var(--foreground)] text-[var(--background)]'
                        : 'text-[var(--foreground)]'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Tasks */}
                <div className="flex-1 p-1.5 space-y-0.5 overflow-y-auto">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable={!task.recurrenceRuleId}
                      onDragStart={(e) => handleDragStart(e, task)}
                      className={cn(
                        !task.recurrenceRuleId && 'cursor-grab active:cursor-grabbing'
                      )}
                    >
                      <TaskItem
                        task={task}
                        onEdit={setEditingTask}
                        compact
                      />
                    </div>
                  ))}
                </div>

                {/* Quick add button */}
                <div className="p-1.5 border-t border-[var(--border)]">
                  <QuickAdd date={dateStr} placeholder="+ Tarea" />
                </div>
              </div>
            );
          })}
        </div>
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
