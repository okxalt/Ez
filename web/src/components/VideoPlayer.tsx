"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export function VideoPlayer({ url, controls = true }: { url: string; controls?: boolean }) {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/5">
      <ReactPlayer url={url} width="100%" height="100%" controls={controls} />
    </div>
  );
}
