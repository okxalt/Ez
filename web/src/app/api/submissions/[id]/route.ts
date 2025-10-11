import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const submission = await prisma.submission.findUnique({
      where: {
        id,
      },
      include: {
        challenge: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { status, analyticsVideoUrl } = body;

    // Validate status if provided
    const validStatuses = ['SUBMITTED', 'AWAITING_ANALYTICS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const { id } = await context.params;
    const updateData: Record<string, unknown> = {};
    if (status) {
      updateData.status = status;
    }
    if (analyticsVideoUrl) {
      updateData.analyticsVideoUrl = analyticsVideoUrl;
    }
    if (status === 'APPROVED') {
      updateData.approvedAt = new Date();
    }

    const submission = await prisma.submission.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        challenge: true,
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}