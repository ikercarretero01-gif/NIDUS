import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'nidus_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días

// Obtener el PIN secreto configurado exclusivamente en el servidor
export function getOwnerPin(): string {
  return (
    process.env.APP_PIN ||
    process.env.NIDUS_PIN ||
    process.env.OWNER_PIN ||
    process.env.NEXT_PUBLIC_OWNER_PIN ||
    '0000'
  ).trim();
}

// Obtener el secreto para firmar las sesiones criptográficas
function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    getOwnerPin() + '-nidus-session-salt'
  );
}

/**
 * Compara el PIN de forma segura contra ataques de temporización (timing attacks).
 */
export function verifyPin(inputPin: string): boolean {
  if (typeof inputPin !== 'string' || inputPin.length === 0) {
    return false;
  }

  const expectedPin = getOwnerPin();

  const inputHash = crypto.createHash('sha256').update(inputPin.trim()).digest();
  const expectedHash = crypto.createHash('sha256').update(expectedPin).digest();

  return crypto.timingSafeEqual(inputHash, expectedHash);
}

/**
 * Genera un token firmado HMAC-SHA256 para la sesión del propietario.
 */
export function createSessionToken(): string {
  const secret = getAuthSecret();
  const payload = {
    role: 'owner',
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url');

  return `${payloadStr}.${signature}`;
}

/**
 * Verifica si un token de sesión es válido, no ha caducado y la firma coincide.
 */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadStr, signature] = parts;
  const secret = getAuthSecret();

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url');

  try {
    const isSigValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    if (!isSigValid) return false;

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return payload.role === 'owner';
  } catch {
    return false;
  }
}

/**
 * Verifica la cookie de sesión actual en Next.js App Router (Servidor).
 */
export async function isAuthenticatedServer(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return verifySessionToken(sessionCookie?.value);
}

/**
 * Establece la cookie de sesión autenticada HttpOnly.
 */
export async function setSessionCookie(): Promise<void> {
  const token = createSessionToken();
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Elimina la cookie de sesión para cerrar sesión.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
