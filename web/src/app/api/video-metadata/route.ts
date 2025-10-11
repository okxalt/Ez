import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    const urlObj = new URL(url);
    const supportedDomains = ['www.instagram.com', 'www.tiktok.com', 'www.youtube.com'];
    
    if (!supportedDomains.some(domain => urlObj.hostname.includes(domain))) {
      return NextResponse.json(
        { error: 'Unsupported platform. Please provide Instagram Reel, TikTok, or YouTube Short URL.' },
        { status: 400 }
      );
    }

    // Use noembed.com for oEmbed data
    const oEmbedUrl = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(oEmbedUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video metadata');
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: 'Failed to fetch video metadata. Please check the URL.' },
        { status: 400 }
      );
    }

    // Extract relevant metadata
    const metadata = {
      title: data.title || 'Untitled Video',
      thumbnailUrl: data.thumbnail_url || null,
      authorName: data.author_name || null,
      provider: data.provider_name || null,
      html: data.html || null,
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video metadata' },
      { status: 500 }
    );
  }
}