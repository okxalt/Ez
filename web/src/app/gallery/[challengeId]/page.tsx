'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Eye, Calendar } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ challengeId: string }>;
}

type Submission = {
  id: string;
  memberWhopUsername: string;
  originalVideoUrl: string;
  analyticsVideoUrl?: string;
  videoMetadata?: { title?: string; thumbnailUrl?: string };
  challenge: { id: string; title: string };
  approvedAt: string;
};

export default function ChallengeGalleryPage({ params }: PageProps) {
  const [challengeId, setChallengeId] = useState<string>('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    params.then(async (resolvedParams) => {
      setChallengeId(resolvedParams.challengeId);
      const res = await fetch(`/api/submissions?status=APPROVED&challengeId=${resolvedParams.challengeId}`);
      const data = await res.json();
      setSubmissions(data);
    });
  }, [params]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Challenge Gallery</h1>
            <p className="text-xl text-white/70 mb-8">
              Browse approved submissions for this challenge
            </p>
            <Badge className="bg-blue-500 text-white text-lg px-4 py-2">
              Challenge ID: {challengeId}
            </Badge>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {submissions.map((submission) => (
              <Card 
                key={submission.id} 
                className="break-inside-avoid bg-white/10 backdrop-blur border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                onClick={() => setSelectedSubmission(submission)}
              >
                <CardContent className="p-0">
                  <div className="relative group">
                    <Image
                      src={submission.videoMetadata?.thumbnailUrl || 'https://via.placeholder.com/300x400'}
                      alt={submission.videoMetadata?.title || 'Video'}
                      width={300}
                      height={400}
                      className="w-full h-auto rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
                      <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                        <Play className="w-6 h-6 mr-2" />
                        Watch
                      </Button>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white">
                        Verified
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">
                      {submission.videoMetadata?.title || 'Video Submission'}
                    </h3>
                    <p className="text-white/70 text-sm mb-2">
                      by @{submission.memberWhopUsername}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-white/60">
                        <Eye className="w-4 h-4 mr-1" />
                        Approved
                      </div>
                      <div className="flex items-center text-white/60">
                        <Calendar className="w-4 h-4 mr-1" />
                        {submission.approvedAt ? formatDate(submission.approvedAt) : 'Unknown'}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="border-white/30 text-white/80 text-xs">
                        {submission.challenge.title}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {submissions.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/70 text-lg mb-4">No submissions found for this challenge</p>
              <p className="text-white/50">Check back later for approved submissions</p>
            </div>
          )}

          {/* Video Modal */}
          <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
            <DialogContent className="max-w-4xl bg-gray-900 border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedSubmission?.videoMetadata?.title || 'Video Submission'}
                </DialogTitle>
                <DialogDescription className="text-white/70">
                  by @{selectedSubmission?.memberWhopUsername} • {selectedSubmission?.challenge.title}
                </DialogDescription>
              </DialogHeader>
              
              {selectedSubmission && (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <VideoPlayer
                      url={selectedSubmission.originalVideoUrl}
                      width="100%"
                      height="100%"
                      controls={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      Approved
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {selectedSubmission.approvedAt ? `Approved on ${formatDate(selectedSubmission.approvedAt)}` : 'Approval date unknown'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 text-white">
                      Verified Win
                    </Badge>
                    <Badge variant="outline" className="border-white/30 text-white/80">
                      {selectedSubmission.challenge.title}
                    </Badge>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}