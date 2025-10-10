import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const list = await prisma.submission.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, shortVideoUrl, analyticsVideoPath, currentViews } = body;
  if (!username || !shortVideoUrl || !analyticsVideoPath) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const created = await prisma.submission.create({
    data: { username, shortVideoUrl, analyticsVideoPath, currentViews: Number(currentViews) || 0 },
  });
  return NextResponse.json(created, { status: 201 });
}
