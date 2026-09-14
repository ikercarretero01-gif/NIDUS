'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: es });

  return (
    <header className="flex min-h-14 items-center justify-between border-b border-[var(--border)] px-4 sm:px-8 pb-2.5 pt-[max(0.75rem,calc(env(safe-area-inset-top)+0.5rem))] sm:py-2.5 bg-[var(--background)]/85 backdrop-blur-md sticky top-0 z-30 transition-default">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--foreground)] capitalize">
            {title || 'Hoy'}
          </h2>
          {subtitle ? (
            <p className="text-[11px] sm:text-xs text-[var(--muted-foreground)] capitalize">
              {subtitle}
            </p>
          ) : (
            <p className="text-[11px] sm:text-xs text-[var(--muted-foreground)] capitalize">
              {formattedDate}
            </p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {children}
        </div>
      )}
    </header>
  );
}
