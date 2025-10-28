import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Failed to load session' }, { status: 500 });
  }
}
