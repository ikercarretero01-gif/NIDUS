'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  CalendarRange,
  FolderKanban,
  Settings,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTaskStore } from '@/store/task-store';
import { useSync } from '@/components/sync-provider';
import { TaskForm } from '@/components/tasks/task-form';
import { format } from 'date-fns';

export function BottomNav() {
  const pathname = usePathname();
  const tasks = useTaskStore((s) => s.tasks);
  const { isConfigured } = useSync();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const highPriorityCount = useMemo(
    () => tasks.filter((t) => t.priority === 'alta' && !t.isCompleted).length,
    [tasks]
  );

  const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  // No mostrar en la landing pública /web
  if (pathname === '/web' || pathname?.startsWith('/web')) {
    return null;
  }

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  };

  const navItems = [
    {
      href: '/today',
      label: 'Hoy',
      icon: CalendarDays,
      badge: highPriorityCount > 0 ? highPriorityCount : null,
    },
    {
      href: '/week',
      label: 'Semana',
      icon: CalendarRange,
    },
    // El botón central (+) va incrustado en el medio
    {
      href: '/projects',
      label: 'Proyectos',
      icon: FolderKanban,
    },
    {
      href: '/settings',
      label: 'Ajustes',
      icon: Settings,
      dot: isConfigured,
    },
  ];

  return (
    <>
      <nav
        aria-label="Navegación móvil"
        className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--background)]/85 backdrop-blur-xl border-t border-[var(--border)] px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] select-none shadow-lg transition-all"
      >
        <div className="flex w-full items-center justify-around max-w-md mx-auto relative">
          {/* Primeros dos items (Hoy, Semana) */}
          {navItems.slice(0, 2).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href + '/'));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={triggerHaptic}
                className={cn(
                  'relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90',
                  isActive
                    ? 'text-[var(--foreground)] font-semibold'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-transform duration-200',
                      isActive ? 'scale-110 text-[var(--foreground)]' : 'opacity-70'
                    )}
                  />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white px-0.5">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 h-0.5 w-4 rounded-full bg-[var(--foreground)]" />
                )}
              </Link>
            );
          })}

          {/* Botón Central (+) Acción Rápida */}
          <div className="relative flex flex-col items-center -top-3">
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                setShowQuickAdd(true);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)] shadow-md active:scale-85 transition-all duration-150 border-2 border-[var(--background)]"
              aria-label="Añadir tarea rápida"
            >
              <Plus className="h-6 w-6 stroke-[2.5]" />
            </button>
            <span className="text-[9px] font-medium text-[var(--muted-foreground)] mt-0.5">
              Crear
            </span>
          </div>

          {/* Últimos dos items (Proyectos, Ajustes) */}
          {navItems.slice(2).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href + '/'));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={triggerHaptic}
                className={cn(
                  'relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90',
                  isActive
                    ? 'text-[var(--foreground)] font-semibold'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-transform duration-200',
                      isActive ? 'scale-110 text-[var(--foreground)]' : 'opacity-70'
                    )}
                  />
                  {item.dot && (
                    <span className="absolute -top-0.5 -right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[var(--background)]" />
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 h-0.5 w-4 rounded-full bg-[var(--foreground)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Modal rápido de creación desde el botón (+) del móvil */}
      {showQuickAdd && (
        <TaskForm date={todayStr} onClose={() => setShowQuickAdd(false)} />
      )}
    </>
  );
}
