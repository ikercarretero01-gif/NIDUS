'use client';

import { useState } from 'react';
import { Download, Upload, Moon, Sun, Trash2, Lock, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useUIStore } from '@/store/ui-store';
import { useTaskStore } from '@/store/task-store';
import { useRecurrenceStore } from '@/store/recurrence-store';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/cn';

export default function SettingsPage() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const tasks = useTaskStore((s) => s.tasks);
  const rules = useRecurrenceStore((s) => s.rules);
  const completions = useRecurrenceStore((s) => s.completions);
  const lock = useAuthStore((s) => s.lock);

  const [showDangerConfirm, setShowDangerConfirm] = useState(false);

  const handleExport = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks,
      rules,
      completions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nidus-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.tasks) {
          useTaskStore.setState({ tasks: data.tasks });
        }
        if (data.rules) {
          useRecurrenceStore.setState({
            rules: data.rules,
            completions: data.completions || [],
          });
        }
        alert('Datos importados correctamente');
      } catch {
        alert('Error al importar el archivo');
      }
    };
    input.click();
  };

  const handleClearAll = () => {
    useTaskStore.setState({ tasks: [] });
    useRecurrenceStore.setState({ rules: [], completions: [] });
    setShowDangerConfirm(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Ajustes" subtitle="Configuración de la aplicación" />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 py-8 space-y-8">

          {/* Brand Info con logo oficial */}
          <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
            <img
              src="/logo.png"
              alt="Nidus Logo"
              className="h-12 w-12 rounded-xl object-contain shadow-xs"
            />
            <div>
              <h2 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
                Nidus
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Agenda y gestión de tareas
              </p>
            </div>
          </div>

          {/* Apariencia */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              Apariencia
            </h3>
            <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  {theme === 'light' ? (
                    <Sun className="h-4 w-4 text-[var(--muted-foreground)]" />
                  ) : (
                    <Moon className="h-4 w-4 text-[var(--muted-foreground)]" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Tema</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {theme === 'light' ? 'Claro' : 'Oscuro'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-default',
                    theme === 'dark'
                      ? 'bg-[var(--foreground)]'
                      : 'bg-[var(--border)]'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200',
                      theme === 'dark' ? 'left-[22px]' : 'left-0.5'
                    )}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Seguridad y Privacidad */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              Seguridad y Privacidad
            </h3>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Propietario autenticado
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      PIN activo: •••• (9891)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={lock}
                  className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--border)] transition-default cursor-pointer"
                  title="Bloquear sesión y volver a la pantalla de acceso"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Bloquear Nidus</span>
                </button>
              </div>
            </div>
          </section>

          {/* Estadísticas */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              Estadísticas
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-[var(--border)] p-4 text-center">
                <p className="text-2xl font-bold">{tasks.length}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Tareas</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] p-4 text-center">
                <p className="text-2xl font-bold">{tasks.filter(t => t.isCompleted).length}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Completadas</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] p-4 text-center">
                <p className="text-2xl font-bold">{rules.length}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Recurrentes</p>
              </div>
            </div>
          </section>

          {/* Datos */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              Datos
            </h3>
            <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
              <button
                onClick={handleExport}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[var(--accent)] transition-default"
              >
                <Download className="h-4 w-4 text-[var(--muted-foreground)]" />
                <div>
                  <p className="font-medium">Exportar datos</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Descargar backup en formato JSON
                  </p>
                </div>
              </button>
              <button
                onClick={handleImport}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[var(--accent)] transition-default"
              >
                <Upload className="h-4 w-4 text-[var(--muted-foreground)]" />
                <div>
                  <p className="font-medium">Importar datos</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Restaurar desde un archivo JSON
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* Zona de peligro */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-4">
              Zona de peligro
            </h3>
            <div className="rounded-xl border border-red-200 dark:border-red-900">
              {!showDangerConfirm ? (
                <button
                  onClick={() => setShowDangerConfirm(true)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-left hover:bg-red-50 dark:hover:bg-red-950 transition-default rounded-xl"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="font-medium text-red-600 dark:text-red-400">
                      Borrar todos los datos
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Esta acción no se puede deshacer
                    </p>
                  </div>
                </button>
              ) : (
                <div className="p-4 space-y-3">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    ¿Estás seguro? Se eliminarán todas las tareas, reglas y registros.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearAll}
                      className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-default"
                    >
                      Sí, borrar todo
                    </button>
                    <button
                      onClick={() => setShowDangerConfirm(false)}
                      className="rounded-lg border border-[var(--border)] px-4 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-default"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Version info */}
          <div className="text-center text-xs text-[var(--muted-foreground)] pt-4">
            <p>Nidus v0.1.0</p>
            <p className="mt-0.5">Datos almacenados localmente</p>
          </div>
        </div>
      </div>
    </div>
  );
}
