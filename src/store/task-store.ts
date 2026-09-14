'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task } from '@/types';
import { generateId } from '@/lib/recurrence-engine';
import { DEFAULT_USER_ID } from '@/lib/constants';

import { saveTaskToCloud, deleteTaskFromCloud } from '@/lib/sync-engine';

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
        saveTaskToCloud(newTask);
        return newTask;
      },

      updateTask: (id, updates) => {
        let updatedTask: Task | undefined;
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              updatedTask = { ...task, ...updates, updatedAt: new Date().toISOString() };
              return updatedTask;
            }
            return task;
          }),
        }));
        if (updatedTask) {
          saveTaskToCloud(updatedTask);
        }
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
        deleteTaskFromCloud(id);
      },

      toggleComplete: (id) => {
        let updatedTask: Task | undefined;
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              updatedTask = {
                ...task,
                isCompleted: !task.isCompleted,
                updatedAt: new Date().toISOString(),
              };
              return updatedTask;
            }
            return task;
          }),
        }));
        if (updatedTask) {
          saveTaskToCloud(updatedTask);
        }
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
