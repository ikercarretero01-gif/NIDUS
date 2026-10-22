'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, ProjectGoal } from '@/types';
import { generateId } from '@/lib/recurrence-engine';
import { DEFAULT_USER_ID } from '@/lib/constants';
import {
  saveProjectToCloud,
  deleteProjectFromCloud,
  saveGoalToCloud,
  deleteGoalFromCloud,
} from '@/lib/sync-engine';

export const PROJECT_COLORS = [
  { label: 'Azul', value: '#3b82f6', bgClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' },
  { label: 'Esmeralda', value: '#10b981', bgClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  { label: 'Violeta', value: '#8b5cf6', bgClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' },
  { label: 'Ámbar', value: '#f59e0b', bgClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  { label: 'Rosa', value: '#ec4899', bgClass: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30' },
  { label: 'Cian', value: '#06b6d4', bgClass: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' },
  { label: 'Naranja', value: '#f97316', bgClass: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30' },
  { label: 'Zinc', value: '#71717a', bgClass: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30' },
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-web',
    name: 'Desarrollo Web',
    description: 'Proyectos de software, código y aplicaciones personales.',
    color: '#3b82f6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-health',
    name: 'Salud & Bienestar',
    description: 'Rutinas deportivas, alimentación y descanso.',
    color: '#10b981',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-personal',
    name: 'Proyectos Personales',
    description: 'Objetivos individuales, aprendizaje y metas.',
    color: '#8b5cf6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_GOALS: ProjectGoal[] = [
  {
    id: 'goal-w1',
    projectId: 'proj-web',
    title: 'Finalizar arquitectura de almacenamiento y sincronización',
    description: 'Asegurar consistencia de datos y respuesta offline.',
    status: 'in_progress',
    priority: 'alta',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'goal-w2',
    projectId: 'proj-web',
    title: 'Lanzar y verificar despliegue en producción',
    description: 'Configurar variables de entorno y validar dominio en Vercel.',
    status: 'todo',
    priority: 'media',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'goal-h1',
    projectId: 'proj-health',
    title: 'Establecer rutina de entrenamiento 4 días por semana',
    description: 'Combinar hipertrofia y trabajo cardiovascular continuo.',
    status: 'in_progress',
    priority: 'alta',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'goal-p1',
    projectId: 'proj-personal',
    title: 'Completar 1 libro al mes sobre desarrollo y finanzas',
    description: 'Lectura diaria de 20 minutos antes de dormir.',
    status: 'in_progress',
    priority: 'media',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface ProjectState {
  projects: Project[];
  goals: ProjectGoal[];
  addProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id?: string) => Project | undefined;
  
  // Metas / Roadmap
  addGoal: (goalData: Omit<ProjectGoal, 'id' | 'createdAt' | 'updatedAt'>) => ProjectGoal;
  updateGoal: (id: string, updates: Partial<ProjectGoal>) => void;
  deleteGoal: (id: string) => void;
  getGoalsByProjectId: (projectId: string) => ProjectGoal[];
  getGoalById: (id?: string) => ProjectGoal | undefined;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: DEFAULT_PROJECTS,
      goals: DEFAULT_GOALS,

      addProject: (data) => {
        const now = new Date().toISOString();
        const newProject: Project = {
          ...data,
          id: generateId(),
          userId: DEFAULT_USER_ID,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
        saveProjectToCloud(newProject);
        return newProject;
      },

      updateProject: (id, updates) => {
        let updatedProject: Project | undefined;
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === id) {
              updatedProject = { ...p, ...updates, updatedAt: new Date().toISOString() };
              return updatedProject;
            }
            return p;
          }),
        }));
        if (updatedProject) {
          saveProjectToCloud(updatedProject);
        }
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          goals: state.goals.filter((g) => g.projectId !== id),
        }));
        deleteProjectFromCloud(id);
      },

      getProjectById: (id) => {
        if (!id) return undefined;
        return get().projects.find((p) => p.id === id);
      },

      addGoal: (data) => {
        const now = new Date().toISOString();
        const newGoal: ProjectGoal = {
          ...data,
          id: generateId(),
          userId: DEFAULT_USER_ID,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          goals: [...(state.goals || []), newGoal],
        }));
        saveGoalToCloud(newGoal);
        return newGoal;
      },

      updateGoal: (id, updates) => {
        let updatedGoal: ProjectGoal | undefined;
        set((state) => ({
          goals: (state.goals || []).map((g) => {
            if (g.id === id) {
              updatedGoal = { ...g, ...updates, updatedAt: new Date().toISOString() };
              return updatedGoal;
            }
            return g;
          }),
        }));
        if (updatedGoal) {
          saveGoalToCloud(updatedGoal);
        }
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: (state.goals || []).filter((g) => g.id !== id),
        }));
        deleteGoalFromCloud(id);
      },

      getGoalsByProjectId: (projectId) => {
        return (get().goals || []).filter((g) => g.projectId === projectId);
      },

      getGoalById: (id) => {
        if (!id) return undefined;
        return (get().goals || []).find((g) => g.id === id);
      },
    }),
    {
      name: 'nidus-projects',
    }
  )
);
