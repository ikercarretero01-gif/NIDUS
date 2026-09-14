'use client';

import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/cn';

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const isPublicRoute = pathname === '/web' || pathname?.startsWith('/web');

  if (isPublicRoute) {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  return (
    <main
      className={cn(
        'flex-1 transition-all duration-300 ease-in-out min-h-screen pb-20 md:pb-0 ml-0',
        sidebarOpen
          ? 'md:ml-[var(--sidebar-width)]'
          : 'md:ml-[var(--sidebar-width-collapsed)]'
      )}
    >
      {children}
    </main>
  );
}
