'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';

// Mock data - in real app, this would be fetched from API
const mockSubmissions = [
  {
    id: '1',
    challengeTitle: '10k Views Club',
    videoUrl: 'https://www.instagram.com/reel/example1',
    videoTitle: 'My Amazing Reel',
    thumbnailUrl: 'https://via.placeholder.com/300x400',
    status: 'SUBMITTED',
    submittedAt: '2024-01-15T10:30:00Z',
    minimumViewCount: 10000,
  },
  {
    id: '2',
    challengeTitle: 'Viral TikTok',
    videoUrl: 'https://www.tiktok.com/@user/video/123456',
    videoTitle: 'Viral Dance Challenge',
    thumbnailUrl: 'https://via.placeholder.com/300x400',
    status: 'AWAITING_ANALYTICS',
    submittedAt: '2024-01-10T14:20:00Z',
    minimumViewCount: 50000,
  },
  {
    id: '3',
    challengeTitle: 'YouTube Shorts Success',
    videoUrl: 'https://www.youtube.com/shorts/example',
    videoTitle: 'Quick Tutorial',
    thumbnailUrl: 'https://via.placeholder.com/300x400',
    status: 'PENDING_REVIEW',
    submittedAt: '2024-01-05T09:15:00Z',
    minimumViewCount: 25000,
  },
  {
    id: '4',
    challengeTitle: '10k Views Club',
    videoUrl: 'https://www.instagram.com/reel/example2',
    videoTitle: 'Another Great Reel',
    thumbnailUrl: 'https://via.placeholder.com/300x400',
    status: 'APPROVED',
    submittedAt: '2024-01-01T16:45:00Z',
    approvedAt: '2024-01-02T11:30:00Z',
    minimumViewCount: 10000,
  },
];

const statusConfig = {
  SUBMITTED: { label: 'Submitted', color: 'bg-blue-500', icon: Clock },
  AWAITING_ANALYTICS: { label: 'Awaiting Analytics', color: 'bg-yellow-500', icon: Upload },
  PENDING_REVIEW: { label: 'Pending Review', color: 'bg-orange-500', icon: Eye },
  APPROVED: { label: 'Approved', color: 'bg-green-500', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-500', icon: XCircle },
};

export default function MySubmissionsPage() {
  const [submissions] = useState(mockSubmissions);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleHitGoal = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Status updated! You can now upload your analytics proof.');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleFileUpload = async (submissionId: string) => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploadingFile(submissionId);
    
    try {
      // Mock file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Analytics video uploaded successfully! Your submission is now pending review.');
      setSelectedFile(null);
    } catch {
      toast.error('Failed to upload file');
    } finally {
      setUploadingFile(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">My Submissions</h1>
            <p className="text-lg text-white/70">
              Track your video submissions and upload analytics proof
            </p>
          </div>

          <div className="grid gap-6">
            {submissions.map((submission) => {
              const statusInfo = statusConfig[submission.status as keyof typeof statusConfig];
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={submission.id} className="bg-white/10 backdrop-blur border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={submission.thumbnailUrl}
                        alt={submission.videoTitle}
                        className="w-24 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {submission.videoTitle}
                            </h3>
                            <p className="text-white/70 text-sm mb-2">
                              {submission.challengeTitle}
                            </p>
                            <p className="text-white/60 text-xs">
                              Submitted on {formatDate(submission.submittedAt)}
                            </p>
                          </div>
                          <Badge className={`${statusInfo.color} text-white`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                          {submission.status === 'SUBMITTED' && (
                            <Button
                              onClick={handleHitGoal}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              I Hit The Goal! ({submission.minimumViewCount.toLocaleString()} views)
                            </Button>
                          )}

                          {submission.status === 'AWAITING_ANALYTICS' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="bg-purple-600 hover:bg-purple-700">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Analytics
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-900 border-white/20">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Upload Analytics Video</DialogTitle>
                                  <DialogDescription className="text-white/70">
                                    Upload a screen recording of your analytics showing you&apos;ve reached{' '}
                                    {submission.minimumViewCount.toLocaleString()} views.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="analytics-file" className="text-white">
                                      Analytics Video
                                    </Label>
                                    <Input
                                      id="analytics-file"
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                      className="bg-white/10 border-white/20 text-white"
                                    />
                                  </div>
                                  <Button
                                    onClick={() => handleFileUpload(submission.id)}
                                    disabled={!selectedFile || uploadingFile === submission.id}
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                  >
                                    {uploadingFile === submission.id ? 'Uploading...' : 'Upload'}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {submission.status === 'PENDING_REVIEW' && (
                            <div className="text-white/70 text-sm">
                              Your analytics video is being reviewed by our team.
                            </div>
                          )}

                          {submission.status === 'APPROVED' && (
                            <div className="text-green-400 text-sm">
                              ✅ Approved on {formatDate(submission.approvedAt!)}
                            </div>
                          )}

                          {submission.status === 'REJECTED' && (
                            <div className="text-red-400 text-sm">
                              ❌ Rejected - Please check your analytics video and try again.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {submissions.length === 0 && (
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-8 text-center">
                <p className="text-white/70 mb-4">No submissions yet</p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <a href="/submit">Submit Your First Video</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}