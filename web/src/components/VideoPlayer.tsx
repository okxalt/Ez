"use client";

import dynamic from 'next/dynamic';
import React from 'react';

type AnyProps = Record<string, unknown>;
const ReactPlayerLazy = dynamic(() => import('react-player'), { ssr: false }) as unknown as React.FC<AnyProps>;

export function VideoPlayer({ url, controls = true }: { url: string; controls?: boolean }) {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/5">
      <ReactPlayerLazy url={url} width="100%" height="100%" controls={controls} />
    </div>
  );
}
