'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthMenu() {
  const [user, setUser] = useState<{ id: string; email: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    if (typeof window !== 'undefined') window.location.reload();
  };

  if (loading) return null;

  return user ? (
    <div className="flex items-center gap-2">
      <span className="text-white/70 hidden sm:inline">Hi, {user.username}</span>
      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={logout}>Logout</Button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="ghost" className="text-white hover:bg-white/10">Login</Button>
      </Link>
      <Link href="/signup">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign up</Button>
      </Link>
    </div>
  );
}
