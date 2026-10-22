'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Delete,
  X,
  Lock,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/cn';

interface GatekeeperProps {
  children: React.ReactNode;
}

const DIALPAD_KEYS = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
];

export function Gatekeeper({ children }: GatekeeperProps) {
  const pathname = usePathname();
  const isPublicRoute = pathname === '/web' || pathname?.startsWith('/web');

  const [mounted, setMounted] = useState(false);
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showVisitorInfo, setShowVisitorInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, startTransition] = useTransition();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const errorMessage = useAuthStore((s) => s.errorMessage);
  const unlock = useAuthStore((s) => s.unlock);
  const checkSession = useAuthStore((s) => s.checkSession);

  // Email de contacto configurable para instancias públicas o privadas
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@nidus.app';

  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  };

  // Verificar sesión activa contra el servidor en el montaje
  useEffect(() => {
    setMounted(true);
    checkSession();
  }, [checkSession]);

  const handleDigitPress = useCallback(
    (digit: string) => {
      if (pinDigits.length >= 4 || isError || isSuccess || isSubmitting) return;

      triggerHaptic(12);
      const nextDigits = [...pinDigits, digit];
      setPinDigits(nextDigits);

      if (nextDigits.length === 4) {
        const fullPin = nextDigits.join('');
        startTransition(async () => {
          const res = await unlock(fullPin);

          if (res.success) {
            setIsSuccess(true);
            triggerHaptic([20, 30]);
          } else {
            setIsError(true);
            triggerHaptic([40, 50, 40]);
            setTimeout(() => {
              setPinDigits([]);
              setIsError(false);
            }, 600);
          }
        });
      }
    },
    [pinDigits, isError, isSuccess, isSubmitting, unlock]
  );

  const handleBackspace = useCallback(() => {
    if (pinDigits.length === 0 || isError || isSuccess || isSubmitting) return;
    triggerHaptic(8);
    setPinDigits((prev) => prev.slice(0, -1));
  }, [pinDigits, isError, isSuccess, isSubmitting]);

  const handleClear = useCallback(() => {
    if (isSubmitting) return;
    triggerHaptic(8);
    setPinDigits([]);
    setIsError(false);
  }, [isSubmitting]);

  // Escuchar teclado físico para ordenadores y portátiles
  useEffect(() => {
    const handlePhysicalKeyDown = (e: KeyboardEvent) => {
      if (isAuthenticated || isPublicRoute || isSubmitting) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyDown);
    return () => window.removeEventListener('keydown', handlePhysicalKeyDown);
  }, [isAuthenticated, isPublicRoute, isSubmitting, handleDigitPress, handleBackspace, handleClear]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const encodedEmail = encodeURIComponent(contactEmail);
  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=Solicitud%20de%20acceso%20a%20Nidus&body=Hola,%20me%20gustar%C3%ADa%20solicitar%20acceso%20a%20tu%20instancia%20de%20Nidus.`;
  const mailtoUrl = `mailto:${contactEmail}?subject=Solicitud%20de%20acceso%20a%20Nidus&body=Hola,%20me%20gustar%C3%ADa%20solicitar%20acceso%20a%20tu%20instancia%20de%20Nidus.`;

  // Rutas públicas (/web) o usuario autenticado
  if (isPublicRoute || isAuthenticated) {
    return <>{children}</>;
  }

  // Prevenir parpadeos mientras se inicializa en el cliente
  if (!mounted || isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[var(--background)] text-[var(--foreground)] px-4 pt-[max(2rem,calc(env(safe-area-inset-top)+1rem))] pb-[max(1.5rem,env(safe-area-inset-bottom))] select-none overscroll-none overflow-hidden">
      {/* Luz ambiental de fondo tipo iOS */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-amber-500/10 dark:bg-amber-400/5 blur-3xl" />

      {/* Cabecera / Identidad */}
      <header className="flex flex-col items-center text-center pt-1 sm:pt-4 relative z-10 animate-fade-in">
        <div className="relative mb-3">
          <img
            src="/logo.png"
            alt="Nidus"
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl object-contain shadow-md border border-[var(--border)] bg-[var(--card)]"
          />
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--card)] border border-[var(--border)] text-xs shadow-xs">
            <Lock className="h-3 w-3 text-amber-500" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Nidus
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Introduce tu PIN de propietario
        </p>
      </header>

      {/* Feedback de error o estado de validación */}
      <div className="flex flex-col items-center gap-2 relative z-10 my-auto">
        <div
          className={cn(
            'flex items-center justify-center gap-4 transition-transform duration-200',
            isError && 'animate-shake'
          )}
        >
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pinDigits.length > idx;
            return (
              <div
                key={idx}
                className={cn(
                  'h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border-2 transition-all duration-200',
                  isError
                    ? 'border-red-500 bg-red-500 shadow-sm shadow-red-500/30'
                    : isSuccess
                    ? 'border-emerald-500 bg-emerald-500 scale-125 shadow-sm shadow-emerald-500/30'
                    : isFilled
                    ? 'border-[var(--foreground)] bg-[var(--foreground)] scale-115 shadow-xs'
                    : 'border-[var(--border)] bg-[var(--card)]'
                )}
              />
            );
          })}
        </div>

        {isSubmitting && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] animate-fade-in pt-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Validando sesión segura...</span>
          </div>
        )}

        {errorMessage && !isSubmitting && isError && (
          <div className="flex items-center gap-1.5 text-xs text-red-500 animate-fade-in pt-2">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Teclado numérico nativo incorporado (Numpad) */}
      <div className="w-full max-w-[280px] sm:max-w-[320px] pb-4 relative z-10 animate-fade-in">
        <div className="grid grid-cols-3 gap-3.5 sm:gap-4 place-items-center">
          {DIALPAD_KEYS.map((item) => (
            <button
              key={item.digit}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDigitPress(item.digit)}
              className="h-16 w-16 sm:h-18 sm:w-18 rounded-full border border-[var(--border)]/80 bg-[var(--card)]/90 backdrop-blur-md text-[var(--foreground)] hover:bg-[var(--accent)] active:bg-[var(--foreground)] active:text-[var(--background)] active:scale-90 transition-all duration-150 flex flex-col items-center justify-center cursor-pointer shadow-xs select-none touch-manipulation disabled:opacity-50"
            >
              <span className="text-2xl font-semibold leading-none">{item.digit}</span>
              {item.letters && (
                <span className="text-[9px] font-bold tracking-widest text-[var(--muted-foreground)] opacity-70 mt-0.5">
                  {item.letters}
                </span>
              )}
            </button>
          ))}

          {/* Botón Limpiar */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleClear}
            className="h-16 w-16 sm:h-18 sm:w-18 rounded-full text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] active:scale-90 transition-all duration-150 flex items-center justify-center cursor-pointer select-none disabled:opacity-50"
          >
            {pinDigits.length > 0 ? 'Limpiar' : ''}
          </button>

          {/* Dígito 0 */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleDigitPress('0')}
            className="h-16 w-16 sm:h-18 sm:w-18 rounded-full border border-[var(--border)]/80 bg-[var(--card)]/90 backdrop-blur-md text-[var(--foreground)] hover:bg-[var(--accent)] active:bg-[var(--foreground)] active:text-[var(--background)] active:scale-90 transition-all duration-150 flex flex-col items-center justify-center cursor-pointer shadow-xs select-none touch-manipulation disabled:opacity-50"
          >
            <span className="text-2xl font-semibold leading-none">0</span>
          </button>

          {/* Botón Borrar (Backspace) */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleBackspace}
            aria-label="Borrar último dígito"
            className="h-16 w-16 sm:h-18 sm:w-18 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] active:scale-90 transition-all duration-150 flex items-center justify-center cursor-pointer select-none disabled:opacity-50"
          >
            {pinDigits.length > 0 && <Delete className="h-6 w-6 stroke-[1.8]" />}
          </button>
        </div>

        {/* Acceso para visitantes / Solicitud de invitación */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowVisitorInfo(true)}
            className="text-[11px] font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors py-1.5 px-3 rounded-full hover:bg-[var(--accent)] cursor-pointer"
          >
            ¿No eres el propietario? Solicitar acceso
          </button>
        </div>
      </div>

      {/* Modal inferior para visitantes (Bottom Sheet) */}
      {showVisitorInfo && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in p-0 sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-2xl space-y-4 animate-fade-in">
            {/* Barra de agarre para móvil */}
            <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700 sm:hidden mb-1" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <Mail className="h-4 w-4 text-amber-500" />
                <span>Solicitar acceso a Nidus</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVisitorInfo(false)}
                className="h-7 w-7 rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Esta instancia de Nidus está protegida para su propietario. Para solicitar una invitación o credenciales, envía un correo a:
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] font-mono text-xs">
              <span className="truncate pr-2">{contactEmail}</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-1 text-xs font-sans text-amber-600 dark:text-amber-400 cursor-pointer shrink-0"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={mailtoUrl}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-xs font-semibold text-[var(--background)] hover:opacity-90"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Enviar email</span>
              </a>
              <a
                href={gmailWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--accent)]"
              >
                <span>Gmail</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
