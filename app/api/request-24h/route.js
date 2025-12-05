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
    .from('request_24h')
    .select('id, nft_name, contract_address, token_id, image_url')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('[request_24h API] 查询失败:', error);
    return NextResponse.json(
      { error: 'Failed to load request_24h data.' },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}

