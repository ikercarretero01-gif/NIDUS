'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  ListTodo,
  X,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  ChevronRight,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { TaskItem } from '@/components/tasks/task-item';
import { TaskForm } from '@/components/tasks/task-form';
import { useProjectStore, PROJECT_COLORS } from '@/store/project-store';
import { useTaskStore } from '@/store/task-store';
import { cn } from '@/lib/cn';
import type { Project, ProjectGoal, ProjectGoalStatus, Task, Priority } from '@/types';

export default function ProjectsPage() {
  const projects = useProjectStore((s) => s.projects);
  const addProject = useProjectStore((s) => s.addProject);
  const updateProject = useProjectStore((s) => s.updateProject);
  const deleteProject = useProjectStore((s) => s.deleteProject);

  const goals = useProjectStore((s) => s.goals || []);
  const addGoal = useProjectStore((s) => s.addGoal);
  const updateGoal = useProjectStore((s) => s.updateGoal);
  const deleteGoal = useProjectStore((s) => s.deleteGoal);

  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    return projects[0]?.id || '';
  });

  // Pestaña activa dentro del proyecto: 'roadmap' (metas) o 'agenda' (tareas diarias vinculadas)
  const [activeTab, setActiveTab] = useState<'roadmap' | 'agenda'>('roadmap');

  // Modales
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ProjectGoal | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Formulario proyecto
  const [formProjectName, setFormProjectName] = useState('');
  const [formProjectDesc, setFormProjectDesc] = useState('');
  const [formProjectColor, setFormProjectColor] = useState(PROJECT_COLORS[0].value);

  // Formulario meta
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalStatus, setGoalStatus] = useState<ProjectGoalStatus>('todo');
  const [goalPriority, setGoalPriority] = useState<Priority>('media');
  const [goalTargetDate, setGoalTargetDate] = useState('');

  // Quick add meta rápida
  const [quickGoalTitle, setQuickGoalTitle] = useState('');
  const [quickGoalPriority, setQuickGoalPriority] = useState<Priority>('media');
  const [quickGoalStatus, setQuickGoalStatus] = useState<ProjectGoalStatus>('todo');

  // Feedback de acción "enviado a hoy"
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0] || null;
  }, [projects, selectedProjectId]);

  // Metas del proyecto seleccionado
  const projectGoals = useMemo(() => {
    if (!selectedProject) return [];
    return goals.filter((g) => g.projectId === selectedProject.id);
  }, [goals, selectedProject]);

  // Tareas diarias de la agenda que están vinculadas a este proyecto
  const projectAgendaTasks = useMemo(() => {
    if (!selectedProject) return [];
    return tasks.filter((t) => t.projectId === selectedProject.id);
  }, [tasks, selectedProject]);

  // Métricas del Roadmap del proyecto
  const totalGoals = projectGoals.length;
  const completedGoals = projectGoals.filter((g) => g.status === 'completed').length;
  const inProgressGoals = projectGoals.filter((g) => g.status === 'in_progress').length;
  const goalsProgress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Métricas de ejecución en agenda diaria
  const totalAgendaTasks = projectAgendaTasks.length;
  const completedAgendaTasks = projectAgendaTasks.filter((t) => t.isCompleted).length;

  // Handlers Proyecto
  const handleOpenCreateProject = () => {
    setEditingProject(null);
    setFormProjectName('');
    setFormProjectDesc('');
    setFormProjectColor(PROJECT_COLORS[0].value);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (p: Project) => {
    setEditingProject(p);
    setFormProjectName(p.name);
    setFormProjectDesc(p.description || '');
    setFormProjectColor(p.color);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProjectName.trim()) return;

    if (editingProject) {
      updateProject(editingProject.id, {
        name: formProjectName.trim(),
        description: formProjectDesc.trim() || undefined,
        color: formProjectColor,
      });
    } else {
      const created = addProject({
        name: formProjectName.trim(),
        description: formProjectDesc.trim() || undefined,
        color: formProjectColor,
      });
      setSelectedProjectId(created.id);
    }

    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el proyecto "${name}" y sus metas del roadmap?`)) {
      deleteProject(id);
      if (selectedProjectId === id) {
        const remaining = projects.filter((p) => p.id !== id);
        if (remaining.length > 0) {
          setSelectedProjectId(remaining[0].id);
        }
      }
    }
  };

  // Handlers Meta del Roadmap
  const handleOpenCreateGoal = () => {
    setEditingGoal(null);
    setGoalTitle('');
    setGoalDesc('');
    setGoalStatus('todo');
    setGoalPriority('media');
    setGoalTargetDate('');
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: ProjectGoal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalDesc(goal.description || '');
    setGoalStatus(goal.status);
    setGoalPriority(goal.priority);
    setGoalTargetDate(goal.targetDate || '');
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || !selectedProject) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title: goalTitle.trim(),
        description: goalDesc.trim() || undefined,
        status: goalStatus,
        priority: goalPriority,
        targetDate: goalTargetDate || undefined,
      });
    } else {
      addGoal({
        projectId: selectedProject.id,
        title: goalTitle.trim(),
        description: goalDesc.trim() || undefined,
        status: goalStatus,
        priority: goalPriority,
        targetDate: goalTargetDate || undefined,
      });
    }

    setIsGoalModalOpen(false);
  };

  const handleQuickAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickGoalTitle.trim() || !selectedProject) return;

    addGoal({
      projectId: selectedProject.id,
      title: quickGoalTitle.trim(),
      status: quickGoalStatus,
      priority: quickGoalPriority,
    });

    setQuickGoalTitle('');
    showToast('Nueva meta añadida al roadmap del proyecto');
  };

  // Acción: Promover una Meta del Roadmap a una subtarea para la agenda de hoy
  const handleSendGoalToToday = (goal: ProjectGoal) => {
    if (!selectedProject) return;

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    addTask({
      title: goal.title,
      notes: goal.description ? `Subtarea de meta: ${goal.description}` : '',
      date: todayStr,
      isCompleted: false,
      isPersistentReminder: false,
      priority: goal.priority,
      projectId: selectedProject.id,
      projectGoalId: goal.id,
    });

    // Si la meta estaba 'todo', pasarla automáticamente a 'in_progress'
    if (goal.status === 'todo') {
      updateGoal(goal.id, { status: 'in_progress' });
    }

    showToast(`✓ "${goal.title}" planificada en tu agenda de hoy`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Proyectos & Roadmap"
        subtitle="Estructura tus metas estratégicas y sincroniza la ejecución diaria en tu agenda"
      >
        <button
          type="button"
          onClick={handleOpenCreateProject}
          className="flex items-center gap-1.5 rounded-xl bg-[var(--foreground)] px-3.5 py-2 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition-default shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nuevo Proyecto</span>
        </button>
      </Header>

      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] px-4 py-2.5 text-xs font-medium shadow-xl animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {projects.length === 0 ? (
          /* Estado vacío */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-4 text-[var(--muted-foreground)]">
              <FolderKanban className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">No tienes ningún proyecto</h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-sm mt-1 mb-6">
              Crea tu primer proyecto para trazar su roadmap con metas visuales y vincular subtareas a tu agenda diaria.
            </p>
            <button
              type="button"
              onClick={handleOpenCreateProject}
              className="flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition-default cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Crear mi primer proyecto</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Columna Izquierda: Proyectos con progreso del Roadmap */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Tus Proyectos ({projects.length})
                </span>
                <button
                  type="button"
                  onClick={handleOpenCreateProject}
                  className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-default flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Añadir</span>
                </button>
              </div>

              <div className="space-y-2">
                {projects.map((proj) => {
                  const pGoals = goals.filter((g) => g.projectId === proj.id);
                  const pGoalsDone = pGoals.filter((g) => g.status === 'completed').length;
                  const pProgress = pGoals.length > 0 ? Math.round((pGoalsDone / pGoals.length) * 100) : 0;
                  const pTasks = tasks.filter((t) => t.projectId === proj.id);
                  const isSelected = selectedProject?.id === proj.id;

                  return (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className={cn(
                        'group rounded-2xl border p-4 transition-all duration-150 cursor-pointer text-left relative overflow-hidden',
                        isSelected
                          ? 'border-[var(--foreground)] bg-[var(--card)] shadow-xs ring-1 ring-[var(--foreground)]/10'
                          : 'border-[var(--border)] bg-[var(--card)]/50 hover:bg-[var(--card)] hover:border-[var(--muted-foreground)]/30'
                      )}
                    >
                      {/* Borde lateral de color */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: proj.color }}
                      />

                      <div className="flex items-start justify-between gap-2 pl-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: proj.color }}
                            />
                            <h4 className="text-sm font-semibold text-[var(--foreground)] truncate">
                              {proj.name}
                            </h4>
                          </div>

                          {proj.description && (
                            <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-1 pl-4.5">
                              {proj.description}
                            </p>
                          )}
                        </div>

                        {/* Botones de acción */}
                        <div className="opacity-0 group-hover:opacity-100 transition-default flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditProject(proj);
                            }}
                            className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-default"
                            title="Editar proyecto"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(proj.id, proj.name);
                            }}
                            className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-default"
                            title="Eliminar proyecto"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Progreso del Roadmap */}
                      <div className="mt-3.5 pl-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3 opacity-70" />
                            <span>{pGoalsDone} de {pGoals.length} metas</span>
                          </span>
                          <span className="font-mono font-medium text-[var(--foreground)]">
                            {pProgress}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[var(--accent)] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${pProgress}%`,
                              backgroundColor: proj.color,
                            }}
                          />
                        </div>

                        {/* Indicador de subtareas en agenda */}
                        <div className="pt-1 text-[10px] text-[var(--muted-foreground)] flex items-center justify-between">
                          <span>{pTasks.length} tareas en agenda</span>
                          <ChevronRight className="h-3 w-3 opacity-50" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Columna Derecha: Panel Visual del Proyecto */}
            {selectedProject && (
              <div className="lg:col-span-8 space-y-6">
                
                {/* Hero Card del Proyecto */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ backgroundColor: selectedProject.color }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: selectedProject.color }}
                        />
                        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                          {selectedProject.name}
                        </h2>
                      </div>
                      {selectedProject.description && (
                        <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-xl">
                          {selectedProject.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleOpenCreateGoal}
                        className="flex items-center gap-1.5 rounded-xl bg-[var(--foreground)] px-3 py-1.5 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition-default cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Nueva Meta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditProject(selectedProject)}
                        className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-default cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 opacity-70" />
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>

                  {/* Estadísticas del Proyecto */}
                  <div className="grid grid-cols-4 gap-3 pt-5 mt-5 border-t border-[var(--border)]">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[var(--muted-foreground)]">Metas Roadmap</span>
                      <span className="text-lg font-bold font-mono text-[var(--foreground)]">
                        {totalGoals}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[var(--muted-foreground)]">En Progreso</span>
                      <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                        {inProgressGoals}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[var(--muted-foreground)]">Conseguidas</span>
                      <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {completedGoals}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[var(--muted-foreground)]">En Agenda Diaria</span>
                      <span className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
                        {completedAgendaTasks}/{totalAgendaTasks}
                      </span>
                    </div>
                  </div>

                  {/* Barra de progreso visual del Roadmap */}
                  <div className="pt-4 mt-4 border-t border-[var(--border)]/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5 opacity-70" />
                        <span>Progreso global del Roadmap</span>
                      </span>
                      <span className="font-mono font-semibold text-[var(--foreground)]">
                        {goalsProgress}% ({completedGoals} de {totalGoals} metas)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[var(--accent)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${goalsProgress}%`,
                          backgroundColor: selectedProject.color,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Switcher de Pestañas: Roadmap Estratégico vs Ejecución Diaria */}
                <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('roadmap')}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-default cursor-pointer',
                      activeTab === 'roadmap'
                        ? 'bg-[var(--foreground)] text-[var(--background)] shadow-xs'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]'
                    )}
                  >
                    <Target className="h-3.5 w-3.5" />
                    <span>Roadmap de Metas ({totalGoals})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('agenda')}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-default cursor-pointer',
                      activeTab === 'agenda'
                        ? 'bg-[var(--foreground)] text-[var(--background)] shadow-xs'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]'
                    )}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Ejecución en Agenda ({totalAgendaTasks})</span>
                  </button>
                </div>

                {/* CONTENIDO PESTAÑA 1: ROADMAP DE METAS */}
                {activeTab === 'roadmap' && (
                  <div className="space-y-5">
                    
                    {/* Input rápido para crear meta en este roadmap */}
                    <form
                      onSubmit={handleQuickAddGoal}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-xs flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder={`Añadir meta al roadmap de "${selectedProject.name}"...`}
                        value={quickGoalTitle}
                        onChange={(e) => setQuickGoalTitle(e.target.value)}
                        className="flex-1 bg-transparent px-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none"
                      />

                      {/* Selector de estado inicial */}
                      <select
                        value={quickGoalStatus}
                        onChange={(e) => setQuickGoalStatus(e.target.value as ProjectGoalStatus)}
                        className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs text-[var(--foreground)] outline-none cursor-pointer"
                      >
                        <option value="todo">Por empezar</option>
                        <option value="in_progress">En curso</option>
                        <option value="completed">Conseguida</option>
                      </select>

                      {/* Selector de prioridad */}
                      <div className="hidden sm:flex items-center gap-1">
                        {(['baja', 'media', 'alta'] as Priority[]).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setQuickGoalPriority(p)}
                            className={cn(
                              'px-2 py-1 rounded-lg text-[11px] capitalize font-medium transition-default cursor-pointer',
                              quickGoalPriority === p
                                ? 'bg-[var(--foreground)] text-[var(--background)]'
                                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={!quickGoalTitle.trim()}
                        className="flex items-center gap-1.5 rounded-xl bg-[var(--foreground)] px-3.5 py-1.5 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition-default disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Añadir Meta</span>
                      </button>
                    </form>

                    {/* Tablero Kanban / Columnas de Metas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Columna 1: Por empezar */}
                      <GoalColumn
                        title="Por Empezar"
                        status="todo"
                        badgeColor="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20"
                        goals={projectGoals.filter((g) => g.status === 'todo')}
                        tasks={tasks}
                        onEdit={handleOpenEditGoal}
                        onDelete={(id) => deleteGoal(id)}
                        onChangeStatus={(id, s) => updateGoal(id, { status: s })}
                        onSendToToday={handleSendGoalToToday}
                      />

                      {/* Columna 2: En curso */}
                      <GoalColumn
                        title="En Curso"
                        status="in_progress"
                        badgeColor="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        goals={projectGoals.filter((g) => g.status === 'in_progress')}
                        tasks={tasks}
                        onEdit={handleOpenEditGoal}
                        onDelete={(id) => deleteGoal(id)}
                        onChangeStatus={(id, s) => updateGoal(id, { status: s })}
                        onSendToToday={handleSendGoalToToday}
                      />

                      {/* Columna 3: Completadas */}
                      <GoalColumn
                        title="Conseguidas"
                        status="completed"
                        badgeColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        goals={projectGoals.filter((g) => g.status === 'completed')}
                        tasks={tasks}
                        onEdit={handleOpenEditGoal}
                        onDelete={(id) => deleteGoal(id)}
                        onChangeStatus={(id, s) => updateGoal(id, { status: s })}
                        onSendToToday={handleSendGoalToToday}
                      />

                    </div>

                  </div>
                )}

                {/* CONTENIDO PESTAÑA 2: EJECUCIÓN EN AGENDA DIARIA */}
                {activeTab === 'agenda' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Tareas del día a día programadas en la agenda que están vinculadas a este proyecto:
                      </p>
                    </div>

                    {projectAgendaTasks.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted-foreground)] space-y-2">
                        <ListTodo className="h-8 w-8 mx-auto opacity-40" />
                        <p className="text-xs">
                          No hay tareas de agenda diaria asociadas a este proyecto todavía.
                        </p>
                        <p className="text-[11px] opacity-70">
                          Puedes pulsar &quot;⚡ Planificar para hoy&quot; en cualquier meta del Roadmap o crear una tarea desde tu agenda seleccionando este proyecto.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {projectAgendaTasks.map((t) => (
                          <TaskItem
                            key={t.id}
                            task={t}
                            onEdit={(task) => setEditingTask(task)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Crear / Editar Proyecto */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto Personal'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">
                  Nombre del proyecto *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ej: Rediseño Portafolio, Mi Startup, Fitness..."
                  value={formProjectName}
                  onChange={(e) => setFormProjectName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">
                  Descripción (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="¿Cuál es el objetivo o visión de este proyecto?"
                  value={formProjectDesc}
                  onChange={(e) => setFormProjectDesc(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--foreground)] resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
                  Color distintivo
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PROJECT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setFormProjectColor(c.value)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border p-2 text-xs font-medium transition-default cursor-pointer',
                        formProjectColor === c.value
                          ? 'border-[var(--foreground)] bg-[var(--accent)] text-[var(--foreground)] ring-1 ring-[var(--foreground)]/20'
                          : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]'
                      )}
                    >
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: c.value }}
                      />
                      <span className="truncate">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formProjectName.trim()}
                  className="px-4 py-2 text-xs font-semibold bg-[var(--foreground)] text-[var(--background)] rounded-xl hover:opacity-90 transition-default disabled:opacity-40"
                >
                  {editingProject ? 'Guardar Cambios' : 'Crear Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear / Editar Meta del Roadmap */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[var(--foreground)] flex items-center gap-2">
                <Target className="h-4 w-4 text-[var(--foreground)]" />
                <span>{editingGoal ? 'Editar Meta de Roadmap' : 'Nueva Meta de Roadmap'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">
                  Título de la meta *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ej: Desarrollar pasarela de pago, Lanzar MVP..."
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">
                  Descripción o alcance (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre qué define conseguir esta meta..."
                  value={goalDesc}
                  onChange={(e) => setGoalDesc(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--foreground)] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">
                    Estado en Roadmap
                  </label>
                  <select
                    value={goalStatus}
                    onChange={(e) => setGoalStatus(e.target.value as ProjectGoalStatus)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
                  >
                    <option value="todo">Por empezar</option>
                    <option value="in_progress">En curso</option>
                    <option value="completed">Conseguida</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">
                    Prioridad
                  </label>
                  <select
                    value={goalPriority}
                    onChange={(e) => setGoalPriority(e.target.value as Priority)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">
                  Fecha objetivo / Plazo estimado (opcional)
                </label>
                <input
                  type="date"
                  value={goalTargetDate}
                  onChange={(e) => setGoalTargetDate(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!goalTitle.trim()}
                  className="px-4 py-2 text-xs font-semibold bg-[var(--foreground)] text-[var(--background)] rounded-xl hover:opacity-90 transition-default disabled:opacity-40"
                >
                  {editingGoal ? 'Guardar Cambios' : 'Crear Meta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Tarea de Agenda */}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}

// Subcomponente de Columna Kanban de Metas
interface GoalColumnProps {
  title: string;
  status: ProjectGoalStatus;
  badgeColor: string;
  goals: ProjectGoal[];
  tasks: Task[];
  onEdit: (goal: ProjectGoal) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, s: ProjectGoalStatus) => void;
  onSendToToday: (goal: ProjectGoal) => void;
}

function GoalColumn({
  title,
  status,
  badgeColor,
  goals,
  tasks,
  onEdit,
  onDelete,
  onChangeStatus,
  onSendToToday,
}: GoalColumnProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 p-3 space-y-3 min-h-[260px]">
      {/* Cabecera de Columna */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={cn('px-2 py-0.5 rounded-md text-[11px] font-semibold border', badgeColor)}>
            {title}
          </span>
          <span className="text-xs text-[var(--muted-foreground)] font-mono">
            {goals.length}
          </span>
        </div>
      </div>

      {/* Tarjetas de metas */}
      <div className="space-y-2.5 flex-1">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 text-center text-[var(--muted-foreground)] p-4 border border-dashed border-[var(--border)] rounded-xl">
            <span className="text-[11px] opacity-60">Sin metas en esta fase</span>
          </div>
        ) : (
          goals.map((goal) => {
            const linkedDailyTasks = tasks.filter((t) => t.projectGoalId === goal.id);
            const doneDailyTasks = linkedDailyTasks.filter((t) => t.isCompleted).length;

            return (
              <div
                key={goal.id}
                className="group rounded-xl border border-[var(--border)] bg-[var(--background)] p-3.5 shadow-2xs hover:shadow-xs transition-all duration-150 space-y-2.5"
              >
                {/* Cabecera de la tarjeta: Prioridad + Acciones */}
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider',
                      goal.priority === 'alta' && 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
                      goal.priority === 'media' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
                      goal.priority === 'baja' && 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20'
                    )}
                  >
                    {goal.priority}
                  </span>

                  <div className="opacity-0 group-hover:opacity-100 transition-default flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => onEdit(goal)}
                      className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
                      title="Editar meta"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(goal.id)}
                      className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10"
                      title="Eliminar meta"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Título y descripción */}
                <div>
                  <h4 className={cn(
                    'text-xs font-semibold text-[var(--foreground)] leading-snug',
                    goal.status === 'completed' && 'line-through opacity-70'
                  )}>
                    {goal.title}
                  </h4>
                  {goal.description && (
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-1 line-clamp-2 leading-relaxed">
                      {goal.description}
                    </p>
                  )}
                </div>

                {/* Plazo / Fecha estimada si existe */}
                {goal.targetDate && (
                  <div className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)] font-mono">
                    <Clock className="h-3 w-3 opacity-60" />
                    <span>Objetivo: {goal.targetDate}</span>
                  </div>
                )}

                {/* Indicador de subtareas vinculadas en la agenda */}
                {linkedDailyTasks.length > 0 && (
                  <div className="pt-1 border-t border-[var(--border)]/60 flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span>{doneDailyTasks}/{linkedDailyTasks.length} subtareas en agenda</span>
                    </span>
                  </div>
                )}

                {/* Barra de acción inferior: Promover a agenda diaria + mover estado */}
                <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between gap-1">
                  
                  {/* Botón Llevar a Agenda */}
                  <button
                    type="button"
                    onClick={() => onSendToToday(goal)}
                    className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-500/10 px-2 py-1 rounded-lg transition-default cursor-pointer"
                    title="Crear una subtarea en tu agenda de hoy vinculada a esta meta"
                  >
                    <Send className="h-2.5 w-2.5" />
                    <span>Hacer hoy</span>
                  </button>

                  {/* Selector rápido de columna / estado */}
                  <div className="flex items-center gap-0.5">
                    {status !== 'todo' && (
                      <button
                        type="button"
                        onClick={() => onChangeStatus(goal.id, 'todo')}
                        className="px-1.5 py-0.5 text-[9px] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-default"
                        title="Mover a Por Empezar"
                      >
                        ← Todo
                      </button>
                    )}
                    {status !== 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => onChangeStatus(goal.id, 'in_progress')}
                        className="px-1.5 py-0.5 text-[9px] rounded-md text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-default"
                        title="Mover a En Curso"
                      >
                        En curso
                      </button>
                    )}
                    {status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => onChangeStatus(goal.id, 'completed')}
                        className="px-1.5 py-0.5 text-[9px] rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-default"
                        title="Mover a Conseguida"
                      >
                        ✓ Hecha
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
