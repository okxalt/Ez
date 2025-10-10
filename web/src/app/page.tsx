import Link from 'next/link';
import { FrostedButton } from '@/components/FrostedButton';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur">
        <h2 className="text-2xl font-semibold">Submit your reel + analytics</h2>
        <p className="text-white/70 mt-2">Post a short video link and upload your analytics video. When it reaches the minimum views, reviewers can mark it as reviewed with side-by-side playback.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/submit"><FrostedButton>New Submission</FrostedButton></Link>
          <Link href="/submissions"><FrostedButton className="bg-orange-600/30">View Submissions</FrostedButton></Link>
          <Link href="/admin"><FrostedButton className="bg-orange-700/30">Admin</FrostedButton></Link>
        </div>
      </div>
    </div>
  );
}
