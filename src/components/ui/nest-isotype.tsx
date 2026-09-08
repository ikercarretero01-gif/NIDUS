import React from 'react';

interface NestIsotypeProps {
  letter: 'D' | 'S' | 'M' | 'R' | 'A' | 'N' | string;
  size?: number;
  className?: string;
  glow?: boolean;
}

export function NestIsotype({
  letter,
  size = 64,
  className = '',
  glow = false,
}: NestIsotypeProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30 bg-white"
          style={{ transform: 'scale(1.2)' }}
        />
      )}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 text-white select-none"
      >
        {/* Letra centrada en la parte superior del nido */}
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fontSize="46"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fill="currentColor"
          letterSpacing="-0.03em"
        >
          {letter}
        </text>

        {/* Nido tejido estilo isotipo Nidus */}
        {/* Borde exterior del cuenco / nido */}
        <path
          d="M 16 52 C 16 88, 84 88, 84 52"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Ramas y hebras tejidas del nido */}
        <path
          d="M 18 63 C 34 82, 68 85, 82 66"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M 23 71 C 42 87, 62 83, 78 72"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 26 59 C 48 82, 72 74, 80 58"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 33 76 C 48 87, 66 84, 72 78"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 38 67 C 52 79, 68 76, 75 68"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
