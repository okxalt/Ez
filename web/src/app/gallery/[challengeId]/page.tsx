import { prisma } from '@/lib/prisma';

export default async function GalleryPage({ params }: { params: { challengeId: string } }) {
  const { challengeId } = params;
  const items = await prisma.submission.findMany({ where: { challengeId, status: 'approved' }, orderBy: { approvedAt: 'desc' } });
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Gallery</h2>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance]
      *:break-inside-avoid [
      &>a>div]:mb-4">
        {items.map((s) => (
          <a key={s.id} href={s.originalVideoUrl} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden border border-white/10 bg-white/5">
            {(() => {
              const meta = s.videoMetadata as unknown as { thumbnail_url?: string; title?: string };
              const thumb = meta?.thumbnail_url;
              if (thumb) return <img src={thumb} alt="thumb" className="w-full h-auto" />;
              return <div className="aspect-video bg-white/5" />;
            })()}
            <div className="p-3">
              <div className="text-sm font-medium">{(s.videoMetadata as unknown as { title?: string })?.title || 'Submission'}</div>
              <div className="text-xs text-white/70">@{s.memberWhopUsername}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
