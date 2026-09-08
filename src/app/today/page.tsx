'use client';

import { useState, useMemo } from 'react';
import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  addDays,
  subDays,
  differenceInCalendarDays,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  CalendarDays,
  CalendarClock,
  CalendarCheck2,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { TaskItem } from '@/components/tasks/task-item';
import { QuickAdd } from '@/components/tasks/quick-add';
import { TaskForm } from '@/components/tasks/task-form';
import { PostponeModal } from '@/components/tasks/postpone-modal';
import { useTaskStore } from '@/store/task-store';
import { useRecurrenceStore } from '@/store/recurrence-store';
import { generateVirtualTasks, getTaskTimeBlock } from '@/lib/recurrence-engine';
import type { Task } from '@/types';
import { cn } from '@/lib/cn';

export default function TodayPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [postponingTask, setPostponingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fecha actual del sistema (Hoy) y fecha activa seleccionada
  const todayDate = new Date();
  const todayStr = format(todayDate, 'yyyy-MM-dd');
  const activeDateStr = format(selectedDate, 'yyyy-MM-dd');

  // Comprobaciones de fecha relativa
  const isSelectedToday = isToday(selectedDate);
  const isSelectedTomorrow = isTomorrow(selectedDate);
  const isSelectedYesterday = isYesterday(selectedDate);

  const diffDays = differenceInCalendarDays(selectedDate, todayDate);

  // Subtítulo con formato formal en español
  const formattedFullDate = format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: es,
  });

  // Etiqueta del encabezado principal
  const displayTitle = useMemo(() => {
    if (isSelectedToday) return 'Hoy';
    if (isSelectedTomorrow) return 'Mañana';
    if (isSelectedYesterday) return 'Ayer';
    const dayName = format(selectedDate, 'EEEE', { locale: es });
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  }, [selectedDate, isSelectedToday, isSelectedTomorrow, isSelectedYesterday]);

  // Manejadores de navegación diaria
  const handlePrevDay = () => setSelectedDate((prev) => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate((prev) => addDays(prev, 1));
  const handleSelectYesterday = () => setSelectedDate(subDays(todayDate, 1));
  const handleSelectToday = () => setSelectedDate(new Date());
  const handleSelectTomorrow = () => setSelectedDate(addDays(todayDate, 1));

  // Selectores de Zustand
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const rules = useRecurrenceStore((s) => s.rules);
  const completions = useRecurrenceStore((s) => s.completions);

  // Tareas del día seleccionado (normales + virtuales de recurrencia)
  const currentDayTasks = useMemo(() => {
    const normalTasks = tasks.filter((t) => t.date === activeDateStr);
    const dateObj = new Date(activeDateStr);
    const virtualTasks = generateVirtualTasks(
      rules,
      completions,
      dateObj,
      dateObj
    );
    const normalIds = new Set(normalTasks.map((t) => t.id));
    const uniqueVirtual = virtualTasks.filter((vt) => !normalIds.has(vt.id));
    return [...normalTasks, ...uniqueVirtual];
  }, [tasks, rules, completions, activeDateStr]);

  // Sección "Pendientes": Tareas que no se han cumplido cuando terminó su día (anteriores a hoy)
  const overduePendingTasks = useMemo(() => {
    return tasks.filter((t) => !t.isCompleted && t.date < todayStr);
  }, [tasks, todayStr]);

  // Posponer una tarea a una nueva fecha
  const handlePostponeTask = (taskId: string, newDate: string) => {
    updateTask(taskId, { date: newDate });
  };

  // Posponer todas las tareas pendientes acumuladas al día de hoy
  const handlePostponeAllToToday = () => {
    overduePendingTasks.forEach((task) => {
      updateTask(task.id, { date: todayStr });
    });
  };

  // Clasificar tareas del día por bloques de tiempo
  const tasksByBlock = useMemo(() => {
    const blocks: Record<string, Task[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      'no-time': [],
    };

    currentDayTasks.forEach((task) => {
      // Si es una tarea atrasada pendiente previa a hoy, ya se atiende en la sección Pendientes
      if (!task.isCompleted && task.date < todayStr) return;
      const block = getTaskTimeBlock(task.time);
      blocks[block].push(task);
    });

    // Ordenar por hora dentro de cada bloque
    Object.values(blocks).forEach((arr) =>
      arr.sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    );

    return blocks;
  }, [currentDayTasks, todayStr]);

  // Estadísticas del día
  const totalTasks = currentDayTasks.length;
  const completedCount = currentDayTasks.filter((t) => t.isCompleted).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Iconos y etiquetas por bloque
  const blockDetails = [
    {
      key: 'morning',
      label: 'Mañana',
      timeRange: '06:00 – 12:00',
      icon: Sun,
      iconColor: 'text-amber-500',
    },
    {
      key: 'afternoon',
      label: 'Tarde',
      timeRange: '12:00 – 18:00',
      icon: Sunset,
      iconColor: 'text-orange-500',
    },
    {
      key: 'evening',
      label: 'Noche',
      timeRange: '18:00 – 24:00',
      icon: Moon,
      iconColor: 'text-indigo-400',
    },
    {
      key: 'no-time',
      label: 'Sin hora fija',
      timeRange: 'Flexible',
      icon: Clock,
      iconColor: 'text-[var(--muted-foreground)]',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header superior enriquecido */}
      <Header
        title={displayTitle}
        subtitle={formattedFullDate}
      >
        {/* Controles de navegación en el Header */}
        <div className="flex items-center gap-2">
          {/* Segmented Control Ayer / Hoy / Mañana */}
          <div className="hidden sm:flex items-center rounded-lg bg-[var(--muted)] p-0.5 border border-[var(--border)]/60 text-xs">
            <button
              onClick={handleSelectYesterday}
              className={cn(
                'rounded-md px-2.5 py-1 font-medium transition-default cursor-pointer',
                isSelectedYesterday
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              Ayer
            </button>
            <button
              onClick={handleSelectToday}
              className={cn(
                'rounded-md px-2.5 py-1 font-medium transition-default cursor-pointer',
                isSelectedToday
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              Hoy
            </button>
            <button
              onClick={handleSelectTomorrow}
              className={cn(
                'rounded-md px-2.5 py-1 font-medium transition-default cursor-pointer',
                isSelectedTomorrow
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              Mañana
            </button>
          </div>

          {/* Flechas día anterior / día siguiente */}
          <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--card)] p-0.5 shadow-xs">
            <button
              onClick={handlePrevDay}
              className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-default cursor-pointer"
              title="Día anterior"
              aria-label="Día anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-3 w-px bg-[var(--border)] mx-0.5" />
            <button
              onClick={handleNextDay}
              className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-default cursor-pointer"
              title="Día siguiente"
              aria-label="Día siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Botón flotante para volver a Hoy cuando estamos en otro día */}
          {!isSelectedToday && (
            <button
              onClick={handleSelectToday}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--accent)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--border)] transition-default cursor-pointer animate-fade-in"
              title="Regresar a hoy"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Volver a Hoy</span>
            </button>
          )}
        </div>
      </Header>

      {/* Contenedor principal de la agenda */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 space-y-7">
          
          {/* Tarjeta de barra de progreso y estado del día */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                  <CalendarDays className="h-4 w-4 text-[var(--foreground)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
                      Agenda del día
                    </h3>
                    {isSelectedToday && (
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        Hoy
                      </span>
                    )}
                    {isSelectedTomorrow && (
                      <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        Mañana
                      </span>
                    )}
                    {isSelectedYesterday && (
                      <span className="rounded-full bg-zinc-500/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
                        Ayer
                      </span>
                    )}
                    {!isSelectedToday && !isSelectedTomorrow && !isSelectedYesterday && (
                      <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)] border border-[var(--border)]">
                        {diffDays > 0 ? `+${diffDays} días` : `${diffDays} días`}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5 capitalize">
                    {formattedFullDate}
                  </p>
                </div>
              </div>

              {/* Métricas rápidas */}
              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="font-semibold text-[var(--foreground)]">
                    {completedCount}/{totalTasks}
                  </span>
                  <span className="text-[var(--muted-foreground)] ml-1">completadas</span>
                </div>
                {totalTasks > 0 && (
                  <div className="flex items-center gap-1.5 font-medium text-[var(--muted-foreground)]">
                    <span className="text-xs">{completionPercentage}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Barra de progreso sutil */}
            {totalTasks > 0 && (
              <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--foreground)] transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            )}
          </div>

          {/* SECCIÓN "PENDIENTES": Tareas que no se han cumplido cuando terminó el día */}
          {overduePendingTasks.length > 0 && (
            <section className="rounded-2xl border border-amber-300/50 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 p-4 animate-fade-in shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 dark:border-amber-900/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <CalendarClock className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                        Pendientes
                      </h4>
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                        {overduePendingTasks.length} sin cumplir
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300/70">
                      Tareas de días anteriores no completadas. Puedes posponerlas o marcarlas como hechas.
                    </p>
                  </div>
                </div>

                {/* Botón rápido para posponer todas a Hoy */}
                <button
                  type="button"
                  onClick={handlePostponeAllToToday}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-500/25 transition-default cursor-pointer shrink-0"
                  title="Mover todas las tareas pendientes al día de hoy"
                >
                  <CalendarCheck2 className="h-3.5 w-3.5" />
                  <span>Mover todas a Hoy</span>
                </button>
              </div>

              {/* Lista de tareas pendientes atrasadas */}
              <div className="space-y-1.5 pt-1">
                {overduePendingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                    onPostpone={(t) => setPostponingTask(t)}
                    showPostponeButton={true}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Lista de bloques horarios del día activo */}
          <div className="space-y-6">
            {blockDetails.map((block) => {
              const tasksInBlock = tasksByBlock[block.key] || [];
              const BlockIcon = block.icon;

              // Ocultar bloques vacíos excepto si es el de tareas sin hora o si hay tareas
              if (tasksInBlock.length === 0 && block.key !== 'no-time') {
                return null;
              }

              return (
                <section key={block.key} className="space-y-2.5 animate-fade-in">
                  {/* Encabezado del bloque */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <BlockIcon className={cn('h-3.5 w-3.5', block.iconColor)} />
                      <h4 className="text-xs font-semibold tracking-wide text-[var(--foreground)] uppercase">
                        {block.label}
                      </h4>
                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        · {block.timeRange}
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-[var(--muted-foreground)]">
                      {tasksInBlock.length} {tasksInBlock.length === 1 ? 'tarea' : 'tareas'}
                    </span>
                  </div>

                  {/* Tareas del bloque */}
                  {tasksInBlock.length > 0 ? (
                    <div className="space-y-1.5">
                      {tasksInBlock.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onEdit={setEditingTask}
                          onPostpone={(t) => setPostponingTask(t)}
                        />
                      ))}
                    </div>
                  ) : (
                    block.key === 'no-time' && totalTasks === 0 && (
                      <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center bg-[var(--card)]/50">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--muted)] border border-[var(--border)] mb-3">
                          <Sparkles className="h-5 w-5 text-amber-500" />
                        </div>
                        <h4 className="text-sm font-semibold text-[var(--foreground)]">
                          Sin tareas programadas
                        </h4>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
                          {isSelectedToday
                            ? 'Tu día está totalmente despejado. Añade lo que quieras lograr hoy o tómate un descanso.'
                            : `No hay tareas asignadas para el ${displayTitle.toLowerCase()}. ¡Planifica con anticipación!`}
                        </p>
                      </div>
                    )
                  )}
                </section>
              );
            })}
          </div>

          {/* Añadir tarea rápida fijada a la fecha que se está visualizando */}
          <div className="pt-2">
            <QuickAdd
              date={activeDateStr}
              placeholder={`Añadir tarea para ${isSelectedToday ? 'hoy' : isSelectedTomorrow ? 'mañana' : displayTitle.toLowerCase()}...`}
            />
          </div>

        </div>
      </div>

      {/* Modal interactivo para Posponer y elegir día en mini calendario */}
      <PostponeModal
        task={postponingTask}
        isOpen={!!postponingTask}
        onClose={() => setPostponingTask(null)}
        onPostpone={handlePostponeTask}
      />

      {/* Modal de edición / creación completa de tarea */}
      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          date={activeDateStr}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
