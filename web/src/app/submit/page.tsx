"use client";

import React, { useState } from 'react';
import { FrostedButton } from '@/components/FrostedButton';

export default function SubmitPage() {
  const [username, setUsername] = useState('');
  const [shortVideoUrl, setShortVideoUrl] = useState('');
  const [currentViews, setCurrentViews] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!file) throw new Error('Upload analytics video');
      // 1) upload file
      const fd = new FormData();
      fd.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { path } = await uploadRes.json();

      // 2) create submission
      const createRes = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, shortVideoUrl, analyticsVideoPath: path, currentViews }),
      });
      if (!createRes.ok) throw new Error('Create failed');
      setMessage('Submitted successfully');
      setUsername('');
      setShortVideoUrl('');
      setCurrentViews(0);
      setFile(null);
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">New Submission</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm text-white/70">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-orange-500" required />
        </div>
        <div>
          <label className="block text-sm text-white/70">Short video URL (Reel/TikTok/YouTube Short)</label>
          <input type="url" value={shortVideoUrl} onChange={(e) => setShortVideoUrl(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-orange-500" required />
        </div>
        <div>
          <label className="block text-sm text-white/70">Current views</label>
          <input type="number" value={currentViews} onChange={(e) => setCurrentViews(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm text-white/70">Upload analytics video (mp4)</label>
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full mt-1" required />
        </div>
        <FrostedButton type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit'}</FrostedButton>
        {message && <p className="text-sm text-white/70">{message}</p>}
      </form>
    </div>
  );
}
