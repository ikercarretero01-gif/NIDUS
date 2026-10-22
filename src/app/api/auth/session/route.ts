import { NextResponse } from 'next/server';
import { isAuthenticatedServer } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authenticated = await isAuthenticatedServer();
    return NextResponse.json({ authenticated });
  } catch (err) {
    console.error('Error al verificar sesión en /api/auth/session:', err);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
