'use client';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in w-full min-h-full">
      {children}
    </div>
  );
}
