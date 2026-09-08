'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CalendarDays,
  CalendarRange,
  Calendar,
  Repeat,
  FolderKanban,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useUIStore } from '@/store/ui-store';
import { useTaskStore } from '@/store/task-store';

const NAV_ITEMS = [
  { href: '/today', label: 'Agenda diaria', badge: 'Hoy', icon: CalendarDays },
  { href: '/week', label: 'Semana', icon: CalendarRange },
  { href: '/month', label: 'Mes', icon: Calendar },
  { href: '/recurring', label: 'Rutinas', icon: Repeat },
  { href: '/projects', label: 'Proyectos', icon: FolderKanban },
  { href: '/settings', label: 'Ajustes', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const tasks = useTaskStore((s) => s.tasks);

  const highPriorityCount = useMemo(
    () => tasks.filter((t) => t.priority === 'alta' && !t.isCompleted).length,
    [tasks]
  );

  const todayShort = useMemo(
    () => format(new Date(), "EEE, d 'de' MMM", { locale: es }),
    []
  );

  if (pathname === '/web' || pathname?.startsWith('/web')) {
    return null;
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-[var(--border)] bg-[var(--background)] transition-all duration-300 ease-in-out flex flex-col select-none',
        sidebarOpen ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-width-collapsed)]'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4">
        {sidebarOpen ? (
          <div className="flex items-center gap-2.5 animate-fade-in">
            <img
              src="/imagen-n.png"
              alt="Nidus"
              className="h-7 w-7 rounded-lg object-contain"
            />
            <div>
              <h1 className="text-sm font-semibold tracking-tight leading-none text-[var(--foreground)]">
                Nidus
              </h1>
              <span className="text-[10px] text-[var(--muted-foreground)] capitalize">
                {todayShort}
              </span>
            </div>
          </div>
        ) : (
          <img
            src="/imagen-n.png"
            alt="Nidus"
            className="mx-auto h-7 w-7 rounded-lg object-contain"
          />
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-default cursor-pointer',
            !sidebarOpen && 'hidden'
          )}
          aria-label={sidebarOpen ? 'Colapsar sidebar' : 'Expandir sidebar'}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Expand button when collapsed */}
      {!sidebarOpen && (
        <div className="pt-2 px-2 flex justify-center">
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-default cursor-pointer"
            title="Expandir barra lateral"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2.5 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-default cursor-pointer',
                isActive
                  ? 'bg-[var(--accent)] text-[var(--foreground)] font-semibold shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)]/60 hover:text-[var(--foreground)]',
                !sidebarOpen && 'justify-center px-2'
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-default',
                  isActive
                    ? 'text-[var(--foreground)]'
                    : 'text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]'
                )}
              />
              {sidebarOpen && (
                <span className="animate-fade-in flex-1 truncate">
                  {item.label}
                </span>
              )}

              {/* Badge de alta prioridad */}
              {item.href === '/today' && highPriorityCount > 0 && sidebarOpen && (
                <span className="flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 px-1 text-[9px] font-bold">
                  {highPriorityCount}
                </span>
              )}

              {item.href === '/today' && highPriorityCount > 0 && !sidebarOpen && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer: Theme toggle & User mode info */}
      <div className="border-t border-[var(--border)] px-2.5 py-3 space-y-1">
        <button
          onClick={toggleTheme}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-default cursor-pointer',
            !sidebarOpen && 'justify-center px-2'
          )}
          title={!sidebarOpen ? (theme === 'light' ? 'Modo oscuro' : 'Modo claro') : undefined}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 shrink-0 text-indigo-500" />
          ) : (
            <Sun className="h-4 w-4 shrink-0 text-amber-400" />
          )}
          {sidebarOpen && (
            <span className="animate-fade-in">
              {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
