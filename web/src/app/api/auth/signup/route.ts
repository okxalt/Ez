import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = body as {
      email?: string;
      username?: string;
      password?: string;
    };

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const existing = await prisma.member.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: 'Email or username already in use' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const member = await prisma.member.create({
      data: { email, username, passwordHash },
      select: { id: true, email: true, username: true },
    });

    const session = await getSession();
    session.user = { id: member.id, email: member.email, username: member.username };
    await session.save();

    return NextResponse.json({ user: member }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to sign up' }, { status: 500 });
  }
}
