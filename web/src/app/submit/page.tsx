'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  minimumViewCount: number;
  isActive: boolean;
}

export default function SubmitPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [submissionInstructions, setSubmissionInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges?isActive=true');
      const data = await response.json();
      setChallenges(data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl || !selectedChallenge) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure user is logged in
      const meRes = await fetch('/api/auth/me');
      const me = await meRes.json();
      if (!me.user) {
        toast.error('Please sign up or log in first');
        return;
      }
      // Validate URL format
      const url = new URL(videoUrl);
      if (!['www.instagram.com', 'www.tiktok.com', 'www.youtube.com'].some(domain => url.hostname.includes(domain))) {
        throw new Error('Please provide a valid Instagram Reel, TikTok, or YouTube Short URL');
      }

      // Create submission via API
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: selectedChallenge,
          memberWhopUserId: me.user.id,
          memberWhopUsername: me.user.username,
          originalVideoUrl: videoUrl,
          submissionInstructions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create submission');
      }
      
      toast.success('Video submitted successfully! Come back to update it once you hit the view goal.');
      
      // Reset form
      setVideoUrl('');
      setSelectedChallenge('');
      setSubmissionInstructions('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit video');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading challenges...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4">Submit Your Video</h1>
            <p className="text-lg text-white/70">
              Share your video and prove your success with analytics
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur border-white/20 animate-slide-up">
            <CardHeader>
              <CardTitle className="text-white">Video Submission</CardTitle>
              <CardDescription className="text-white/70">
                Submit your Instagram Reel, TikTok, or YouTube Short URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="challenge" className="text-white">
                    Select Challenge
                  </Label>
                  <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Choose a challenge" />
                    </SelectTrigger>
                    <SelectContent>
                      {challenges.map((challenge) => (
                        <SelectItem key={challenge.id} value={challenge.id}>
                          <div>
                            <div className="font-medium">{challenge.title}</div>
                            <div className="text-sm text-gray-500">
                              {challenge.description} ({challenge.minimumViewCount.toLocaleString()} views)
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="text-white">
                    Video URL
                  </Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    placeholder="https://www.instagram.com/reel/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                  <p className="text-sm text-white/60">
                    Supported platforms: Instagram Reels, TikTok, YouTube Shorts
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions" className="text-white">
                    Submission Instructions (Optional)
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any additional notes or instructions for your submission..."
                    value={submissionInstructions}
                    onChange={(e) => setSubmissionInstructions(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 hover:scale-105"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Video'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center animate-fade-in">
            <p className="text-white/60 text-sm">
              After submitting, you&apos;ll be able to upload your analytics proof once you hit the view goal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}