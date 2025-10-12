import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export type SessionData = {
  user?: { id: string; email: string; username: string };
};

const sessionPassword = process.env.SESSION_PASSWORD || 'dev-change-me-please-32chars-minimum________';

export const sessionOptions: SessionOptions = {
  password: sessionPassword,
  cookieName: 'whop_app_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
