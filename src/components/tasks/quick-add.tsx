'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Clock, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTaskStore } from '@/store/task-store';
import type { Priority } from '@/types';

interface QuickAddProps {
  date: string;
  autoFocus?: boolean;
  placeholder?: string;
}

export function QuickAdd({ date, autoFocus = false, placeholder }: QuickAddProps) {
  const [isOpen, setIsOpen] = useState(autoFocus);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [priority, setPriority] = useState<Priority>('media');
  const inputRef = useRef<HTMLInputElement>(null);
  const addTask = useTaskStore((s) => s.addTask);

  useEffect(() => {
    if (autoFocus) {
      setIsOpen(true);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      notes: '',
      date,
      time: time || undefined,
      isCompleted: false,
      isPersistentReminder: false,
      priority,
    });

    setTitle('');
    setTime('');
    setShowTimeInput(false);
    setPriority('media');
    // Mantenemos el input enfocado para permitir inserción ágil de varias tareas
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setTitle('');
      setTime('');
      setShowTimeInput(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group flex w-full items-center gap-2.5 rounded-xl border border-dashed border-[var(--border)] px-3.5 py-2.5 text-xs text-[var(--muted-foreground)] hover:border-[var(--foreground)]/40 hover:bg-[var(--accent)]/40 hover:text-[var(--foreground)] transition-default cursor-pointer"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-md border border-[var(--border)] group-hover:border-[var(--foreground)]/50 group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] transition-default">
          <Plus className="h-3 w-3" />
        </span>
        <span className="font-medium">Añadir tarea a este día...</span>
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5 shadow-sm animate-fade-in space-y-2.5">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || '¿Qué tienes planeado hacer?'}
          className="flex-1 bg-transparent text-sm font-medium text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] placeholder:font-normal"
        />

        {showTimeInput && (
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded-md border border-[var(--border)] bg-[var(--accent)] px-2 py-0.5 text-xs font-mono outline-none"
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]/60 text-xs">
        {/* Prioridades y hora */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {(['baja', 'media', 'alta'] as Priority[]).map((p) => {
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-default capitalize cursor-pointer',
                    isSelected
                      ? p === 'alta'
                        ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                        : p === 'media'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border border-zinc-500/30'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] border border-transparent'
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      p === 'alta' && 'bg-red-500',
                      p === 'media' && 'bg-amber-500',
                      p === 'baja' && 'bg-zinc-500'
                    )}
                  />
                  {p}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowTimeInput(!showTimeInput)}
            className={cn(
              'flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-default cursor-pointer',
              time
                ? 'bg-[var(--accent)] text-[var(--foreground)] border border-[var(--border)]'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] border border-transparent'
            )}
            title="Asignar hora"
          >
            <Clock className="h-3 w-3" />
            <span>{time || 'Hora'}</span>
          </button>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setTitle('');
              setTime('');
              setShowTimeInput(false);
            }}
            className="px-2 py-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-default cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex items-center gap-1 rounded-lg bg-[var(--foreground)] px-2.5 py-1 text-xs font-medium text-[var(--background)] hover:opacity-90 transition-default disabled:opacity-30 cursor-pointer shadow-xs"
          >
            <span>Añadir</span>
            <CornerDownLeft className="h-3 w-3 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
}
