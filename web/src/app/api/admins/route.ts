import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  // For now, anyone logged in is treated as admin to manage list
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null as never;
}

export async function GET() {
  const admins = await prisma.admin.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(admins);
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });
  const admin = await prisma.admin.upsert({ where: { email }, update: {}, create: { email } });
  return NextResponse.json(admin, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });
  await prisma.admin.delete({ where: { email } });
  return NextResponse.json({ ok: true });
}
