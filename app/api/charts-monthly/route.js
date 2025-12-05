import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function GET(request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase 未正确配置' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month') || '2025-11'; // 默认当前月份

  try {
    // 如果 month 是 'average'，返回所有月份的平均值
    if (month === 'average') {
      // 获取所有攻击向量数据并计算平均值
      const { data: allAttackVectors, error: attackError } = await supabase
        .from('attack_vectors_monthly')
        .select('label, value');

      if (attackError) {
        console.error('[charts-monthly API] 查询攻击向量失败:', attackError);
      }

      // 计算每个 label 的平均值
      const attackVectorsMap = new Map();
      if (allAttackVectors) {
        allAttackVectors.forEach((item) => {
          if (!attackVectorsMap.has(item.label)) {
            attackVectorsMap.set(item.label, []);
          }
          attackVectorsMap.get(item.label).push(item.value);
        });
      }

      const attackVectors = Array.from(attackVectorsMap.entries()).map(([label, values]) => {
        const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
        return { label, value: avg };
      }).sort((a, b) => b.value - a.value);

      // 获取所有用户发现来源数据并计算平均值
      const { data: allDiscoverySources, error: discoveryError } = await supabase
        .from('discovery_sources_monthly')
        .select('platform, direct, organic, outside, others');

      if (discoveryError) {
        console.error('[charts-monthly API] 查询发现来源失败:', discoveryError);
      }

      // 计算每个 platform 的平均值
      const discoverySourcesMap = new Map();
      if (allDiscoverySources) {
        allDiscoverySources.forEach((item) => {
          if (!discoverySourcesMap.has(item.platform)) {
            discoverySourcesMap.set(item.platform, {
              direct: [],
              organic: [],
              outside: [],
              others: [],
            });
          }
          discoverySourcesMap.get(item.platform).direct.push(item.direct);
          discoverySourcesMap.get(item.platform).organic.push(item.organic);
          discoverySourcesMap.get(item.platform).outside.push(item.outside);
          discoverySourcesMap.get(item.platform).others.push(item.others);
        });
      }

      const discoverySources = Array.from(discoverySourcesMap.entries()).map(([platform, values]) => {
        const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
        return {
          platform,
          direct: parseFloat(avg(values.direct).toFixed(4)),
          organic: parseFloat(avg(values.organic).toFixed(4)),
          outside: parseFloat(avg(values.outside).toFixed(4)),
          others: parseFloat(avg(values.others).toFixed(4)),
        };
      }).sort((a, b) => a.platform.localeCompare(b.platform));

      return NextResponse.json({
        attackVectors,
        discoverySources,
      });
    }

    // 获取指定月份的数据
    const { data: attackVectors, error: attackError } = await supabase
      .from('attack_vectors_monthly')
      .select('label, value')
      .eq('month', month)
      .order('value', { ascending: false });

    if (attackError) {
      console.error('[charts-monthly API] 查询攻击向量失败:', attackError);
    }

    const { data: discoverySources, error: discoveryError } = await supabase
      .from('discovery_sources_monthly')
      .select('platform, direct, organic, outside, others')
      .eq('month', month)
      .order('platform');

    if (discoveryError) {
      console.error('[charts-monthly API] 查询发现来源失败:', discoveryError);
    }

    return NextResponse.json({
      attackVectors: attackVectors || [],
      discoverySources: discoverySources || [],
    });
  } catch (err) {
    console.error('[charts-monthly API] 错误:', err);
    return NextResponse.json(
      { error: 'Failed to load monthly chart data.' },
      { status: 500 }
    );
  }
}

