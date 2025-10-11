import type { NextAuthOptions, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Dev Whop',
      credentials: {
        whopUserId: { label: 'Whop User ID', type: 'text' },
        username: { label: 'Username', type: 'text' },
        role: { label: 'Role (member/seller)', type: 'text' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;
        const id = String(credentials.whopUserId || '').trim();
        const name = String(credentials.username || '').trim();
        if (!id || !name) return null;
        return { id, name } as User;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.whopUserId = (user as User).id;
        token.username = (user as User).name;
        token.role = (credentialsRole(user) || 'member');
      }
      return token;
    },
    async session({ session, token }) {
      const s = session as unknown as { user?: { whopUserId?: string; username?: string; role?: string } };
      const t = token as unknown as { whopUserId?: string; username?: string; role?: string };
      s.user = {
        whopUserId: t.whopUserId,
        username: t.username,
        role: t.role || 'member',
      };
      return s as unknown as typeof session;
    },
  },
};

function credentialsRole(user: unknown): string | undefined {
  try {
    // In dev credentials, role is not in the User type; allow undefined
    return (user as { role?: string } | null | undefined)?.role;
  } catch {
    return undefined;
  }
}
