import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye, BarChart3, Users } from 'lucide-react';

// Mock data - in real app, this would be fetched from API
const mockStats = {
  totalChallenges: 3,
  activeChallenges: 2,
  totalSubmissions: 47,
  pendingReviews: 8,
  approvedSubmissions: 35,
  rejectedSubmissions: 4,
};

const mockChallenges = [
  {
    id: '1',
    title: '10k Views Club',
    description: 'Get 10,000 views on your Reel',
    minimumViewCount: 10000,
    isActive: true,
    submissionCount: 23,
    approvedCount: 18,
  },
  {
    id: '2',
    title: 'Viral TikTok',
    description: 'Create a viral TikTok with 50k+ views',
    minimumViewCount: 50000,
    isActive: true,
    submissionCount: 15,
    approvedCount: 12,
  },
  {
    id: '3',
    title: 'YouTube Shorts Success',
    description: 'Hit 25k views on a YouTube Short',
    minimumViewCount: 25000,
    isActive: false,
    submissionCount: 9,
    approvedCount: 5,
  },
];

export default function DashboardPage() {
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
                    <p className="text-2xl font-bold text-white">{mockStats.totalChallenges}</p>
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
                    <p className="text-2xl font-bold text-white">{mockStats.totalSubmissions}</p>
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
                    <p className="text-2xl font-bold text-white">{mockStats.pendingReviews}</p>
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
                    <p className="text-2xl font-bold text-white">{mockStats.approvedSubmissions}</p>
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
                    <span className="text-white/70">New submission for "10k Views Club"</span>
                    <Badge className="bg-orange-500 text-white">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Approved submission for "Viral TikTok"</span>
                    <Badge className="bg-green-500 text-white">Approved</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">New submission for "YouTube Shorts"</span>
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
                {mockChallenges.map((challenge) => (
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
                        {challenge.submissionCount} submissions • {challenge.approvedCount} approved
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