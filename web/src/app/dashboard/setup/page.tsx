'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock Whop products - in real app, this would be fetched from Whop API
const mockWhopProducts = [
  { id: 'prod_1', name: 'Premium Content Access', description: 'Access to exclusive content' },
  { id: 'prod_2', name: 'VIP Community', description: 'Join our VIP Discord server' },
  { id: 'prod_3', name: '1-on-1 Coaching', description: 'Personal coaching sessions' },
  { id: 'prod_4', name: 'Masterclass Bundle', description: 'Complete course collection' },
];

export default function SetupPage() {
  const [formData, setFormData] = useState({
    whopProductId: '',
    title: '',
    description: '',
    minimumViewCount: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.whopProductId || !formData.title || !formData.minimumViewCount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - in real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Challenge created successfully!');
      
      // Reset form
      setFormData({
        whopProductId: '',
        title: '',
        description: '',
        minimumViewCount: '',
      });
    } catch {
      toast.error('Failed to create challenge');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-white/70 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">Create Challenge</h1>
            <p className="text-lg text-white/70">
              Set up a new challenge for your Whop product
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Challenge Setup</CardTitle>
              <CardDescription className="text-white/70">
                Configure the challenge parameters and view requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="whopProduct" className="text-white">
                    Whop Product *
                  </Label>
                  <Select 
                    value={formData.whopProductId} 
                    onValueChange={(value) => handleInputChange('whopProductId', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select a Whop product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockWhopProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-white/60">
                    This challenge will be available to members of the selected product
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Challenge Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., 10k Views Club"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what members need to do to complete this challenge..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumViewCount" className="text-white">
                    Minimum View Count *
                  </Label>
                  <Input
                    id="minimumViewCount"
                    type="number"
                    placeholder="10000"
                    value={formData.minimumViewCount}
                    onChange={(e) => handleInputChange('minimumViewCount', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                    min="1"
                  />
                  <p className="text-sm text-white/60">
                    Members must reach this view count to be eligible for approval
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Challenge'}
                  </Button>
                  <Link href="/dashboard">
                    <Button type="button" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <h3 className="text-white font-semibold mb-2">How it works:</h3>
            <ol className="text-white/70 text-sm space-y-1 list-decimal list-inside">
              <li>Members submit their video URLs through the submit page</li>
              <li>When they hit the view goal, they upload analytics proof</li>
              <li>You review submissions with side-by-side video players</li>
              <li>Approved submissions appear in the public gallery</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}