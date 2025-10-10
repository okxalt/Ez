import { prisma } from '@/lib/prisma';
import { VideoPlayer } from '@/components/VideoPlayer';

export default async function SubmissionsPage() {
  const submissions = await prisma.submission.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Submissions</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {submissions.map((s) => (
          <div key={s.id} className="rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur space-y-3">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>@{s.username}</span>
              <span>{s.currentViews.toLocaleString()} views</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <VideoPlayer url={s.shortVideoUrl} />
              <VideoPlayer url={s.analyticsVideoPath.startsWith('http') ? s.analyticsVideoPath : s.analyticsVideoPath} />
            </div>
            <div className="text-sm text-white/70">
              {s.reviewed ? 'Reviewed' : 'Pending review'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
