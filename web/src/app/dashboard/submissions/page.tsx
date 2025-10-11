'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Eye, CheckCircle, XCircle, Clock, Upload, Loader2 } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';

interface Submission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  memberWhopUsername: string;
  originalVideoUrl: string;
  analyticsVideoUrl?: string;
  videoMetadata?: {
    title: string;
    thumbnail: string;
  };
  status: 'SUBMITTED' | 'AWAITING_ANALYTICS' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  approvedAt?: string;
  submissionInstructions?: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
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

  const handleApprove = async (submissionId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'APPROVED',
          approvedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve submission');
      }

      toast.success('Submission approved successfully!');
      await fetchSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error approving submission:', error);
      toast.error('Failed to approve submission');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (submissionId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'REJECTED',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject submission');
      }

      toast.success('Submission rejected');
      await fetchSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast.error('Failed to reject submission');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredSubmissions = (status: string) => {
    return submissions.filter(submission => submission.status === status);
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4">Review Submissions</h1>
            <p className="text-xl text-white/80">
              Review and approve member submissions
            </p>
          </div>

          <Tabs defaultValue="pending" className="animate-slide-up">
            <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur border-white/20">
              <TabsTrigger value="pending" className="data-[state=active]:bg-white/20">
                Pending Review ({filteredSubmissions('PENDING_REVIEW').length})
              </TabsTrigger>
              <TabsTrigger value="submitted" className="data-[state=active]:bg-white/20">
                Submitted ({filteredSubmissions('SUBMITTED').length})
              </TabsTrigger>
              <TabsTrigger value="awaiting" className="data-[state=active]:bg-white/20">
                Awaiting Analytics ({filteredSubmissions('AWAITING_ANALYTICS').length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-white/20">
                Approved ({filteredSubmissions('APPROVED').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              <div className="grid gap-4">
                {filteredSubmissions('PENDING_REVIEW').map((submission, index) => (
                  <Card 
                    key={submission.id} 
                    className="bg-white/10 backdrop-blur border-white/20 hover-lift transition-smooth"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {submission.videoMetadata?.title || 'Video Submission'}
                            </h3>
                            <Badge className={getStatusColor(submission.status)}>
                              {getStatusIcon(submission.status)}
                              <span className="ml-1">Pending Review</span>
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm mb-2">
                            by @{submission.memberWhopUsername} • {submission.challengeTitle}
                          </p>
                          <p className="text-white/50 text-sm">
                            Submitted {formatDate(submission.submittedAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredSubmissions('PENDING_REVIEW').length === 0 && (
                  <Card className="bg-white/10 backdrop-blur border-white/20">
                    <CardContent className="p-8 text-center">
                      <p className="text-white/70 text-lg">No pending submissions</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="submitted" className="mt-6">
              <div className="grid gap-4">
                {filteredSubmissions('SUBMITTED').map((submission, index) => (
                  <Card 
                    key={submission.id} 
                    className="bg-white/10 backdrop-blur border-white/20 hover-lift transition-smooth"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {submission.videoMetadata?.title || 'Video Submission'}
                            </h3>
                            <Badge className={getStatusColor(submission.status)}>
                              {getStatusIcon(submission.status)}
                              <span className="ml-1">Submitted</span>
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm mb-2">
                            by @{submission.memberWhopUsername} • {submission.challengeTitle}
                          </p>
                          <p className="text-white/50 text-sm">
                            Submitted {formatDate(submission.submittedAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredSubmissions('SUBMITTED').length === 0 && (
                  <Card className="bg-white/10 backdrop-blur border-white/20">
                    <CardContent className="p-8 text-center">
                      <p className="text-white/70 text-lg">No submitted videos</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="awaiting" className="mt-6">
              <div className="grid gap-4">
                {filteredSubmissions('AWAITING_ANALYTICS').map((submission, index) => (
                  <Card 
                    key={submission.id} 
                    className="bg-white/10 backdrop-blur border-white/20 hover-lift transition-smooth"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {submission.videoMetadata?.title || 'Video Submission'}
                            </h3>
                            <Badge className={getStatusColor(submission.status)}>
                              {getStatusIcon(submission.status)}
                              <span className="ml-1">Awaiting Analytics</span>
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm mb-2">
                            by @{submission.memberWhopUsername} • {submission.challengeTitle}
                          </p>
                          <p className="text-white/50 text-sm">
                            Submitted {formatDate(submission.submittedAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredSubmissions('AWAITING_ANALYTICS').length === 0 && (
                  <Card className="bg-white/10 backdrop-blur border-white/20">
                    <CardContent className="p-8 text-center">
                      <p className="text-white/70 text-lg">No submissions awaiting analytics</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              <div className="grid gap-4">
                {filteredSubmissions('APPROVED').map((submission, index) => (
                  <Card 
                    key={submission.id} 
                    className="bg-white/10 backdrop-blur border-white/20 hover-lift transition-smooth"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {submission.videoMetadata?.title || 'Video Submission'}
                            </h3>
                            <Badge className={getStatusColor(submission.status)}>
                              {getStatusIcon(submission.status)}
                              <span className="ml-1">Approved</span>
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm mb-2">
                            by @{submission.memberWhopUsername} • {submission.challengeTitle}
                          </p>
                          <p className="text-white/50 text-sm">
                            Approved {submission.approvedAt ? formatDate(submission.approvedAt) : 'Unknown'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredSubmissions('APPROVED').length === 0 && (
                  <Card className="bg-white/10 backdrop-blur border-white/20">
                    <CardContent className="p-8 text-center">
                      <p className="text-white/70 text-lg">No approved submissions</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Review Modal */}
          <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
            <DialogContent className="max-w-6xl bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">
                  Review Submission
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  Review the original video and analytics proof side by side
                </DialogDescription>
              </DialogHeader>
              
              {selectedSubmission && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Original Video */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Original Video
                      </h3>
                      <div className="bg-black rounded-lg overflow-hidden">
                        <VideoPlayer
                          url={selectedSubmission.originalVideoUrl}
                          width="100%"
                          height="300px"
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        by @{selectedSubmission.memberWhopUsername}
                      </p>
                    </div>

                    {/* Analytics Video */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Analytics Proof
                      </h3>
                      {selectedSubmission.analyticsVideoUrl ? (
                        <div className="bg-black rounded-lg overflow-hidden">
                          <VideoPlayer
                            url={selectedSubmission.analyticsVideoUrl}
                            width="100%"
                            height="300px"
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-800 rounded-lg h-[300px] flex items-center justify-center">
                          <p className="text-gray-400">No analytics video uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submission Details */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Submission Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Challenge:</span>
                        <span className="text-white ml-2">{selectedSubmission.challengeTitle}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <Badge className={`ml-2 ${getStatusColor(selectedSubmission.status)}`}>
                          {selectedSubmission.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-400">Submitted:</span>
                        <span className="text-white ml-2">{formatDate(selectedSubmission.submittedAt)}</span>
                      </div>
                      {selectedSubmission.approvedAt && (
                        <div>
                          <span className="text-gray-400">Approved:</span>
                          <span className="text-white ml-2">{formatDate(selectedSubmission.approvedAt)}</span>
                        </div>
                      )}
                    </div>
                    {selectedSubmission.submissionInstructions && (
                      <div className="mt-3">
                        <span className="text-gray-400">Instructions:</span>
                        <p className="text-white text-sm mt-1">{selectedSubmission.submissionInstructions}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {selectedSubmission.status === 'PENDING_REVIEW' && (
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleReject(selectedSubmission.id)}
                        disabled={isProcessing}
                        className="bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(selectedSubmission.id)}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve
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