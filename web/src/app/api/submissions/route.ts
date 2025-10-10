import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const whopSlug = searchParams.get('whop') || 'default';
  const whop = await prisma.whop.findUnique({ where: { slug: whopSlug } });
  const list = whop ? await prisma.submission.findMany({ where: { whopId: whop.id }, orderBy: { createdAt: 'desc' } }) : [];
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, shortVideoUrl, analyticsVideoPath, currentViews, whopSlug = 'default' } = body;
  if (!username || !shortVideoUrl || !analyticsVideoPath) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const whop = await prisma.whop.upsert({ where: { slug: whopSlug }, update: {}, create: { slug: whopSlug, name: whopSlug } });
  const created = await prisma.submission.create({
    data: { username, shortVideoUrl, analyticsVideoPath, currentViews: Number(currentViews) || 0, whopId: whop.id },
  });
  return NextResponse.json(created, { status: 201 });
}
