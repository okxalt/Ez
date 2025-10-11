import { NextRequest } from 'next/server';
import { handleUpload } from '@vercel/blob/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await handleUpload({
    request,
    body,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    onBeforeGenerateToken: async () => ({
      access: 'public',
      maximumSizeInBytes: 250 * 1024 * 1024,
      allowedContentTypes: ['video/*'],
      addRandomSuffix: true,
    }),
  });

  if (result.type === 'blob.generate-client-token') {
    return new Response(JSON.stringify({ type: result.type, clientToken: result.clientToken }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ type: result.type, response: result.response }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
