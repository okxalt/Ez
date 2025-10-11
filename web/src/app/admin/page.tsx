"use client";

import useSWR from 'swr';
import React from 'react';
import { FrostedButton } from '@/components/FrostedButton';
import { VideoPlayer } from '@/components/VideoPlayer';

type VideoMetadata = { title?: string; thumbnail_url?: string; provider_name?: string };
type Submission = {
  id: string;
  memberWhopUsername: string;
  originalVideoUrl: string;
  analyticsVideoUrl: string | null;
  status: string;
  submittedAt: string;
  videoMetadata: VideoMetadata;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminPage() {
  const { data: submissions, mutate } = useSWR<Submission[]>('/api/submissions?status=pending_review', fetcher);

  async function setStatus(id: string, status: string) {
    await fetch(`/api/submissions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    mutate();
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Admin Review</h2>

      <div className="rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur space-y-3">
        <h3 className="font-semibold">Pending review</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {(submissions || []).map((s) => (
            <div key={s.id} className="space-y-3">
              <div className="text-sm text-white/70">@{s.memberWhopUsername}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <VideoPlayer url={s.originalVideoUrl} />
                {s.analyticsVideoUrl ? <VideoPlayer url={s.analyticsVideoUrl} /> : <div className="aspect-video rounded-xl ring-1 ring-white/10 bg-white/5" />}
              </div>
              <div className="flex gap-2">
                <FrostedButton onClick={() => setStatus(s.id, 'approved')}>Approve</FrostedButton>
                <FrostedButton onClick={() => setStatus(s.id, 'rejected')} className="bg-orange-700/30">Reject</FrostedButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
