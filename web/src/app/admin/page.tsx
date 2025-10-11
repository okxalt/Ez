"use client";

import useSWR from 'swr';
import React, { useMemo, useState } from 'react';
import { FrostedButton } from '@/components/FrostedButton';
import { VideoPlayer } from '@/components/VideoPlayer';
import type { Submission, Admin } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminPage() {
  const [whopSlug, setWhopSlug] = useState(process.env.NEXT_PUBLIC_TRIAL_WHOP || 'trial');
  const { data: submissions, mutate } = useSWR<Submission[]>(`/api/submissions?whop=${encodeURIComponent(whopSlug)}`, fetcher);
  const { data: admins, mutate: mutateAdmins } = useSWR<Admin[]>(`/api/admins?whop=${encodeURIComponent(whopSlug)}`, fetcher);
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [minViews, setMinViews] = useState<number>(() => Number(process.env.NEXT_PUBLIC_MIN_VIEWS || 1000));

  const pending = useMemo(() => (submissions || []).filter((s: Submission) => s.currentViews >= minViews), [submissions, minViews]);

  async function login() {
    await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, secret, whopSlug }) });
    mutateAdmins();
  }
  async function logout() { await fetch('/api/auth/logout', { method: 'POST' }); mutateAdmins(); }

  async function addAdmin() {
    await fetch('/api/admins', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, whopSlug }) });
    setEmail('');
    mutateAdmins();
  }
  async function removeAdmin(targetEmail: string) {
    await fetch(`/api/admins?email=${encodeURIComponent(targetEmail)}&whop=${encodeURIComponent(whopSlug)}`, { method: 'DELETE' });
    mutateAdmins();
  }
  async function markReviewed(id: number, reviewed: boolean) {
    await fetch(`/api/submissions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reviewed }) });
    mutate();
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Admin</h2>

      <div className="rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur space-y-3">
        <h3 className="font-semibold">Login</h3>
        <div className="flex gap-2 items-end flex-wrap">
          <div>
            <label className="block text-sm text-white/70">Whop</label>
            <input value={whopSlug} onChange={(e) => setWhopSlug(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-white/70">Email</label>
            <input value={email} placeholder="admin@trial.local" onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-white/70">Admin secret</label>
            <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none" />
          </div>
          <FrostedButton onClick={login}>Login</FrostedButton>
          <FrostedButton onClick={logout} className="bg-orange-600/30">Logout</FrostedButton>
        </div>
      </div>

      <div className="rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur space-y-3">
        <h3 className="font-semibold">Admins</h3>
        <div className="flex gap-2 items-end flex-wrap">
          <div>
            <label className="block text-sm text-white/70">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none" />
          </div>
          <FrostedButton onClick={addAdmin}>Add</FrostedButton>
        </div>
        <ul className="text-sm text-white/80">
          {(admins || []).map((a: Admin) => (
            <li key={a.id} className="flex items-center justify-between py-1">
              <span>{a.email}</span>
              <FrostedButton onClick={() => removeAdmin(a.email)} className="bg-orange-700/30">Remove</FrostedButton>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur space-y-3">
        <h3 className="font-semibold">Settings</h3>
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-sm text-white/70">Minimum views to review</label>
            <input
              type="number"
              value={minViews}
              onChange={(e) => setMinViews(parseInt(e.target.value || '0', 10))}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur space-y-3">
        <h3 className="font-semibold">Ready for review</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {pending.map((s: Submission) => (
            <div key={s.id} className="space-y-3">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>@{s.username}</span>
                <span>{s.currentViews.toLocaleString()} views</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <VideoPlayer url={s.shortVideoUrl} />
                <VideoPlayer url={s.analyticsVideoPath} />
              </div>
              <div className="flex gap-2">
                <FrostedButton onClick={() => markReviewed(s.id, true)}>Mark reviewed</FrostedButton>
                <FrostedButton onClick={() => markReviewed(s.id, false)} className="bg-orange-700/30">Unmark</FrostedButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
