'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function SubmitPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock challenges - in real app, this would be fetched from API
  const challenges = [
    { id: '1', title: '10k Views Club', description: 'Get 10,000 views on your Reel', minimumViewCount: 10000 },
    { id: '2', title: 'Viral TikTok', description: 'Create a viral TikTok with 50k+ views', minimumViewCount: 50000 },
    { id: '3', title: 'YouTube Shorts Success', description: 'Hit 25k views on a YouTube Short', minimumViewCount: 25000 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl || !selectedChallenge) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate URL format
      const url = new URL(videoUrl);
      if (!['www.instagram.com', 'www.tiktok.com', 'www.youtube.com'].some(domain => url.hostname.includes(domain))) {
        throw new Error('Please provide a valid Instagram Reel, TikTok, or YouTube Short URL');
      }

      // Mock API call - in real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Video submitted successfully! Come back to update it once you hit the view goal.');
      
      // Reset form
      setVideoUrl('');
      setSelectedChallenge('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit video');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Submit Your Video</h1>
            <p className="text-lg text-white/70">
              Share your video and prove your success with analytics
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur border-white/20">
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

                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Video'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              After submitting, you'll be able to upload your analytics proof once you hit the view goal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}