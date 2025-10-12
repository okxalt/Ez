"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye, BarChart3, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

type Challenge = {
  id: string;
  title: string;
  description: string | null;
  minimumViewCount: number;
  isActive: boolean;
  _count?: { submissions: number };
};

type Submission = { status: string };

export default function DashboardPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [chRes, subRes] = await Promise.all([
          fetch('/api/challenges'),
          fetch('/api/submissions'),
        ]);
        const [chData, subData] = await Promise.all([chRes.json(), subRes.json()]);
        setChallenges(chData);
        setSubmissions(subData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalChallenges = challenges.length;
  const activeChallenges = challenges.filter(c => c.isActive).length;
  const totalSubmissions = submissions.length;
  const pendingReviews = submissions.filter(s => s.status === 'PENDING_REVIEW').length;
  const approvedSubmissions = submissions.filter(s => s.status === 'APPROVED').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
            <p className="text-lg text-white/70">
              Manage your challenges and review submissions
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Challenges</p>
                    <p className="text-2xl font-bold text-white">{totalChallenges}</p>
                  </div>
                  <Settings className="h-8 w-8 text-white/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Submissions</p>
                    <p className="text-2xl font-bold text-white">{totalSubmissions}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-white/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Pending Reviews</p>
                    <p className="text-2xl font-bold text-white">{pendingReviews}</p>
                  </div>
                  <Eye className="h-8 w-8 text-white/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Approved</p>
                    <p className="text-2xl font-bold text-white">{approvedSubmissions}</p>
                  </div>
                  <Users className="h-8 w-8 text-white/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-white/70">
                  Manage your challenges and review submissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/setup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Create New Challenge
                  </Button>
                </Link>
                <Link href="/dashboard/submissions">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Review Submissions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-white/70">
                  Latest submissions and reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">New submission for &quot;10k Views Club&quot;</span>
                    <Badge className="bg-orange-500 text-white">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Approved submission for &quot;Viral TikTok&quot;</span>
                    <Badge className="bg-green-500 text-white">Approved</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">New submission for &quot;YouTube Shorts&quot;</span>
                    <Badge className="bg-orange-500 text-white">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Challenges List */}
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Your Challenges</CardTitle>
              <CardDescription className="text-white/70">
                Manage and monitor your active challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                        <Badge className={challenge.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                          {challenge.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm mb-2">{challenge.description}</p>
                      <p className="text-white/60 text-xs">
                        {(challenge._count?.submissions ?? 0)} submissions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/gallery/${challenge.id}`}>
                        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                          View Gallery
                        </Button>
                      </Link>
                      <Link href="/dashboard/submissions">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}