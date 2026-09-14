'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RecurrenceRule, CompletionRecord } from '@/types';
import { generateId } from '@/lib/recurrence-engine';
import { DEFAULT_USER_ID } from '@/lib/constants';

import {
  saveRecurrenceRuleToCloud,
  deleteRecurrenceRuleFromCloud,
  saveCompletionToCloud,
  deleteCompletionFromCloud,
} from '@/lib/sync-engine';

interface RecurrenceState {
  rules: RecurrenceRule[];
  completions: CompletionRecord[];
  addRule: (rule: Omit<RecurrenceRule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => RecurrenceRule;
  updateRule: (id: string, updates: Partial<RecurrenceRule>) => void;
  deleteRule: (id: string) => void;
  addCompletion: (recurrenceRuleId: string, date: string) => void;
  removeCompletion: (recurrenceRuleId: string, date: string) => void;
  isDateCompleted: (recurrenceRuleId: string, date: string) => boolean;
}

export const useRecurrenceStore = create<RecurrenceState>()(
  persist(
    (set, get) => ({
      rules: [],
      completions: [],

      addRule: (ruleData) => {
        const now = new Date().toISOString();
        const newRule: RecurrenceRule = {
          ...ruleData,
          id: generateId(),
          userId: DEFAULT_USER_ID,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          rules: [...state.rules, newRule],
        }));
        saveRecurrenceRuleToCloud(newRule);
        return newRule;
      },

      updateRule: (id, updates) => {
        let updatedRule: RecurrenceRule | undefined;
        set((state) => ({
          rules: state.rules.map((rule) => {
            if (rule.id === id) {
              updatedRule = { ...rule, ...updates, updatedAt: new Date().toISOString() };
              return updatedRule;
            }
            return rule;
          }),
        }));
        if (updatedRule) {
          saveRecurrenceRuleToCloud(updatedRule);
        }
      },

      deleteRule: (id) => {
        set((state) => ({
          rules: state.rules.filter((rule) => rule.id !== id),
          completions: state.completions.filter(
            (c) => c.recurrenceRuleId !== id
          ),
        }));
        deleteRecurrenceRuleFromCloud(id);
      },

      addCompletion: (recurrenceRuleId, date) => {
        const existing = get().completions.find(
          (c) => c.recurrenceRuleId === recurrenceRuleId && c.date === date
        );
        if (existing) return;

        const completion: CompletionRecord = {
          id: generateId(),
          userId: DEFAULT_USER_ID,
          recurrenceRuleId,
          date,
          completedAt: new Date().toISOString(),
        };
        set((state) => ({
          completions: [...state.completions, completion],
        }));
        saveCompletionToCloud(completion);
      },

      removeCompletion: (recurrenceRuleId, date) => {
        set((state) => ({
          completions: state.completions.filter(
            (c) =>
              !(c.recurrenceRuleId === recurrenceRuleId && c.date === date)
          ),
        }));
        deleteCompletionFromCloud(recurrenceRuleId, date);
      },

      isDateCompleted: (recurrenceRuleId, date) => {
        return get().completions.some(
          (c) => c.recurrenceRuleId === recurrenceRuleId && c.date === date
        );
      },
    }),
    {
      name: 'nidus-recurrence',
    }
  )
);
