import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { put } from '@vercel/blob';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Support both multipart/form-data and raw video binary upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');
      if (!file || typeof file === 'string') {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      const ext = ((file as File).name.split('.').pop() || 'mp4').toLowerCase();
      const key = `analytics/${randomUUID()}.${ext}`;
      try {
        if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Missing BLOB_READ_WRITE_TOKEN');
        const blob = await put(key, await (file as File).arrayBuffer(), {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return NextResponse.json({ url: blob.url }, { status: 201 });
      } catch (err) {
        // Fallback to local write (dev only)
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
        const fileName = `${randomUUID()}.${ext}`;
        const filePath = path.join(uploadsDir, fileName);
        const arrayBuffer = await (file as File).arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));
        return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 201 });
      }
    }

    // Raw body fallback
    const arrayBuffer = await req.arrayBuffer();
    if (!arrayBuffer || (arrayBuffer as ArrayBuffer).byteLength === 0) {
      return NextResponse.json({ error: 'Empty body' }, { status: 400 });
    }
    const key = `analytics/${randomUUID()}.mp4`;
    try {
      if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Missing BLOB_READ_WRITE_TOKEN');
      const blob = await put(key, arrayBuffer, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN });
      return NextResponse.json({ url: blob.url }, { status: 201 });
    } catch (err) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const fileName = `${randomUUID()}.mp4`;
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 201 });
    }
  } catch (error) {
    console.error('POST /api/upload error', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
