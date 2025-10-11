import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">ProofReel</h1>
          <p className="text-xl text-white/70 mb-8">Verifiable Win Tracker for Whop</p>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Create challenges, track video performance, and verify wins with side-by-side analytics review.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">For Members</CardTitle>
              <CardDescription className="text-white/70">
                Submit your video and prove your success
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/60 text-sm">
                Submit your video URL, hit the view goal, and upload your analytics proof.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/submit">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Submit Video
                  </Button>
                </Link>
                <Link href="/my-submissions">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    My Submissions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">For Sellers</CardTitle>
              <CardDescription className="text-white/70">
                Create challenges and review submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/60 text-sm">
                Set up challenges for your Whop products and review member submissions.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/dashboard/setup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Create Challenge
                  </Button>
                </Link>
                <Link href="/dashboard/submissions">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Review Submissions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Public Gallery</CardTitle>
              <CardDescription className="text-white/70">
                View verified wins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/60 text-sm">
                Browse approved submissions and see verified wins from the community.
              </p>
              <Link href="/gallery">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  View Gallery
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
