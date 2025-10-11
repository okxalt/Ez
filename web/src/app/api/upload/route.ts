import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getSupabaseServerClient, getPublicUrl } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const supabase = getSupabaseServerClient();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET_NAME || 'analytics';

    // Ensure bucket exists (best-effort)
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = (buckets || []).some((b) => b.name === bucket);
      if (!exists) {
        await supabase.storage.createBucket(bucket, { public: true });
      }
    } catch {}

    // Support both multipart/form-data and raw video binary upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');
      if (!file || typeof file === 'string') {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      const inputFile = file as File;
      const ext = (inputFile.name.split('.').pop() || 'mp4').toLowerCase();
      const path = `${randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, await inputFile.arrayBuffer(), { contentType: inputFile.type || 'video/mp4', upsert: false });
      if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
      const url = getPublicUrl(bucket, path);
      return NextResponse.json({ url }, { status: 201 });
    }

    // Raw body fallback
    const arrayBuffer = await req.arrayBuffer();
    if (!arrayBuffer || (arrayBuffer as ArrayBuffer).byteLength === 0) {
      return NextResponse.json({ error: 'Empty body' }, { status: 400 });
    }
    const path = `${randomUUID()}.mp4`;
    const { error: rawError } = await supabase.storage
      .from(bucket)
      .upload(path, arrayBuffer, { contentType: 'video/mp4', upsert: false });
    if (rawError) return NextResponse.json({ error: rawError.message }, { status: 500 });
    const url = getPublicUrl(bucket, path);
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error('POST /api/upload error', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
