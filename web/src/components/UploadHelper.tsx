"use client";

import React from 'react';

export function UploadHelp() {
  return (
    <div className="text-sm text-white/70 bg-orange-500/10 border border-orange-400/30 rounded-lg p-3">
      <p><strong>Tip:</strong> Large files upload faster using direct upload. We generate a one-time URL and your browser uploads straight to storage. Supported up to ~250MB on free tier.</p>
    </div>
  );
}
