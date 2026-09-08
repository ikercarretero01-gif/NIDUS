'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTaskStore } from '@/store/task-store';
import type { Task, Priority } from '@/types';
import { DEFAULT_TAGS } from '@/lib/constants';
import { PRIORITY_CONFIG } from '@/types';

interface TaskFormProps {
  task?: Task | null;
  date?: string;
  onClose: () => void;
}

export function TaskForm({ task, date, onClose }: TaskFormProps) {
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [taskDate, setTaskDate] = useState(task?.date || date || '');
  const [time, setTime] = useState(task?.time || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'media');
  const [tag, setTag] = useState(task?.tag || '');
  const [isPersistentReminder, setIsPersistentReminder] = useState(
    task?.isPersistentReminder || false
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && task) {
      updateTask(task.id, {
        title: title.trim(),
        notes,
        date: taskDate,
        time: time || undefined,
        priority,
        tag: tag || undefined,
        isPersistentReminder,
      });
    } else {
      addTask({
        title: title.trim(),
        notes,
        date: taskDate,
        time: time || undefined,
        isCompleted: false,
        isPersistentReminder,
        priority,
        tag: tag || undefined,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold">
            {isEditing ? 'Editar tarea' : 'Nueva tarea'}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-default"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la tarea"
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400/30 placeholder:text-[var(--muted-foreground)] transition-default"
              autoFocus
            />
          </div>

          {/* Notas */}
          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas (opcional)"
              rows={3}
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400/30 placeholder:text-[var(--muted-foreground)] resize-none transition-default"
            />
          </div>

          {/* Fecha y Hora */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-[var(--muted-foreground)] mb-1 block">
                Fecha
              </label>
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400/30 transition-default"
              />
            </div>
            <div className="w-28">
              <label className="text-xs text-[var(--muted-foreground)] mb-1 block">
                Hora
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400/30 transition-default"
              />
            </div>
          </div>

          {/* Prioridad */}
          <div>
            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
              Prioridad
            </label>
            <div className="flex gap-2">
              {(['baja', 'media', 'alta'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    'flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-default',
                    priority === p
                      ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                      : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]'
                  )}
                >
                  {PRIORITY_CONFIG[p].label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag */}
          <div>
            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
              Etiqueta
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(tag === t ? '' : t)}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs transition-default',
                    tag === t
                      ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                      : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Recordatorio Persistente */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded border transition-default',
                isPersistentReminder
                  ? 'border-[var(--foreground)] bg-[var(--foreground)]'
                  : 'border-[var(--border)] group-hover:border-[var(--muted-foreground)]'
              )}
              onClick={() => setIsPersistentReminder(!isPersistentReminder)}
            >
              {isPersistentReminder && (
                <span className="text-[10px] text-[var(--background)]">📌</span>
              )}
            </div>
            <div>
              <span className="text-sm font-medium">Recordatorio persistente</span>
              <p className="text-xs text-[var(--muted-foreground)]">
                Se mantiene visible hasta completarla
              </p>
            </div>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 rounded-lg bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:opacity-90 transition-default disabled:opacity-30"
            >
              {isEditing ? 'Guardar cambios' : 'Crear tarea'}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950 transition-default"
              >
                Eliminar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
