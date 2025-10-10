import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

async function requireAdmin() {
  const session = await getSession();
  if (!session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null as never;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const whopSlug = searchParams.get('whop') || 'default';
  const whop = await prisma.whop.findUnique({ where: { slug: whopSlug } });
  const admins = whop ? await prisma.admin.findMany({ where: { whopId: whop.id }, orderBy: { createdAt: 'desc' } }) : [];
  return NextResponse.json(admins);
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { email, whopSlug = 'default' } = await req.json();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });
  const whop = await prisma.whop.upsert({ where: { slug: whopSlug }, update: {}, create: { slug: whopSlug, name: whopSlug } });
  const admin = await prisma.admin.upsert({ where: { whopId_email: { whopId: whop.id, email } }, update: {}, create: { email, whopId: whop.id } });
  return NextResponse.json(admin, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const whopSlug = searchParams.get('whop') || 'default';
  const whop = await prisma.whop.findUnique({ where: { slug: whopSlug } });
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });
  if (!whop) return NextResponse.json({ error: 'whop not found' }, { status: 404 });
  await prisma.admin.delete({ where: { whopId_email: { whopId: whop.id, email } } });
  return NextResponse.json({ ok: true });
}
