'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  KeyRound,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/cn';

interface GatekeeperProps {
  children: React.ReactNode;
}

export function Gatekeeper({ children }: GatekeeperProps) {
  const pathname = usePathname();
  const isPublicRoute = pathname === '/web' || pathname?.startsWith('/web');

  const [mounted, setMounted] = useState(false);
  const [isClientAuth, setIsClientAuth] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nidus-auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.state?.isAuthenticated === true;
        }
      } catch {}
    }
    return false;
  });

  const [showPinInput, setShowPinInput] = useState(false);
  const [digits, setDigits] = useState(['', '', '', '']);
  const [isError, setIsError] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const storeAuth = useAuthStore((s) => s.isAuthenticated);
  const isAuthenticated = isClientAuth || storeAuth;
  const unlock = useAuthStore((s) => s.unlock);

  useEffect(() => {
    setMounted(true);
    if (storeAuth) {
      setIsClientAuth(true);
    }
  }, [storeAuth]);

  // Autofocus al primer dígito cuando se muestra el input de PIN
  useEffect(() => {
    if (showPinInput && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPinInput]);

  const handleDigitChange = (index: number, value: string) => {
    // Tomar solo el último carácter numérico ingresado
    const cleanChar = value.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = cleanChar;
    setDigits(newDigits);
    setIsError(false);

    // Si escribió un dígito y no es el último, avanzar automáticamente al siguiente
    if (cleanChar && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Si ya se tienen los 4 dígitos, VALIDAR INMEDIATAMENTE sin botón OK
    const fullPin = newDigits.join('');
    if (fullPin.length === 4 && newDigits.every((d) => d !== '')) {
      const success = unlock(fullPin);
      if (!success) {
        setIsError(true);
        // Sacudida de error y limpiar dígitos
        setTimeout(() => {
          setDigits(['', '', '', '']);
          inputRefs[0].current?.focus();
        }, 500);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Retroceder al anterior si el actual ya está vacío
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pastedData) return;

    const newDigits = ['', '', '', ''];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setDigits(newDigits);

    if (pastedData.length === 4) {
      const success = unlock(pastedData);
      if (!success) {
        setIsError(true);
        setTimeout(() => {
          setDigits(['', '', '', '']);
          inputRefs[0].current?.focus();
        }, 500);
      }
    } else {
      inputRefs[Math.min(pastedData.length, 3)].current?.focus();
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ikercarretero01@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const gmailWebUrl =
    'https://mail.google.com/mail/?view=cm&fs=1&to=ikercarretero01@gmail.com&su=Solicitud%20de%20acceso%20a%20Nidus&body=Hola%20Iker,%20me%20gustar%C3%ADa%20solicitar%20acceso%20a%20tu%20instancia%20privada%20de%20Nidus.';

  const mailtoUrl =
    'mailto:ikercarretero01@gmail.com?subject=Solicitud%20de%20acceso%20a%20Nidus&body=Hola%20Iker,%20me%20gustar%C3%ADa%20solicitar%20acceso%20a%20tu%20instancia%20privada%20de%20Nidus.';

  // Si es ruta pública (/web) o está autenticado, renderizar sin pantalla de bloqueo
  if (isPublicRoute || isAuthenticated) {
    return <>{children}</>;
  }

  // Mientras se hidrata para visitantes no autenticados
  if (!mounted) {
    return null;
  }

  // Pantalla de bloqueo para visitantes y acceso propietario
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--background)] px-4 py-12 text-[var(--foreground)] selection:bg-zinc-800 selection:text-white relative overflow-hidden">
      {/* Luz ambiental sutil de fondo */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="w-full max-w-md space-y-6 text-center animate-fade-in relative z-10">
        
        {/* Logotipo oficial */}
        <div className="mx-auto flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <img
              src="/logo.png"
              alt="Nidus"
              className="h-16 w-16 rounded-2xl object-contain shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--card)] border border-[var(--border)] text-[10px] shadow-xs">
              🔒
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <ShieldAlert className="h-3.5 w-3.5" />
            Espacio privado de Iker Carretero
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Nidus
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted-foreground)] max-w-sm mx-auto">
            Esta instancia de Nidus es personal y exclusiva para su propietario. Si deseas acceder o colaborar en el proyecto, solicita acceso directamente.
          </p>
        </div>

        {/* Tarjeta de Solicitud de Acceso */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-3.5 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)]">
            <Mail className="h-4 w-4 text-amber-500" />
            <span>Solicitar acceso a ikercarretero</span>
          </div>

          <p className="text-xs text-[var(--muted-foreground)]">
            Envía un correo a <strong className="text-[var(--foreground)] font-mono">ikercarretero01@gmail.com</strong> para solicitar tu invitación o credenciales.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            {/* Abrir cliente de correo o Gmail */}
            <a
              href={mailtoUrl}
              className="flex-1 w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition-default shadow-xs"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Enviar solicitud</span>
            </a>

            <a
              href={gmailWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-default"
              title="Abrir directamente en Gmail Web"
            >
              <span>Gmail Web</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-default cursor-pointer"
              title="Copiar dirección de email"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 opacity-60" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sección de Acceso Propietario (Iker) */}
        <div className="pt-2">
          {!showPinInput ? (
            <button
              type="button"
              onClick={() => setShowPinInput(true)}
              className="inline-flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-default cursor-pointer py-1 px-3 rounded-lg hover:bg-[var(--accent)]"
            >
              <KeyRound className="h-3.5 w-3.5 opacity-70" />
              <span>Soy Iker (Acceso propietario con PIN)</span>
            </button>
          ) : (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-[var(--foreground)]" />
                  <h3 className="text-xs font-semibold text-[var(--foreground)]">
                    Introduce tu PIN de propietario
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPinInput(false)}
                  className="text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  Ocultar
                </button>
              </div>

              {/* 4 dígitos con auto-validación inmediata sin botón OK */}
              <div
                onPaste={handlePaste}
                className={cn(
                  'flex items-center justify-center gap-3 transition-default',
                  isError && 'animate-shake'
                )}
              >
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digits[idx]}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={cn(
                      'h-12 w-12 rounded-xl border text-center font-mono text-xl font-bold transition-all duration-150 outline-none shadow-xs',
                      isError
                        ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
                        : digits[idx]
                        ? 'border-[var(--foreground)] bg-[var(--accent)] text-[var(--foreground)]'
                        : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--foreground)] focus:ring-2 focus:ring-zinc-400/20'
                    )}
                  />
                ))}
              </div>

              {isError && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400 animate-fade-in">
                  PIN incorrecto. Inténtalo de nuevo.
                </p>
              )}

              <p className="text-[11px] text-[var(--muted-foreground)]">
                La validación se realiza automáticamente al teclear los 4 dígitos.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-[var(--muted-foreground)]/60 pt-4">
          Nidus &copy; {new Date().getFullYear()} · Reservado para Iker Carretero
        </p>

      </div>
    </div>
  );
}
