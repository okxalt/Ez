import { NextRequest, NextResponse } from 'next/server';
import { createWriteStream, promises as fs } from 'node:fs';
import { randomUUID } from 'node:crypto';
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
      const arrayBuffer = await (file as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = path.extname((file as File).name) || '.mp4';
      const fileName = `${randomUUID()}${ext}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      await fs.writeFile(filePath, buffer);
      return NextResponse.json({ path: `/uploads/${fileName}` }, { status: 201 });
    }

    // Raw body fallback
    const arrayBuffer = await req.arrayBuffer();
    if (!arrayBuffer || (arrayBuffer as ArrayBuffer).byteLength === 0) {
      return NextResponse.json({ error: 'Empty body' }, { status: 400 });
    }
    const fileName = `${randomUUID()}.mp4`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    return NextResponse.json({ path: `/uploads/${fileName}` }, { status: 201 });
  } catch (error) {
    console.error('POST /api/upload error', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
