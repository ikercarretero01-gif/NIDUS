import React from 'react';
import { NestIsotype } from './nest-isotype';

interface RouteLoadingScreenProps {
  letter: 'D' | 'S' | 'M' | 'R' | 'A' | 'N';
  sectionName: string;
}

export function RouteLoadingScreen({
  letter,
  sectionName,
}: RouteLoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b] select-none">
      {/* Halo de luz ambiental tenue en el fondo */}
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-white/[0.04] blur-3xl" />

      {/* Tarjeta central oscura */}
      <div className="relative z-10 flex flex-col items-center justify-center rounded-3xl border border-zinc-800/90 bg-zinc-900/90 px-10 py-9 shadow-2xl backdrop-blur-md animate-fade-in">
        
        {/* Glow sutil tras el isotipo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 -m-3 rounded-full bg-white/[0.06] blur-xl" />
          <div className="animate-pulse">
            <NestIsotype letter={letter} size={72} />
          </div>
        </div>

        {/* Texto inferior minimalista en fuente monoespaciada */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
          <span>CARGANDO {sectionName}...</span>
        </div>

      </div>
    </div>
  );
}
