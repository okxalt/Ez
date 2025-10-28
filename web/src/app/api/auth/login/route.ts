import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrUsername, password } = body as {
      emailOrUsername?: string;
      password?: string;
    };

    if (!emailOrUsername || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const member = await prisma.member.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
      select: { id: true, email: true, username: true, passwordHash: true },
    });

    if (!member) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, member.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const session = await getSession();
    session.user = { id: member.id, email: member.email, username: member.username };
    await session.save();

    return NextResponse.json({ user: { id: member.id, email: member.email, username: member.username } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
