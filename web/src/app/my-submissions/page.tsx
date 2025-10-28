'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Eye, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Submission {
  id: string;
  challengeId: string;
  challenge: { id: string; title: string; minimumViewCount: number };
  originalVideoUrl: string;
  analyticsVideoUrl?: string;
  videoMetadata?: { title?: string; thumbnailUrl?: string };
  status: 'SUBMITTED' | 'AWAITING_ANALYTICS' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  approvedAt?: string;
  submissionInstructions?: string;
}

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingSubmissionId, setUploadingSubmissionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const me = await meRes.json();
      if (!me.user) {
        setSubmissions([]);
        setIsLoading(false);
        return;
      }
      const response = await fetch('/api/submissions?mine=true');
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <Clock className="h-4 w-4" />;
      case 'AWAITING_ANALYTICS':
        return <Upload className="h-4 w-4" />;
      case 'PENDING_REVIEW':
        return <Eye className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'AWAITING_ANALYTICS':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'PENDING_REVIEW':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'APPROVED':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }
      
      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 100MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUploadAnalytics = async (submissionId: string) => {
    if (!selectedFile) {
      toast.error('Please select a video file first');
      return;
    }

    setIsUploading(true);
    setUploadingSubmissionId(submissionId);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('submissionId', submissionId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload analytics video');
      }

      const { url } = await response.json();

      // Update submission status to PENDING_REVIEW
      const updateResponse = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'PENDING_REVIEW',
          analyticsVideoUrl: url,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update submission status');
      }

      toast.success('Analytics video uploaded successfully! Your submission is now pending review.');
      
      // Refresh submissions
      await fetchSubmissions();
      
      // Reset file selection
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading analytics video:', error);
      toast.error('Failed to upload analytics video');
    } finally {
      setIsUploading(false);
      setUploadingSubmissionId(null);
    }
  };

  const handleHitGoal = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'AWAITING_ANALYTICS',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update submission status');
      }

      toast.success('Great! Now upload your analytics video to prove you hit the goal.');
      await fetchSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading submissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4">My Submissions</h1>
            <p className="text-xl text-white/80">
              Track your video submissions and upload analytics proof
            </p>
          </div>

          {submissions.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur border-white/20 animate-slide-up">
              <CardContent className="p-8 text-center">
                <p className="text-white/70 text-lg">No submissions yet</p>
                <p className="text-white/50 mt-2">
                  <a href="/submit" className="text-purple-300 hover:text-purple-200 underline">
                    Submit your first video
                  </a>
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {submissions.map((submission, index) => (
                <Card 
                  key={submission.id} 
                  className="bg-white/10 backdrop-blur border-white/20 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Image
                        src={submission.videoMetadata?.thumbnailUrl || 'https://via.placeholder.com/300x400'}
                        alt={submission.videoMetadata?.title || 'Video'}
                        width={96}
                        height={128}
                        className="w-24 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {submission.videoMetadata?.title || 'Video Submission'}
                            </h3>
                            <p className="text-white/70 text-sm mb-2">
                              {submission.challenge?.title}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getStatusColor(submission.status)}>
                                {getStatusIcon(submission.status)}
                                <span className="ml-1 capitalize">
                                  {submission.status.replace('_', ' ').toLowerCase()}
                                </span>
                              </Badge>
                              <span className="text-white/50 text-sm">
                                Submitted {formatDate(submission.submittedAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => window.open(submission.originalVideoUrl, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Video
                          </Button>

                          {submission.status === 'SUBMITTED' && (
                            <Button
                              onClick={() => handleHitGoal(submission.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              I Hit The Goal!
                            </Button>
                          )}

                          {submission.status === 'AWAITING_ANALYTICS' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Analytics
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-900 border-gray-700">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Upload Analytics Video</DialogTitle>
                                  <DialogDescription className="text-gray-300">
                                    Upload a screen recording of your analytics showing you hit the view goal.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="analytics-file" className="text-white">
                                      Select Video File
                                    </Label>
                                    <Input
                                      id="analytics-file"
                                      type="file"
                                      accept="video/*"
                                      onChange={handleFileSelect}
                                      className="bg-gray-800 border-gray-600 text-white"
                                    />
                                    <p className="text-sm text-gray-400 mt-1">
                                      Max file size: 100MB. Supported formats: MP4, MOV, AVI
                                    </p>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      onClick={() => handleUploadAnalytics(submission.id)}
                                      disabled={!selectedFile || isUploading}
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      {isUploading && uploadingSubmissionId === submission.id ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Uploading...
                                        </>
                                      ) : (
                                        'Upload'
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {submission.analyticsVideoUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                              onClick={() => window.open(submission.analyticsVideoUrl, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Analytics
                            </Button>
                          )}
                        </div>

                        {submission.submissionInstructions && (
                          <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <p className="text-sm text-white/70">
                              <strong>Instructions:</strong> {submission.submissionInstructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}