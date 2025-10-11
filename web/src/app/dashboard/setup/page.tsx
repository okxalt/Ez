"use client";

import React, { useEffect, useState } from 'react';
import { FrostedButton } from '@/components/FrostedButton';

type Challenge = {
  id: string;
  whopProductId: string;
  title: string;
  description?: string | null;
  minimumViewCount: number;
  isActive: boolean;
} | null;

export default function SetupPage() {
  const [challenge, setChallenge] = useState<Challenge>(null);
  const [title, setTitle] = useState('10k Views Club');
  const [description, setDescription] = useState('Hit the goal and submit proof.');
  const [minimumViewCount, setMinimumViewCount] = useState(10000);
  const [whopProductId, setWhopProductId] = useState('demo-product');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/challenges/me').then(async (r) => {
      if (!r.ok) return null;
      const data = await r.json();
      if (data) {
        setChallenge(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setMinimumViewCount(data.minimumViewCount);
        setWhopProductId(data.whopProductId);
      }
    });
  }, []);

  async function save() {
    setSaving(true);
    const res = await fetch('/api/challenges/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, minimumViewCount, whopProductId }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setChallenge(data);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Challenge Setup</h2>
      <div className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm text-white/70">Whop Product</label>
          <input value={whopProductId} onChange={(e) => setWhopProductId(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none" />
        </div>
        <div>
          <label className="block text-sm text-white/70">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none" />
        </div>
        <div>
          <label className="block text-sm text-white/70">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none" />
        </div>
        <div>
          <label className="block text-sm text-white/70">Minimum view count</label>
          <input type="number" value={minimumViewCount} onChange={(e) => setMinimumViewCount(parseInt(e.target.value || '0', 10))} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none" />
        </div>
        <FrostedButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</FrostedButton>
        {challenge && (
          <p className="text-sm text-white/70">Current challenge ID: <code className="text-white/90">{challenge.id}</code></p>
        )}
      </div>
    </div>
  );
}
