import Link from 'next/link';
import { FrostedButton } from '@/components/FrostedButton';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur">
        <h2 className="text-2xl font-semibold">ProofReel</h2>
        <p className="text-white/70 mt-2">Create challenges, accept member submissions, verify with side-by-side analytics, and showcase wins.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/submit"><FrostedButton>New Submission</FrostedButton></Link>
          <Link href="/my-submissions"><FrostedButton className="bg-orange-600/30">My Submissions</FrostedButton></Link>
          <Link href="/dashboard/submissions"><FrostedButton className="bg-orange-700/30">Dashboard</FrostedButton></Link>
        </div>
      </div>
    </div>
  );
}
