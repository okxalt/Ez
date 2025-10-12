'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      toast.success('Welcome back');
      router.push('/submit');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Log in</CardTitle>
              <CardDescription className="text-white/70">Access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailOrUsername" className="text-white">Email or Username</Label>
                  <Input id="emailOrUsername" value={emailOrUsername} onChange={e=>setEmailOrUsername(e.target.value)} required className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                </div>
                <Button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">{loading ? 'Logging in...' : 'Log in'}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
