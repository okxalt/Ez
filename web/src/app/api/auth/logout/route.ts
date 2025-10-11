import { NextResponse } from 'next/server';

export async function POST() {
  // With NextAuth JWT strategy, client-side signOut should be used.
  return NextResponse.json({ ok: true });
}
