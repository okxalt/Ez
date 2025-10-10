import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  const item = await prisma.submission.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  const body = await req.json();
  const { reviewed, currentViews } = body as { reviewed?: boolean; currentViews?: number };
  const updated = await prisma.submission.update({
    where: { id },
    data: {
      reviewed: reviewed ?? undefined,
      reviewedAt: typeof reviewed === 'boolean' ? (reviewed ? new Date() : null) : undefined,
      currentViews: typeof currentViews === 'number' ? currentViews : undefined,
    },
  });
  return NextResponse.json(updated);
}
