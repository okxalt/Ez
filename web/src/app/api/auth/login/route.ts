import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { email, secret } = await req.json();
  if (!email || !secret) return NextResponse.json({ error: 'Missing' }, { status: 400 });

  const expected = process.env.ADMIN_SECRET || 'dev-secret';
  if (secret !== expected) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const session = await getSession();
  session.user = { email };
  await session.save();

  // Ensure admin exists in DB for listing
  await prisma.admin.upsert({ where: { email }, update: {}, create: { email } });
  return NextResponse.json({ ok: true });
}
