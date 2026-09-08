'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Repeat,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Flame,
  X,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useRecurrenceStore } from '@/store/recurrence-store';
import { PRIORITY_CONFIG } from '@/types';
import { cn } from '@/lib/cn';
import type { Priority } from '@/types';

// Días de la semana en orden europeo (Lunes=1 a Domingo=0)
const WEEK_DAYS = [
  { day: 1, label: 'L', name: 'Lunes' },
  { day: 2, label: 'M', name: 'Martes' },
  { day: 3, label: 'X', name: 'Miércoles' },
  { day: 4, label: 'J', name: 'Jueves' },
  { day: 5, label: 'V', name: 'Viernes' },
  { day: 6, label: 'S', name: 'Sábado' },
  { day: 0, label: 'D', name: 'Domingo' },
];

const ROUTINE_PRESETS = [
  { label: 'Gym (L · X · V)', days: [1, 3, 5] },
  { label: 'Todos los días', days: [1, 2, 3, 4, 5, 6, 0] },
  { label: 'Lunes a Viernes', days: [1, 2, 3, 4, 5] },
  { label: 'Fines de semana', days: [6, 0] },
];

const SUGGESTED_TAGS = ['Salud y Deporte', 'Personal', 'Estudio', 'Trabajo', 'Hogar'];

export default function RecurringPage() {
  const rules = useRecurrenceStore((s) => s.rules);
  const addRule = useRecurrenceStore((s) => s.addRule);
  const deleteRule = useRecurrenceStore((s) => s.deleteRule);

  const [showForm, setShowForm] = useState(false);

  // Estado del formulario de Rutina
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3, 5]); // Por defecto L-X-V (Gym)
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<Priority>('media');
  const [tag, setTag] = useState('Salud y Deporte');

  const toggleDay = (dayNum: number) => {
    if (selectedDays.includes(dayNum)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== dayNum));
      }
    } else {
      setSelectedDays([...selectedDays, dayNum]);
    }
  };

  const applyPreset = (days: number[]) => {
    setSelectedDays(days);
  };

  const resetForm = () => {
    setTitle('');
    setNotes('');
    setSelectedDays([1, 3, 5]);
    setTime('');
    setPriority('media');
    setTag('Salud y Deporte');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedDays.length === 0) return;

    const todayStr = format(new Date(), 'yyyy-MM-dd');

    // Se guarda como regla de repetición semanal con los días seleccionados
    addRule({
      taskTemplate: {
        title: title.trim(),
        notes: notes.trim(),
        time: time || undefined,
        isPersistentReminder: false,
        priority,
        tag: tag || undefined,
      },
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: selectedDays,
      startDate: todayStr,
    });

    resetForm();
    setShowForm(false);
  };

  // Ayudante para formatear días de una rutina
  const formatRoutineDays = (daysOfWeek?: number[]) => {
    if (!daysOfWeek || daysOfWeek.length === 0) return 'Cada semana';
    if (daysOfWeek.length === 7) return 'Todos los días';
    if (
      daysOfWeek.length === 5 &&
      [1, 2, 3, 4, 5].every((d) => daysOfWeek.includes(d))
    ) {
      return 'Lunes a Viernes';
    }
    if (
      daysOfWeek.length === 2 &&
      [6, 0].every((d) => daysOfWeek.includes(d))
    ) {
      return 'Fines de semana';
    }

    // Ordenar de lunes a domingo
    const sorted = [...daysOfWeek].sort((a, b) => {
      const aVal = a === 0 ? 7 : a;
      const bVal = b === 0 ? 7 : b;
      return aVal - bVal;
    });

    return sorted
      .map((d) => WEEK_DAYS.find((wd) => wd.day === d)?.label)
      .join(' · ');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Rutinas"
        subtitle="Hábitos y tareas periódicas (Gym, lectura, estudio...)"
      >
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[var(--foreground)] px-3 py-1.5 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition-default shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva rutina</span>
        </button>
      </Header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 space-y-6">

          {/* Tarjeta explicativa de la sección */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  Construye tus hábitos y actividades periódicas
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">
                  Configura actividades que se repiten en tu semana (como ir al gimnasio los martes y jueves, o leer todos los días). Se proyectarán automáticamente en tu agenda sin tener que escribirlas a mano.
                </p>
              </div>
            </div>
          </div>

          {/* Modal / Formulario para crear Nueva Rutina */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
              <div className="w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl animate-fade-in space-y-5">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-500" />
                    <h3 className="text-base font-semibold text-[var(--foreground)]">
                      Nueva rutina
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-default cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Nombre de la rutina */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[var(--foreground)]">
                      ¿Qué rutina quieres incorporar?
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: Gimnasio (fuerza), Leer 20 min, Meditación..."
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--foreground)] transition-default"
                      autoFocus
                    />
                  </div>

                  {/* Selección rápida de días */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[var(--foreground)]">
                        ¿Qué días se repite?
                      </label>
                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        {formatRoutineDays(selectedDays)}
                      </span>
                    </div>

                    {/* Presets directos */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {ROUTINE_PRESETS.map((p) => {
                        const isSelected =
                          selectedDays.length === p.days.length &&
                          p.days.every((d) => selectedDays.includes(d));
                        return (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => applyPreset(p.days)}
                            className={cn(
                              'rounded-lg px-2.5 py-1 text-[11px] font-medium transition-default border cursor-pointer',
                              isSelected
                                ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]'
                                : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                            )}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Pastillas de días individuales */}
                    <div className="grid grid-cols-7 gap-1.5 pt-1">
                      {WEEK_DAYS.map((wd) => {
                        const isChecked = selectedDays.includes(wd.day);
                        return (
                          <button
                            key={wd.day}
                            type="button"
                            onClick={() => toggleDay(wd.day)}
                            className={cn(
                              'flex flex-col items-center justify-center rounded-xl py-2 font-medium transition-default border cursor-pointer',
                              isChecked
                                ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] shadow-xs'
                                : 'bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--muted-foreground)]'
                            )}
                            title={wd.name}
                          >
                            <span className="text-xs font-bold">{wd.label}</span>
                            <span className="text-[9px] opacity-75">{wd.name.slice(0, 3)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hora y Prioridad */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-[var(--foreground)]">
                        Hora habitual (opcional)
                      </label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-mono outline-none focus:border-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-[var(--foreground)]">
                        Prioridad
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['baja', 'media', 'alta'] as Priority[]).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={cn(
                              'rounded-lg py-2 text-[11px] font-semibold capitalize border transition-default cursor-pointer',
                              priority === p
                                ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                                : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Categoría / Etiqueta */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[var(--foreground)]">
                      Categoría
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {SUGGESTED_TAGS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTag(t)}
                          className={cn(
                            'rounded-lg px-2.5 py-1 text-[11px] font-medium transition-default border cursor-pointer',
                            tag === t
                              ? 'border-blue-500/40 bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold'
                              : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-default cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!title.trim() || selectedDays.length === 0}
                      className="flex items-center gap-1.5 rounded-xl bg-[var(--foreground)] px-4 py-2 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition-default disabled:opacity-40 cursor-pointer shadow-xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Crear rutina</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Listado de Rutinas Activas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Tus rutinas activas ({rules.length})
              </h3>
            </div>

            {rules.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--border)] p-10 text-center bg-[var(--card)]/50 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
                  <Flame className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">
                    Aún no tienes rutinas configuradas
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto mt-1">
                    Crea tu primera rutina (como el gimnasio los martes y jueves, o lectura diaria) para que aparezca automáticamente en tu agenda.
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--foreground)] px-4 py-2 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition-default shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Crear primera rutina</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rules.map((rule) => {
                  const priorityConfig = PRIORITY_CONFIG[rule.taskTemplate.priority];
                  const daysFormatted = formatRoutineDays(rule.daysOfWeek);

                  return (
                    <div
                      key={rule.id}
                      className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs transition-default hover:border-[var(--foreground)]/30 hover:shadow-sm"
                    >
                      <div className="space-y-2">
                        {/* Cabecera de la tarjeta */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-[var(--foreground)] tracking-tight">
                                {rule.taskTemplate.title}
                              </h4>
                              <span
                                className={cn(
                                  'h-1.5 w-1.5 rounded-full shrink-0',
                                  priorityConfig.dotClass
                                )}
                              />
                            </div>
                            {rule.taskTemplate.notes && (
                              <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">
                                {rule.taskTemplate.notes}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => deleteRule(rule.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-500/10 transition-default cursor-pointer"
                            title="Eliminar rutina"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Pastilla de días */}
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/20">
                            <Repeat className="h-3 w-3" />
                            {daysFormatted}
                          </span>

                          {rule.taskTemplate.time && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent)] px-2 py-0.5 text-[11px] font-mono text-[var(--foreground)]">
                              <Clock className="h-3 w-3 opacity-60" />
                              {rule.taskTemplate.time}
                            </span>
                          )}

                          {rule.taskTemplate.tag && (
                            <span className="rounded-lg border border-[var(--border)] px-2 py-0.5 text-[11px] text-[var(--muted-foreground)]">
                              {rule.taskTemplate.tag}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>Activa en tu agenda</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
