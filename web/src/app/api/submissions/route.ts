import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const challengeId = searchParams.get('challengeId') || undefined;
  const status = searchParams.get('status') || undefined;
  const mine = searchParams.get('mine') === '1';

  const where: Record<string, unknown> = {};
  if (challengeId) where.challengeId = challengeId;
  if (status) where.status = status;
  if (mine) {
    const session = await getServerSession(authOptions);
    const userId = (session as { user?: { whopUserId?: string } } | null)?.user?.whopUserId;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    where.memberWhopUserId = userId;
  }
  const list = await prisma.submission.findMany({ where, orderBy: { submittedAt: 'desc' } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = (session as { user?: { whopUserId?: string; username?: string } } | null)?.user;
    if (!user?.whopUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { challengeId, originalVideoUrl } = body as { challengeId: string; originalVideoUrl: string };
    if (!challengeId || !originalVideoUrl) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Fetch oEmbed metadata
    const embedRes = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(originalVideoUrl)}`);
    const embed = (await embedRes.json().catch(() => ({}))) as Partial<{ title: string; thumbnail_url: string; provider_name: string }>;
    const videoMetadata: { title?: string; thumbnail_url?: string; provider_name?: string } = {
      title: embed?.title || undefined,
      thumbnail_url: embed?.thumbnail_url || undefined,
      provider_name: embed?.provider_name || undefined,
    };

    // Create submission with status=submitted
    const created = await prisma.submission.create({
      data: {
        challengeId,
        memberWhopUserId: user.whopUserId,
        memberWhopUsername: user.username || 'member',
        originalVideoUrl,
        videoMetadata,
        status: 'submitted',
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
