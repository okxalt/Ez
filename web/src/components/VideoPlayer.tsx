'use client';

import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full bg-black text-white">Loading video...</div>
});

interface VideoPlayerProps {
  url: string;
  width?: string;
  height?: string;
  controls?: boolean;
}

export default function VideoPlayer({ url, width = "100%", height = "100%", controls = true }: VideoPlayerProps) {
  return (
    <ReactPlayer
      url={url}
      width={width}
      height={height}
      controls={controls}
    />
  );
}