import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (sellerId) {
      where.sellerId = sellerId;
    }
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const challenges = await prisma.challenge.findMany({
      where,
      include: {
        seller: true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sellerId, whopProductId, title, description, minimumViewCount } = body;

    // Validate required fields
    if (!sellerId || !whopProductId || !title || !minimumViewCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or find seller
    let seller = await prisma.seller.findUnique({
      where: {
        whopUserId: sellerId,
      },
    });

    if (!seller) {
      seller = await prisma.seller.create({
        data: {
          whopUserId: sellerId,
        },
      });
    }

    // Create challenge
    const challenge = await prisma.challenge.create({
      data: {
        sellerId: seller.id,
        whopProductId,
        title,
        description: description || null,
        minimumViewCount: parseInt(minimumViewCount),
        isActive: true,
      },
      include: {
        seller: true,
      },
    });

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
}