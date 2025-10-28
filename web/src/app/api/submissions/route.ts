import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const challengeId = searchParams.get('challengeId');
    const mine = searchParams.get('mine');
    const memberWhopUserId = searchParams.get('memberWhopUserId');

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }
    if (challengeId) {
      where.challengeId = challengeId;
    }
    if (memberWhopUserId) {
      where.memberWhopUserId = memberWhopUserId;
    }
    if (mine === 'true') {
      const session = await getSession();
      if (!session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      // Use username as member identifier for now
      where.memberWhopUserId = session.user.id;
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        challenge: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeId, memberWhopUserId, memberWhopUsername, originalVideoUrl, videoMetadata } = body;

    // Validate required fields
    if (!challengeId || !memberWhopUserId || !memberWhopUsername || !originalVideoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if challenge exists and is active
    const challenge = await prisma.challenge.findFirst({
      where: {
        id: challengeId,
        isActive: true,
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found or inactive' },
        { status: 404 }
      );
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        challengeId,
        memberWhopUserId,
        memberWhopUsername,
        originalVideoUrl,
        videoMetadata: videoMetadata || null,
        status: 'SUBMITTED',
      },
      include: {
        challenge: true,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}