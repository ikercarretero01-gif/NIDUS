'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task } from '@/types';
import { generateId } from '@/lib/recurrence-engine';
import { DEFAULT_USER_ID } from '@/lib/constants';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isRecurrenceException'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  getTasksForDate: (date: string) => Task[];
  getTasksForDateRange: (startDate: string, endDate: string) => Task[];
  getPendingPersistentReminders: (today: string) => Task[];
  getHighPriorityPendingCount: () => number;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (taskData) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          userId: DEFAULT_USER_ID,
          isRecurrenceException: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleComplete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  isCompleted: !task.isCompleted,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      getTasksForDate: (date) => {
        return get().tasks.filter((task) => task.date === date);
      },

      getTasksForDateRange: (startDate, endDate) => {
        return get().tasks.filter(
          (task) => task.date >= startDate && task.date <= endDate
        );
      },

      getPendingPersistentReminders: (today) => {
        return get().tasks.filter(
          (task) =>
            task.isPersistentReminder &&
            !task.isCompleted &&
            task.date <= today
        );
      },

      getHighPriorityPendingCount: () => {
        return get().tasks.filter(
          (task) => task.priority === 'alta' && !task.isCompleted
        ).length;
      },
    }),
    {
      name: 'nidus-tasks',
    }
  )
);
