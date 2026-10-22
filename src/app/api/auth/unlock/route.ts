import { NextRequest, NextResponse } from 'next/server';
import { verifyPin, setSessionCookie } from '@/lib/auth-server';

// Registro simple en memoria para limitar intentos fallidos consecutivos
const failedAttemptsMap = new Map<string, { count: number; lockedUntil: number }>();

function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'local-client';
}

export async function POST(req: NextRequest) {
  try {
    const clientId = getClientIdentifier(req);
    const now = Date.now();
    const attempts = failedAttemptsMap.get(clientId);

    if (attempts && attempts.lockedUntil > now) {
      const waitSeconds = Math.ceil((attempts.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Demasiados intentos fallidos. Por favor, espera ${waitSeconds} segundos.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { pin } = body;

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { success: false, error: 'PIN requerido' },
        { status: 400 }
      );
    }

    const isValid = verifyPin(pin);

    if (!isValid) {
      // Incrementar intentos fallidos
      const currentCount = (attempts?.count || 0) + 1;
      let lockedUntil = 0;

      // Bloquear temporalmente tras 5 intentos erróneos consecutivos
      if (currentCount >= 5) {
        lockedUntil = now + 60 * 1000; // 1 minuto de bloqueo
      }

      failedAttemptsMap.set(clientId, { count: currentCount, lockedUntil });

      // Retardo deliberado de 400ms para mitigar ataques por fuerza bruta automatizada
      await new Promise((res) => setTimeout(res, 400));

      return NextResponse.json(
        { success: false, error: 'PIN incorrecto' },
        { status: 401 }
      );
    }

    // PIN correcto: restablecer intentos y crear cookie de sesión HttpOnly
    failedAttemptsMap.delete(clientId);
    await setSessionCookie();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error en /api/auth/unlock:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
