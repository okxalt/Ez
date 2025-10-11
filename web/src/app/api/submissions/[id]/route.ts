import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const item = await prisma.submission.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

// Update submission status transitions and analytics URL (used by member and admin)
export async function PATCH(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await req.json();
  const { status, analyticsVideoUrl } = body as { status?: string; analyticsVideoUrl?: string };

  const data: Record<string, unknown> = {};
  if (typeof analyticsVideoUrl === 'string') data.analyticsVideoUrl = analyticsVideoUrl;
  if (typeof status === 'string') {
    data.status = status;
    if (status === 'approved') data.approvedAt = new Date();
    if (status !== 'approved') data.approvedAt = null;
  }
  const updated = await prisma.submission.update({ where: { id }, data });
  return NextResponse.json(updated);
}
