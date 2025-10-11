import { createClient } from '@supabase/supabase-js';

export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Supabase environment not configured');
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export function getPublicUrl(bucket: string, path: string): string {
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // Fallback: construct standard public URL shape if RLS allows public
    return `${url}/storage/v1/object/public/${bucket}/${path}`;
  }
  const client = createClient(url, anon, { auth: { persistSession: false } });
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
