'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Eye, CheckCircle, XCircle, Clock, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

// Mock data - in real app, this would be fetched from API
const mockSubmissions = [
  {
    id: '1',
    memberUsername: 'creator123',
    videoTitle: 'Amazing Dance Reel',
    videoUrl: 'https://www.instagram.com/reel/example1',
    analyticsVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    status: 'PENDING_REVIEW',
    submittedAt: '2024-01-15T10:30:00Z',
    challengeTitle: '10k Views Club',
    minimumViewCount: 10000,
  },
  {
    id: '2',
    memberUsername: 'viralcreator',
    videoTitle: 'TikTok Dance Challenge',
    videoUrl: 'https://www.tiktok.com/@user/video/123456',
    analyticsVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    status: 'PENDING_REVIEW',
    submittedAt: '2024-01-14T14:20:00Z',
    challengeTitle: 'Viral TikTok',
    minimumViewCount: 50000,
  },
  {
    id: '3',
    memberUsername: 'youtuber_pro',
    videoTitle: 'Quick Tutorial',
    videoUrl: 'https://www.youtube.com/shorts/example',
    analyticsVideoUrl: null,
    status: 'AWAITING_ANALYTICS',
    submittedAt: '2024-01-13T09:15:00Z',
    challengeTitle: 'YouTube Shorts Success',
    minimumViewCount: 25000,
  },
  {
    id: '4',
    memberUsername: 'success_story',
    videoTitle: 'My Viral Moment',
    videoUrl: 'https://www.instagram.com/reel/example2',
    analyticsVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    status: 'APPROVED',
    submittedAt: '2024-01-10T16:45:00Z',
    approvedAt: '2024-01-11T11:30:00Z',
    challengeTitle: '10k Views Club',
    minimumViewCount: 10000,
  },
  {
    id: '5',
    memberUsername: 'rejected_user',
    videoTitle: 'Not Good Enough',
    videoUrl: 'https://www.tiktok.com/@user/video/789012',
    analyticsVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    status: 'REJECTED',
    submittedAt: '2024-01-08T12:00:00Z',
    challengeTitle: 'Viral TikTok',
    minimumViewCount: 50000,
  },
];

const statusConfig = {
  SUBMITTED: { label: 'Submitted', color: 'bg-blue-500', icon: Clock },
  AWAITING_ANALYTICS: { label: 'Awaiting Analytics', color: 'bg-yellow-500', icon: Upload },
  PENDING_REVIEW: { label: 'Pending Review', color: 'bg-orange-500', icon: Eye },
  APPROVED: { label: 'Approved', color: 'bg-green-500', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-500', icon: XCircle },
};

export default function SubmissionsPage() {
  const [submissions] = useState(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<(typeof mockSubmissions)[0] | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleApprove = async () => {
    setIsReviewing(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Submission approved!');
      setSelectedSubmission(null);
    } catch {
      toast.error('Failed to approve submission');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleReject = async () => {
    setIsReviewing(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Submission rejected');
      setSelectedSubmission(null);
    } catch {
      toast.error('Failed to reject submission');
    } finally {
      setIsReviewing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredSubmissions = (status: string) => {
    return submissions.filter(submission => submission.status === status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Review Submissions</h1>
            <p className="text-lg text-white/70">
              Review and approve member submissions with side-by-side video comparison
            </p>
          </div>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
              <TabsTrigger value="pending" className="data-[state=active]:bg-white/20">
                Pending Review ({filteredSubmissions('PENDING_REVIEW').length})
              </TabsTrigger>
              <TabsTrigger value="awaiting" className="data-[state=active]:bg-white/20">
                Awaiting Analytics ({filteredSubmissions('AWAITING_ANALYTICS').length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-white/20">
                Approved ({filteredSubmissions('APPROVED').length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-white/20">
                Rejected ({filteredSubmissions('REJECTED').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              <div className="grid gap-4">
                {filteredSubmissions('PENDING_REVIEW').map((submission) => {
                  const statusInfo = statusConfig[submission.status as keyof typeof statusConfig];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <Card key={submission.id} className="bg-white/10 backdrop-blur border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {submission.videoTitle}
                              </h3>
                              <Badge className={`${statusInfo.color} text-white`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-white/70 text-sm mb-1">
                              by @{submission.memberUsername} • {submission.challengeTitle}
                            </p>
                            <p className="text-white/60 text-xs">
                              Submitted on {formatDate(submission.submittedAt)}
                            </p>
                          </div>
                          <Button
                            onClick={() => setSelectedSubmission(submission)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="awaiting" className="mt-6">
              <div className="grid gap-4">
                {filteredSubmissions('AWAITING_ANALYTICS').map((submission) => {
                  const statusInfo = statusConfig[submission.status as keyof typeof statusConfig];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <Card key={submission.id} className="bg-white/10 backdrop-blur border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {submission.videoTitle}
                              </h3>
                              <Badge className={`${statusInfo.color} text-white`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-white/70 text-sm mb-1">
                              by @{submission.memberUsername} • {submission.challengeTitle}
                            </p>
                            <p className="text-white/60 text-xs">
                              Submitted on {formatDate(submission.submittedAt)}
                            </p>
                          </div>
                          <div className="text-white/60 text-sm">
                            Waiting for analytics upload
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              <div className="grid gap-4">
                {filteredSubmissions('APPROVED').map((submission) => {
                  const statusInfo = statusConfig[submission.status as keyof typeof statusConfig];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <Card key={submission.id} className="bg-white/10 backdrop-blur border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {submission.videoTitle}
                              </h3>
                              <Badge className={`${statusInfo.color} text-white`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-white/70 text-sm mb-1">
                              by @{submission.memberUsername} • {submission.challengeTitle}
                            </p>
                            <p className="text-white/60 text-xs">
                              Approved on {submission.approvedAt ? formatDate(submission.approvedAt) : 'Unknown'}
                            </p>
                          </div>
                          <Button
                            onClick={() => setSelectedSubmission(submission)}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              <div className="grid gap-4">
                {filteredSubmissions('REJECTED').map((submission) => {
                  const statusInfo = statusConfig[submission.status as keyof typeof statusConfig];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <Card key={submission.id} className="bg-white/10 backdrop-blur border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {submission.videoTitle}
                              </h3>
                              <Badge className={`${statusInfo.color} text-white`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-white/70 text-sm mb-1">
                              by @{submission.memberUsername} • {submission.challengeTitle}
                            </p>
                            <p className="text-white/60 text-xs">
                              Submitted on {formatDate(submission.submittedAt)}
                            </p>
                          </div>
                          <Button
                            onClick={() => setSelectedSubmission(submission)}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Side-by-Side Review Modal */}
          <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
            <DialogContent className="max-w-6xl bg-gray-900 border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Review Submission: {selectedSubmission?.videoTitle}
                </DialogTitle>
                <DialogDescription className="text-white/70">
                  by @{selectedSubmission?.memberUsername} • {selectedSubmission?.challengeTitle}
                </DialogDescription>
              </DialogHeader>
              
              {selectedSubmission && (
                <div className="space-y-6">
                  {/* Side-by-Side Video Players */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-white font-semibold mb-3">Original Video</h3>
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <ReactPlayer
                          url={selectedSubmission.videoUrl}
                          width="100%"
                          height="100%"
                          controls={true}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-semibold mb-3">Analytics Proof</h3>
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        {selectedSubmission.analyticsVideoUrl ? (
                          <ReactPlayer
                            url={selectedSubmission.analyticsVideoUrl}
                            width="100%"
                            height="100%"
                            controls={true}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-white/60">
                            No analytics video uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submission Details */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Submission Details</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/70">Challenge:</p>
                        <p className="text-white">{selectedSubmission.challengeTitle}</p>
                      </div>
                      <div>
                        <p className="text-white/70">Minimum Views Required:</p>
                        <p className="text-white">{selectedSubmission.minimumViewCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-white/70">Submitted:</p>
                        <p className="text-white">{formatDate(selectedSubmission.submittedAt)}</p>
                      </div>
                      <div>
                        <p className="text-white/70">Status:</p>
                        <Badge className={`${statusConfig[selectedSubmission.status as keyof typeof statusConfig].color} text-white`}>
                          {statusConfig[selectedSubmission.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedSubmission.status === 'PENDING_REVIEW' && (
                    <div className="flex gap-4">
                      <Button
                        onClick={handleApprove}
                        disabled={isReviewing}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={isReviewing}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}