"use client";

import React from 'react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { VideoPlayer } from '@/components/VideoPlayer';
import { FrostedButton } from '@/components/FrostedButton';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Submission = {
  id: string;
  memberWhopUsername: string;
  originalVideoUrl: string;
  analyticsVideoUrl: string | null;
  status: string;
  submittedAt: string;
};

export default function SubmissionDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, mutate } = useSWR<Submission>(params?.id ? `/api/submissions/${params.id}` : null, fetcher);

  async function setStatus(status: string) {
    if (!params?.id) return;
    await fetch(`/api/submissions/${params.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    mutate();
  }

  if (!data) return <div className="text-white/70">Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Review Submission</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <VideoPlayer url={data.originalVideoUrl} />
        {data.analyticsVideoUrl ? <VideoPlayer url={data.analyticsVideoUrl} /> : <div className="aspect-video rounded-xl ring-1 ring-white/10 bg-white/5" />}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">@{data.memberWhopUsername}</div>
        <div className="flex gap-2">
          <FrostedButton onClick={() => setStatus('approved')}>Approve</FrostedButton>
          <FrostedButton onClick={() => setStatus('rejected')} className="bg-orange-700/30">Reject</FrostedButton>
        </div>
      </div>
    </div>
  );
}
