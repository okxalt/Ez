import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { email, secret, whopSlug } = await req.json();
  if (!email || !secret) return NextResponse.json({ error: 'Missing' }, { status: 400 });

  const expected = process.env.ADMIN_SECRET || 'dev-secret';
  if (secret !== expected) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const session = await getSession();
  session.user = { email, whopSlug: whopSlug || 'default' };
  await session.save();

  // Ensure admin exists in DB for listing
  const slug = whopSlug || 'default';
  const whop = await prisma.whop.upsert({ where: { slug }, update: {}, create: { slug, name: slug } });
  await prisma.admin.upsert({ where: { whopId_email: { whopId: whop.id, email } }, update: {}, create: { email, whopId: whop.id } });
  return NextResponse.json({ ok: true });
}
