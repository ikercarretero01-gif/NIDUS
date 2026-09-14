'use client';

import { supabase } from './supabase';
import type {
  Task,
  Project,
  ProjectGoal,
  RecurrenceRule,
  CompletionRecord,
} from '@/types';
import { useTaskStore } from '@/store/task-store';
import { useProjectStore } from '@/store/project-store';
import { useRecurrenceStore } from '@/store/recurrence-store';

// ==============================================================================
// Mappers: TypeScript Models <-> Supabase DB Columns
// ==============================================================================

export function taskToDb(task: Task) {
  return {
    id: task.id,
    user_id: task.userId || 'local-user',
    title: task.title,
    notes: task.notes || '',
    date: task.date,
    time: task.time || null,
    is_completed: Boolean(task.isCompleted),
    is_persistent_reminder: Boolean(task.isPersistentReminder),
    priority: task.priority || 'media',
    tag: task.tag || null,
    project_id: task.projectId || null,
    project_goal_id: task.projectGoalId || null,
    recurrence_rule_id: task.recurrenceRuleId || null,
    is_recurrence_exception: Boolean(task.isRecurrenceException),
    created_at: task.createdAt,
    updated_at: task.updatedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToTask(row: any): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    notes: row.notes || '',
    date: row.date,
    time: row.time || undefined,
    isCompleted: Boolean(row.is_completed),
    isPersistentReminder: Boolean(row.is_persistent_reminder),
    priority: row.priority || 'media',
    tag: row.tag || undefined,
    projectId: row.project_id || undefined,
    projectGoalId: row.project_goal_id || undefined,
    recurrenceRuleId: row.recurrence_rule_id || undefined,
    isRecurrenceException: Boolean(row.is_recurrence_exception),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function projectToDb(p: Project) {
  return {
    id: p.id,
    name: p.name,
    description: p.description || '',
    color: p.color,
    icon: p.icon || null,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    color: row.color,
    icon: row.icon || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function goalToDb(g: ProjectGoal) {
  return {
    id: g.id,
    project_id: g.projectId,
    title: g.title,
    description: g.description || '',
    status: g.status,
    priority: g.priority,
    target_date: g.targetDate || null,
    created_at: g.createdAt,
    updated_at: g.updatedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToGoal(row: any): ProjectGoal {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description || '',
    status: row.status,
    priority: row.priority,
    targetDate: row.target_date || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function recurrenceRuleToDb(r: RecurrenceRule) {
  return {
    id: r.id,
    user_id: r.userId || 'local-user',
    task_template: r.taskTemplate,
    frequency: r.frequency,
    interval: r.interval,
    days_of_week: r.daysOfWeek || null,
    day_of_month: r.dayOfMonth || null,
    start_date: r.startDate,
    end_date: r.endDate || null,
    count: r.count || null,
    created_at: r.createdAt,
    updated_at: r.updatedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToRecurrenceRule(row: any): RecurrenceRule {
  return {
    id: row.id,
    userId: row.user_id,
    taskTemplate: row.task_template,
    frequency: row.frequency,
    interval: row.interval,
    daysOfWeek: row.days_of_week || undefined,
    dayOfMonth: row.day_of_month || undefined,
    startDate: row.start_date,
    endDate: row.end_date || undefined,
    count: row.count || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function completionToDb(c: CompletionRecord) {
  return {
    id: c.id,
    user_id: c.userId || 'local-user',
    recurrence_rule_id: c.recurrenceRuleId,
    date: c.date,
    completed_at: c.completedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToCompletion(row: any): CompletionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    recurrenceRuleId: row.recurrence_rule_id,
    date: row.date,
    completedAt: row.completed_at,
  };
}

// ==============================================================================
// Cloud Operations: Helpers directos a Supabase
// ==============================================================================

export async function saveTaskToCloud(task: Task) {
  if (!supabase) return;
  try {
    await supabase.from('tasks').upsert(taskToDb(task));
  } catch (err) {
    console.error('Error al guardar tarea en Supabase:', err);
  }
}

export async function deleteTaskFromCloud(id: string) {
  if (!supabase) return;
  try {
    await supabase.from('tasks').delete().eq('id', id);
  } catch (err) {
    console.error('Error al eliminar tarea en Supabase:', err);
  }
}

export async function saveProjectToCloud(project: Project) {
  if (!supabase) return;
  try {
    await supabase.from('projects').upsert(projectToDb(project));
  } catch (err) {
    console.error('Error al guardar proyecto en Supabase:', err);
  }
}

export async function deleteProjectFromCloud(id: string) {
  if (!supabase) return;
  try {
    await supabase.from('projects').delete().eq('id', id);
  } catch (err) {
    console.error('Error al eliminar proyecto en Supabase:', err);
  }
}

export async function saveGoalToCloud(goal: ProjectGoal) {
  if (!supabase) return;
  try {
    await supabase.from('project_goals').upsert(goalToDb(goal));
  } catch (err) {
    console.error('Error al guardar meta en Supabase:', err);
  }
}

export async function deleteGoalFromCloud(id: string) {
  if (!supabase) return;
  try {
    await supabase.from('project_goals').delete().eq('id', id);
  } catch (err) {
    console.error('Error al eliminar meta en Supabase:', err);
  }
}

export async function saveRecurrenceRuleToCloud(rule: RecurrenceRule) {
  if (!supabase) return;
  try {
    await supabase.from('recurrence_rules').upsert(recurrenceRuleToDb(rule));
  } catch (err) {
    console.error('Error al guardar regla recurrente en Supabase:', err);
  }
}

export async function deleteRecurrenceRuleFromCloud(id: string) {
  if (!supabase) return;
  try {
    await supabase.from('recurrence_rules').delete().eq('id', id);
  } catch (err) {
    console.error('Error al eliminar regla recurrente en Supabase:', err);
  }
}

export async function saveCompletionToCloud(completion: CompletionRecord) {
  if (!supabase) return;
  try {
    await supabase.from('recurrence_completions').upsert(completionToDb(completion));
  } catch (err) {
    console.error('Error al guardar completado en Supabase:', err);
  }
}

export async function deleteCompletionFromCloud(recurrenceRuleId: string, date: string) {
  if (!supabase) return;
  try {
    await supabase
      .from('recurrence_completions')
      .delete()
      .eq('recurrence_rule_id', recurrenceRuleId)
      .eq('date', date);
  } catch (err) {
    console.error('Error al eliminar completado en Supabase:', err);
  }
}

// ==============================================================================
// Migración y Sincronización Inicial
// ==============================================================================

export async function pushLocalDataToCloud() {
  if (!supabase) return;

  const currentTasks = useTaskStore.getState().tasks;
  const currentProjects = useProjectStore.getState().projects;
  const currentGoals = useProjectStore.getState().goals;
  const currentRules = useRecurrenceStore.getState().rules;
  const currentCompletions = useRecurrenceStore.getState().completions;

  if (currentProjects.length > 0) {
    await supabase.from('projects').upsert(currentProjects.map(projectToDb));
  }
  if (currentGoals.length > 0) {
    await supabase.from('project_goals').upsert(currentGoals.map(goalToDb));
  }
  if (currentTasks.length > 0) {
    await supabase.from('tasks').upsert(currentTasks.map(taskToDb));
  }
  if (currentRules.length > 0) {
    await supabase.from('recurrence_rules').upsert(currentRules.map(recurrenceRuleToDb));
  }
  if (currentCompletions.length > 0) {
    await supabase.from('recurrence_completions').upsert(currentCompletions.map(completionToDb));
  }
}

export async function syncAllFromCloud(): Promise<boolean> {
  if (!supabase) return false;

  try {
    // 1. Obtener datos de Supabase
    const [
      { data: dbProjects, error: errProjects },
      { data: dbGoals, error: errGoals },
      { data: dbTasks, error: errTasks },
      { data: dbRules, error: errRules },
      { data: dbCompletions, error: errCompletions },
    ] = await Promise.all([
      supabase.from('projects').select('*'),
      supabase.from('project_goals').select('*'),
      supabase.from('tasks').select('*'),
      supabase.from('recurrence_rules').select('*'),
      supabase.from('recurrence_completions').select('*'),
    ]);

    if (errProjects || errGoals || errTasks || errRules || errCompletions) {
      console.warn('Alerta al consultar tablas en Supabase. Asegúrate de haber ejecutado schema.sql.');
      return false;
    }

    const hasCloudData =
      (dbProjects && dbProjects.length > 0) ||
      (dbTasks && dbTasks.length > 0) ||
      (dbRules && dbRules.length > 0);

    const localTasks = useTaskStore.getState().tasks;
    const localProjects = useProjectStore.getState().projects;

    // 2. Si la nube está completamente vacía pero tenemos datos locales en el portátil,
    // subimos los datos locales automáticamente para no perder nada.
    if (!hasCloudData && (localTasks.length > 0 || localProjects.length > 0)) {
      console.log('Migrando datos locales de NIDUS hacia Supabase...');
      await pushLocalDataToCloud();
      return true;
    }

    // 3. Poblar Zustand con lo que hay en la nube
    if (dbProjects) {
      useProjectStore.setState({
        projects: dbProjects.map(dbToProject),
      });
    }

    if (dbGoals) {
      useProjectStore.setState({
        goals: dbGoals.map(dbToGoal),
      });
    }

    if (dbTasks) {
      useTaskStore.setState({
        tasks: dbTasks.map(dbToTask),
      });
    }

    if (dbRules) {
      useRecurrenceStore.setState({
        rules: dbRules.map(dbToRecurrenceRule),
      });
    }

    if (dbCompletions) {
      useRecurrenceStore.setState({
        completions: dbCompletions.map(dbToCompletion),
      });
    }

    return true;
  } catch (err) {
    console.error('Error durante la sincronización con Supabase:', err);
    return false;
  }
}

// ==============================================================================
// Realtime: Suscripción a cambios en vivo (móvil <-> portátil)
// ==============================================================================

export function initRealtimeSubscription() {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('nidus-realtime-sync')
    // Tareas
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tasks' },
      (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        if (eventType === 'INSERT' || eventType === 'UPDATE') {
          const task = dbToTask(newRow);
          useTaskStore.setState((state) => {
            const exists = state.tasks.some((t) => t.id === task.id);
            if (exists) {
              return {
                tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
              };
            }
            return { tasks: [...state.tasks, task] };
          });
        } else if (eventType === 'DELETE') {
          useTaskStore.setState((state) => ({
            tasks: state.tasks.filter((t) => t.id !== (oldRow as { id?: string })?.id),
          }));
        }
      }
    )
    // Proyectos
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'projects' },
      (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        if (eventType === 'INSERT' || eventType === 'UPDATE') {
          const project = dbToProject(newRow);
          useProjectStore.setState((state) => {
            const exists = state.projects.some((p) => p.id === project.id);
            if (exists) {
              return {
                projects: state.projects.map((p) => (p.id === project.id ? project : p)),
              };
            }
            return { projects: [...state.projects, project] };
          });
        } else if (eventType === 'DELETE') {
          useProjectStore.setState((state) => ({
            projects: state.projects.filter((p) => p.id !== (oldRow as { id?: string })?.id),
          }));
        }
      }
    )
    // Metas de Proyectos
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'project_goals' },
      (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        if (eventType === 'INSERT' || eventType === 'UPDATE') {
          const goal = dbToGoal(newRow);
          useProjectStore.setState((state) => {
            const exists = (state.goals || []).some((g) => g.id === goal.id);
            if (exists) {
              return {
                goals: state.goals.map((g) => (g.id === goal.id ? goal : g)),
              };
            }
            return { goals: [...(state.goals || []), goal] };
          });
        } else if (eventType === 'DELETE') {
          useProjectStore.setState((state) => ({
            goals: (state.goals || []).filter((g) => g.id !== (oldRow as { id?: string })?.id),
          }));
        }
      }
    )
    // Reglas recurrentes
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'recurrence_rules' },
      (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        if (eventType === 'INSERT' || eventType === 'UPDATE') {
          const rule = dbToRecurrenceRule(newRow);
          useRecurrenceStore.setState((state) => {
            const exists = state.rules.some((r) => r.id === rule.id);
            if (exists) {
              return {
                rules: state.rules.map((r) => (r.id === rule.id ? rule : r)),
              };
            }
            return { rules: [...state.rules, rule] };
          });
        } else if (eventType === 'DELETE') {
          useRecurrenceStore.setState((state) => ({
            rules: state.rules.filter((r) => r.id !== (oldRow as { id?: string })?.id),
          }));
        }
      }
    )
    // Completados
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'recurrence_completions' },
      (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        if (eventType === 'INSERT') {
          const comp = dbToCompletion(newRow);
          useRecurrenceStore.setState((state) => {
            const exists = state.completions.some(
              (c) => c.recurrenceRuleId === comp.recurrenceRuleId && c.date === comp.date
            );
            if (exists) return state;
            return { completions: [...state.completions, comp] };
          });
        } else if (eventType === 'DELETE') {
          const oldComp = oldRow as { recurrence_rule_id?: string; date?: string; id?: string };
          useRecurrenceStore.setState((state) => ({
            completions: state.completions.filter((c) => {
              if (oldComp?.id && c.id === oldComp.id) return false;
              if (oldComp?.recurrence_rule_id && oldComp?.date) {
                return !(c.recurrenceRuleId === oldComp.recurrence_rule_id && c.date === oldComp.date);
              }
              return true;
            }),
          }));
        }
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}
