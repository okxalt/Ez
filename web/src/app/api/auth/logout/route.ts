import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(_request: NextRequest) {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
