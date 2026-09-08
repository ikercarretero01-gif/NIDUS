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
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { TaskItem } from '@/components/tasks/task-item';
import { TaskForm } from '@/components/tasks/task-form';
import { useProjectStore, PROJECT_COLORS } from '@/store/project-store';
import { useTaskStore } from '@/store/task-store';
import { cn } from '@/lib/cn';
import type { Project, Task, Priority } from '@/types';

export default function ProjectsPage() {
  const projects = useProjectStore((s) => s.projects);
  const addProject = useProjectStore((s) => s.addProject);
  const updateProject = useProjectStore((s) => s.updateProject);
  const deleteProject = useProjectStore((s) => s.deleteProject);

  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    return projects[0]?.id || '';
  });

  // Modales
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('all');

  // Formulario de nuevo/editar proyecto
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState(PROJECT_COLORS[0].value);

  // Input rápido de tarea para el proyecto activo
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<Priority>('media');

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0] || null;
  }, [projects, selectedProjectId]);

  // Tareas del proyecto seleccionado
  const projectTasks = useMemo(() => {
    if (!selectedProject) return [];
    return tasks.filter((t) => t.projectId === selectedProject.id);
  }, [tasks, selectedProject]);

  const filteredTasks = useMemo(() => {
    if (filterTab === 'pending') return projectTasks.filter((t) => !t.isCompleted);
    if (filterTab === 'completed') return projectTasks.filter((t) => t.isCompleted);
    return projectTasks;
  }, [projectTasks, filterTab]);

  // Métricas del proyecto seleccionado
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormName('');
    setFormDesc('');
    setFormColor(PROJECT_COLORS[0].value);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setFormName(project.name);
    setFormDesc(project.description || '');
    setFormColor(project.color);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingProject) {
      updateProject(editingProject.id, {
        name: formName.trim(),
        description: formDesc.trim() || undefined,
        color: formColor,
      });
    } else {
      const created = addProject({
        name: formName.trim(),
        description: formDesc.trim() || undefined,
        color: formColor,
      });
      setSelectedProjectId(created.id);
    }

    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el proyecto "${name}"? Las tareas asociadas no se borrarán, solo quedarán sin proyecto.`)) {
      deleteProject(id);
      if (selectedProjectId === id) {
        const remaining = projects.filter((p) => p.id !== id);
        if (remaining.length > 0) {
          setSelectedProjectId(remaining[0].id);
        }
      }
    }
  };

  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !selectedProject) return;

    addTask({
      title: quickTitle.trim(),
      notes: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      isCompleted: false,
      isPersistentReminder: false,
      priority: quickPriority,
      projectId: selectedProject.id,
    });

    setQuickTitle('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Proyectos"
        subtitle="Organiza tus tareas y objetivos agrupados por proyectos personales"
      >
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 rounded-xl bg-[var(--foreground)] px-3.5 py-2 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition-default shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nuevo Proyecto</span>
        </button>
      </Header>

      <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {projects.length === 0 ? (
          /* Estado vacío sin proyectos */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-4 text-[var(--muted-foreground)]">
              <FolderKanban className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">No tienes ningún proyecto</h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-sm mt-1 mb-6">
              Crea tu primer proyecto para agrupar tareas, medir tu progreso y estructurar tus objetivos personales.
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition-default"
            >
              <Plus className="h-4 w-4" />
              <span>Crear mi primer proyecto</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Columna Izquierda: Lista de Proyectos */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Tus Proyectos ({projects.length})
                </span>
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-default flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Añadir</span>
                </button>
              </div>

              <div className="space-y-2">
                {projects.map((proj) => {
                  const projTasks = tasks.filter((t) => t.projectId === proj.id);
                  const pTotal = projTasks.length;
                  const pCompleted = projTasks.filter((t) => t.isCompleted).length;
                  const pProgress = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;
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

                        {/* Botones de edición rápida */}
                        <div className="opacity-0 group-hover:opacity-100 transition-default flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(proj);
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

                      {/* Progreso del proyecto */}
                      <div className="mt-3.5 pl-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                          <span>
                            {pCompleted} de {pTotal} tareas
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Columna Derecha: Detalle y Tareas del Proyecto Seleccionado */}
            {selectedProject && (
              <div className="lg:col-span-8 space-y-6">
                
                {/* Cabecera del Proyecto Seleccionado */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ backgroundColor: selectedProject.color }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
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
                        onClick={() => handleOpenEditModal(selectedProject)}
                        className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-default cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 opacity-70" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(selectedProject.id, selectedProject.name)}
                        className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-default cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>

                  {/* Estadísticas rápidas */}
                  <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-[var(--border)]">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[var(--muted-foreground)]">Total tareas</span>
                      <span className="text-lg font-bold font-mono text-[var(--foreground)]">
                        {totalTasks}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[var(--muted-foreground)]">Pendientes</span>
                      <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                        {pendingTasks}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[var(--muted-foreground)]">Completitud</span>
                      <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Input rápido para añadir tarea a este proyecto */}
                <form
                  onSubmit={handleQuickAddTask}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-xs flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Añadir una tarea a "${selectedProject.name}"...`}
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    className="flex-1 bg-transparent px-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none"
                  />

                  {/* Prioridad rápida */}
                  <div className="flex items-center gap-1">
                    {(['baja', 'media', 'alta'] as Priority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setQuickPriority(p)}
                        className={cn(
                          'px-2 py-1 rounded-lg text-[11px] capitalize font-medium transition-default cursor-pointer',
                          quickPriority === p
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
                    disabled={!quickTitle.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-[var(--foreground)] px-3.5 py-1.5 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition-default disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Añadir</span>
                  </button>
                </form>

                {/* Filtros de tareas y listado */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-xl bg-[var(--card)] border border-[var(--border)] p-1">
                      <button
                        type="button"
                        onClick={() => setFilterTab('all')}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-medium transition-default cursor-pointer',
                          filterTab === 'all'
                            ? 'bg-[var(--foreground)] text-[var(--background)] shadow-xs'
                            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                        )}
                      >
                        Todas ({projectTasks.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterTab('pending')}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-medium transition-default cursor-pointer',
                          filterTab === 'pending'
                            ? 'bg-[var(--foreground)] text-[var(--background)] shadow-xs'
                            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                        )}
                      >
                        Pendientes ({pendingTasks})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterTab('completed')}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-medium transition-default cursor-pointer',
                          filterTab === 'completed'
                            ? 'bg-[var(--foreground)] text-[var(--background)] shadow-xs'
                            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                        )}
                      >
                        Hechas ({completedTasks})
                      </button>
                    </div>
                  </div>

                  {filteredTasks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted-foreground)] space-y-2">
                      <ListTodo className="h-8 w-8 mx-auto opacity-40" />
                      <p className="text-xs">
                        {filterTab === 'completed'
                          ? 'Aún no has completado ninguna tarea en este proyecto.'
                          : filterTab === 'pending'
                          ? '¡No hay tareas pendientes! Todo al día en este proyecto.'
                          : 'No hay tareas asignadas a este proyecto todavía.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredTasks.map((t) => (
                        <TaskItem
                          key={t.id}
                          task={t}
                          onEdit={(task) => setEditingTask(task)}
                        />
                      ))}
                    </div>
                  )}
                </div>

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
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">
                  Descripción (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="¿Cuál es el objetivo o alcance de este proyecto?"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
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
                      onClick={() => setFormColor(c.value)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border p-2 text-xs font-medium transition-default cursor-pointer',
                        formColor === c.value
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
                  disabled={!formName.trim()}
                  className="px-4 py-2 text-xs font-semibold bg-[var(--foreground)] text-[var(--background)] rounded-xl hover:opacity-90 transition-default disabled:opacity-40"
                >
                  {editingProject ? 'Guardar Cambios' : 'Crear Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Tarea */}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
