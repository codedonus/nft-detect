import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase 未正确配置' },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from('fake')
    .select('id, nft_name, contract_address, token_id, image_url')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('[fake API] 查询失败:', error);
    return NextResponse.json(
      { error: 'Failed to load fake data.' },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}

