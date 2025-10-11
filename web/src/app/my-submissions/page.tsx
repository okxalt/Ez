"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { FrostedButton } from '@/components/FrostedButton';
import { VideoPlayer } from '@/components/VideoPlayer';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Item = {
  id: string;
  originalVideoUrl: string;
  analyticsVideoUrl: string | null;
  status: string;
  videoMetadata: { title?: string; thumbnail_url?: string };
};

export default function MySubmissionsPage() {
  const { data, mutate } = useSWR<Item[]>('/api/submissions?mine=1', fetcher);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  async function hitGoal(id: string) {
    await fetch(`/api/submissions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'awaiting_analytics' }) });
    mutate();
  }

  async function onFile(id: string, file: File) {
    setUploadingId(id);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const { url } = await res.json();
    await fetch(`/api/submissions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ analyticsVideoUrl: url, status: 'pending_review' }) });
    setUploadingId(null);
    mutate();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">My Submissions</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {(data || []).map((s) => (
          <div key={s.id} className="rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur space-y-3">
            <div className="text-sm text-white/70">{s.videoMetadata?.title || s.originalVideoUrl}</div>
            <VideoPlayer url={s.originalVideoUrl} />
            <div className="flex items-center justify-between">
              <div className="uppercase text-xs">{s.status}</div>
              {s.status === 'submitted' && (
                <FrostedButton onClick={() => hitGoal(s.id)}>I Hit The Goal!</FrostedButton>
              )}
            </div>
            {s.status === 'awaiting_analytics' && (
              <div>
                <label className="block text-sm text-white/70">Upload analytics video</label>
                <input type="file" accept="video/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(s.id, f); }} />
                {uploadingId === s.id && <div className="text-xs text-white/60 mt-1">Uploading...</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
