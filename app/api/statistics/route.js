import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 从环境变量中读取 Supabase 配置
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // 在开发阶段明确提示配置问题
  console.warn(
    '[statistics API] SUPABASE_URL 或 SUPABASE_ANON_KEY 未配置，将导致请求失败。'
  );
}

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase 未正确配置，请设置 SUPABASE_URL 和 SUPABASE_ANON_KEY 环境变量。' },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from('overall')
    .select('*')
    .single();

  if (error) {
    console.error('[statistics API] 查询 overall 表失败:', error);
    return NextResponse.json(
      { error: 'Failed to load overall statistics from Supabase.' },
      { status: 500 }
    );
  }

  const responseData = {
    registeredCollections: data.registered_collections ?? 0,
    indexedFakes: data.indexed_fakes ?? 0,
    processedRequests24h: data.processed_requests_24h ?? 0,
    interceptedHighRisk24h: data.intercepted_high_risk_24h ?? 0,
    charts: {
      attackVectors: data.attack_vectors ?? [],
      discoverySources: data.discovery_sources ?? [],
      betaVictims: data.beta_victims ?? [],
    },
  };

  return NextResponse.json(responseData);
}

