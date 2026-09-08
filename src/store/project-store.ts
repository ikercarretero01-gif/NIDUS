'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '@/types';
import { generateId } from '@/lib/recurrence-engine';

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

interface ProjectState {
  projects: Project[];
  addProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id?: string) => Project | undefined;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: DEFAULT_PROJECTS,

      addProject: (data) => {
        const now = new Date().toISOString();
        const newProject: Project = {
          ...data,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
        return newProject;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      getProjectById: (id) => {
        if (!id) return undefined;
        return get().projects.find((p) => p.id === id);
      },
    }),
    {
      name: 'nidus-projects',
    }
  )
);
