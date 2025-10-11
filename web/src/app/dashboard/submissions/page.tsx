"use client";

import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { VideoPlayer } from '@/components/VideoPlayer';
import { FrostedButton } from '@/components/FrostedButton';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUSES = ['submitted','awaiting_analytics','pending_review','approved','rejected'] as const;

type Submission = {
  id: string;
  memberWhopUsername: string;
  originalVideoUrl: string;
  analyticsVideoUrl: string | null;
  status: string;
  submittedAt: string;
  videoMetadata: { title?: string; thumbnail_url?: string };
  challengeId: string;
};

export default function DashboardSubmissionsPage() {
  const [status, setStatus] = useState<typeof STATUSES[number]>('pending_review');
  const [challengeId, setChallengeId] = useState<string>('');
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (challengeId) params.set('challengeId', challengeId);
    return params.toString();
  }, [status, challengeId]);
  const { data, mutate } = useSWR<Submission[]>(`/api/submissions?${query}`, fetcher);

  async function setSubmissionStatus(id: string, s: string) {
    await fetch(`/api/submissions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: s }) });
    mutate();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Submissions</h2>
      <div className="flex gap-2 flex-wrap items-end">
        <div>
          <label className="block text-sm text-white/70">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof STATUSES[number])} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/70">Challenge ID</label>
          <input value={challengeId} onChange={(e) => setChallengeId(e.target.value)} placeholder="optional" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {(data || []).map((s) => (
          <div key={s.id} className="rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur space-y-3">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>@{s.memberWhopUsername}</span>
              <span className="uppercase text-xs">{s.status}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <VideoPlayer url={s.originalVideoUrl} />
              {s.analyticsVideoUrl ? <VideoPlayer url={s.analyticsVideoUrl} /> : <div className="aspect-video rounded-xl ring-1 ring-white/10 bg-white/5" />}
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/submission/${s.id}`} className="px-3 py-2 rounded-lg bg-white/10">Open</Link>
              {s.status === 'pending_review' && (
                <>
                  <FrostedButton onClick={() => setSubmissionStatus(s.id, 'approved')}>Approve</FrostedButton>
                  <FrostedButton onClick={() => setSubmissionStatus(s.id, 'rejected')} className="bg-orange-700/30">Reject</FrostedButton>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
