'use client';

import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/cn';

export function MainContent({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <main
      className={cn(
        'flex-1 transition-all duration-300 ease-in-out min-h-screen',
        sidebarOpen
          ? 'ml-[var(--sidebar-width)]'
          : 'ml-[var(--sidebar-width-collapsed)]'
      )}
    >
      {children}
    </main>
  );
}
