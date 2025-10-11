'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Eye, Calendar, Loader2 } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';

interface Submission {
  id: string;
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  memberUsername: string;
  challengeTitle: string;
  viewCount: number;
  approvedAt: string;
  videoMetadata?: {
    title: string;
    thumbnail: string;
  };
}

interface Challenge {
  id: string;
  title: string;
}

export default function GalleryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch approved submissions
      const submissionsResponse = await fetch('/api/submissions?status=APPROVED');
      const submissionsData = await submissionsResponse.json();
      setSubmissions(submissionsData);

      // Fetch challenges
      const challengesResponse = await fetch('/api/challenges');
      const challengesData = await challengesResponse.json();
      setChallenges([{ id: 'all', title: 'All Challenges' }, ...challengesData]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredSubmissions = selectedChallenge === 'all' 
    ? submissions 
    : submissions.filter(submission => submission.challengeTitle === selectedChallenge);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading gallery...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4">Success Gallery</h1>
            <p className="text-xl text-white/80">
              Celebrating verified wins from our community
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex justify-center mb-8 animate-slide-up">
            <div className="flex items-center gap-4">
              <span className="text-white/70">Filter by challenge:</span>
              <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
                <SelectTrigger className="w-64 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select challenge" />
                </SelectTrigger>
                <SelectContent>
                  {challenges.map((challenge) => (
                    <SelectItem key={challenge.id} value={challenge.id}>
                      {challenge.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredSubmissions.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur border-white/20 animate-slide-up">
              <CardContent className="p-8 text-center">
                <p className="text-white/70 text-lg">No approved submissions yet</p>
                <p className="text-white/50 mt-2">
                  Check back later for amazing content from our community!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredSubmissions.map((submission, index) => (
                <Card
                  key={submission.id}
                  className="break-inside-avoid bg-white/10 backdrop-blur border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => setSelectedSubmission(submission)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="relative group">
                      <Image
                        src={submission.thumbnailUrl || submission.videoMetadata?.thumbnail || 'https://via.placeholder.com/300x400'}
                        alt={submission.videoTitle}
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
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          <Eye className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2 line-clamp-2">
                        {submission.videoTitle}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                        <span>by @{submission.memberUsername}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(submission.approvedAt)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white/70">
                          {submission.challengeTitle}
                        </Badge>
                        <span className="text-white/60 text-xs">
                          {submission.viewCount?.toLocaleString() || 'N/A'} views
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Video Modal */}
          <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
            <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">
                  {selectedSubmission?.videoTitle}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  by @{selectedSubmission?.memberUsername} • {selectedSubmission?.challengeTitle}
                </DialogDescription>
              </DialogHeader>
              
              {selectedSubmission && (
                <div className="space-y-4">
                  <div className="bg-black rounded-lg overflow-hidden">
                    <VideoPlayer
                      url={selectedSubmission.videoUrl}
                      width="100%"
                      height="400px"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <div className="flex items-center gap-4">
                      <span>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Approved {formatDate(selectedSubmission.approvedAt)}
                      </span>
                      {selectedSubmission.viewCount && (
                        <span>
                          <Eye className="w-4 h-4 inline mr-1" />
                          {selectedSubmission.viewCount.toLocaleString()} views
                        </span>
                      )}
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Verified Win
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