'use client';

import { useEffect, useState } from 'react';

interface VideoPlayerProps {
  url: string;
  width?: string;
  height?: string;
  controls?: boolean;
}

export default function VideoPlayer({ url, width = "100%", height = "100%", controls = true }: VideoPlayerProps) {
  const [ReactPlayer, setReactPlayer] = useState<any>(null);

  useEffect(() => {
    import('react-player').then((mod) => {
      setReactPlayer(() => mod.default);
    });
  }, []);

  if (!ReactPlayer) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        Loading video...
      </div>
    );
  }

  return (
    <ReactPlayer
      url={url}
      width={width}
      height={height}
      controls={controls}
    />
  );
}