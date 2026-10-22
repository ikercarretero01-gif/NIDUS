import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth-server';

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error al cerrar sesión en /api/auth/logout:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
