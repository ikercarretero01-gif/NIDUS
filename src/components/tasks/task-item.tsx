'use client';

import { useState } from 'react';
import { Check, Clock, Pencil, Trash2, Pin, Repeat, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Task } from '@/types';
import { PRIORITY_CONFIG } from '@/types';
import { useTaskStore } from '@/store/task-store';
import { useRecurrenceStore } from '@/store/recurrence-store';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onPostpone?: (task: Task) => void;
  showPostponeButton?: boolean;
  compact?: boolean;
}

export function TaskItem({
  task,
  onEdit,
  onPostpone,
  showPostponeButton = false,
  compact = false,
}: TaskItemProps) {
  const toggleComplete = useTaskStore((s) => s.toggleComplete);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const addCompletion = useRecurrenceStore((s) => s.addCompletion);
  const removeCompletion = useRecurrenceStore((s) => s.removeCompletion);
  const [isAnimating, setIsAnimating] = useState(false);

  const priorityConfig = PRIORITY_CONFIG[task.priority];

  const handleToggle = () => {
    setIsAnimating(true);

    if (task.recurrenceRuleId) {
      // Tarea virtual de recurrencia
      if (task.isCompleted) {
        removeCompletion(task.recurrenceRuleId, task.date);
      } else {
        addCompletion(task.recurrenceRuleId, task.date);
      }
    } else {
      toggleComplete(task.id);
    }

    setTimeout(() => setIsAnimating(false), 260);
  };

  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-xl border border-[var(--border)]/60 bg-[var(--card)] px-3 py-2.5 transition-default hover:border-[var(--border)] hover:bg-[var(--accent)]/40 hover:shadow-sm',
        task.isCompleted && 'task-completed opacity-55 bg-transparent border-transparent hover:border-[var(--border)]/40',
        compact && 'py-1.5 px-2.5 rounded-lg'
      )}
    >
      {/* Checkbox minimalista animado */}
      <button
        onClick={handleToggle}
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-all duration-200 cursor-pointer',
          task.isCompleted
            ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)] shadow-xs'
            : 'border-[var(--border)] bg-transparent hover:border-[var(--muted-foreground)] hover:scale-105',
          isAnimating && 'animate-check-bounce'
        )}
        aria-label={task.isCompleted ? 'Desmarcar tarea' : 'Completar tarea'}
      >
        {task.isCompleted && (
          <Check className="h-2.5 w-2.5 stroke-[3]" />
        )}
      </button>

      {/* Contenido principal */}
      <div
        className={cn('flex-1 min-w-0', onEdit && 'cursor-pointer')}
        onClick={() => onEdit?.(task)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              'task-title text-sm font-medium tracking-tight text-[var(--foreground)] transition-default',
              task.isCompleted && 'text-[var(--muted-foreground)] font-normal'
            )}
          >
            {task.title}
          </span>

          {/* Badge de prioridad pro */}
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide',
              task.priority === 'alta' && 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
              task.priority === 'media' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
              task.priority === 'baja' && 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20'
            )}
          >
            <span className={cn('h-1 w-1 rounded-full', priorityConfig.dotClass)} />
            {priorityConfig.label}
          </span>
        </div>

        {/* Notas breves si existen */}
        {task.notes && !compact && (
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)] line-clamp-1 leading-relaxed">
            {task.notes}
          </p>
        )}

        {/* Metadatos (hora, etiquetas, recurrencia, recordatorio) */}
        {!compact && (
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[var(--muted-foreground)] flex-wrap">
            {task.time && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--accent)] px-1.5 py-0.5 font-mono text-[10px] font-medium">
                <Clock className="h-3 w-3 opacity-70" />
                {task.time}
              </span>
            )}
            {task.tag && (
              <span className="rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px]">
                {task.tag}
              </span>
            )}
            {task.isPersistentReminder && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300 border border-amber-500/20">
                <Pin className="h-2.5 w-2.5" />
                Fijada
              </span>
            )}
            {task.recurrenceRuleId && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--accent)] px-1.5 py-0.5 text-[10px]" title="Tarea recurrente">
                <Repeat className="h-2.5 w-2.5 opacity-70" />
                Repite
              </span>
            )}
          </div>
        )}
      </div>

      {/* Botón explícito de posponer (por ejemplo en la sección Pendientes) */}
      {showPostponeButton && onPostpone && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPostpone(task);
          }}
          className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 transition-default cursor-pointer shrink-0"
          title="Posponer y elegir nuevo día en calendario"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Posponer</span>
        </button>
      )}

      {/* Botones de acción rápida al pasar el cursor */}
      <div className="opacity-0 group-hover:opacity-100 transition-default flex items-center gap-0.5 shrink-0">
        {!showPostponeButton && onPostpone && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPostpone(task);
            }}
            className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-default cursor-pointer"
            title="Posponer tarea"
            aria-label="Posponer tarea"
          >
            <Calendar className="h-3.5 w-3.5" />
          </button>
        )}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-default cursor-pointer"
            title="Editar tarea"
            aria-label="Editar tarea"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        {!task.recurrenceRuleId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-default cursor-pointer"
            title="Eliminar tarea"
            aria-label="Eliminar tarea"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
