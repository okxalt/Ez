import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  const sellerWhopId = (session as { user?: { whopUserId?: string } } | null)?.user?.whopUserId;
  if (!sellerWhopId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const seller = await prisma.seller.findUnique({ where: { whopUserId: sellerWhopId } });
  if (!seller) return NextResponse.json(null);
  const challenge = await prisma.challenge.findFirst({ where: { sellerId: seller.id } });
  return NextResponse.json(challenge);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sellerWhopId = (session as { user?: { whopUserId?: string } } | null)?.user?.whopUserId;
  if (!sellerWhopId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description, minimumViewCount, whopProductId } = await req.json();
  if (!title || !whopProductId || typeof minimumViewCount !== 'number') {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const seller = await prisma.seller.upsert({ where: { whopUserId: sellerWhopId }, update: {}, create: { whopUserId: sellerWhopId } });
  const existing = await prisma.challenge.findFirst({ where: { sellerId: seller.id } });
  let challenge;
  if (existing) {
    challenge = await prisma.challenge.update({ where: { id: existing.id }, data: { title, description, minimumViewCount, whopProductId, isActive: true } });
  } else {
    challenge = await prisma.challenge.create({ data: { sellerId: seller.id, title, description, minimumViewCount, whopProductId, isActive: true } });
  }
  return NextResponse.json(challenge);
}
