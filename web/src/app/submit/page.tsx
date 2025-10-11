"use client";

import React, { useState } from 'react';
import { FrostedButton } from '@/components/FrostedButton';

export default function SubmitPage() {
  const [challengeId, setChallengeId] = useState<string>((process.env.NEXT_PUBLIC_DEFAULT_CHALLENGE_ID || '').trim());
  const [originalVideoUrl, setOriginalVideoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!originalVideoUrl) throw new Error('Provide a video URL');
      // Create submission with original URL; user will upload analytics later in My Submissions
      const createRes = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, originalVideoUrl }),
      });
      if (!createRes.ok) throw new Error('Create failed');
      setMessage('Submitted successfully');
      setOriginalVideoUrl('');
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage('Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">New Submission</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm text-white/70">Challenge ID</label>
          <input value={challengeId} onChange={(e) => setChallengeId(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-orange-500" required />
        </div>
        <div>
          <label className="block text-sm text-white/70">Short video URL (Reel/TikTok/YouTube Short)</label>
          <input type="url" value={originalVideoUrl} onChange={(e) => setOriginalVideoUrl(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-orange-500" required />
        </div>
        <FrostedButton type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit'}</FrostedButton>
        {message && <p className="text-sm text-white/70">{message}</p>}
      </form>
    </div>
  );
}
