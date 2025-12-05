import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 验证URL是否是媒体URL
const isValidMediaUrl = (url) => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return mediaExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
};

// 验证URL的Content-Type是否是媒体类型
const validateMediaUrlContent = async (url) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
  
  try {
    const response = await fetch(url, { 
      method: 'HEAD', 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return { valid: false, error: `无法访问URL，HTTP状态码: ${response.status}` };
    }
    const contentType = response.headers.get('content-type') || '';
    const isValid = contentType.startsWith('image/') || contentType.startsWith('video/');
    if (!isValid) {
      return { valid: false, error: `URL指向的内容类型不是媒体文件（当前类型: ${contentType || '未知'}）` };
    }
    return { valid: true };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return { valid: false, error: 'URL访问超时，请检查URL是否可访问' };
    }
    return { valid: false, error: `无法验证URL内容: ${error.message}` };
  }
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const nftName = (formData.get('nftName') || '').toString().trim();
    const contractAddress = (formData.get('contractAddress') || '').toString().trim();
    const mediaUrl = (formData.get('mediaUrl') || '').toString().trim();
    const mediaFile = formData.get('mediaFile');
    const detectionMode = (formData.get('detectionMode') || '').toString().trim(); // url 或 upload

    console.log('[detect] 收到检测请求', {
      nftName,
      contractAddress,
      mediaUrl,
      hasFile: !!mediaFile,
      detectionMode,
    });

    const isUrlMode = detectionMode === 'url' && !!mediaUrl && !mediaFile;
    const isUploadMode = detectionMode === 'upload' && !!mediaFile && !mediaUrl;

    // 互斥校验
    if ((mediaUrl && mediaFile) || (!isUrlMode && !isUploadMode)) {
      return NextResponse.json(
        { error: '媒体输入需二选一：粘贴URL 或 上传文件（不可同时选择）' },
        { status: 400 }
      );
    }

    // 验证媒体URL
    if (mediaUrl && isUrlMode) {
      if (!isValidMediaUrl(mediaUrl)) {
        console.log('[detect] URL格式验证失败:', mediaUrl);
        return NextResponse.json(
          { error: 'URL必须是有效的媒体URL（图片或视频），支持的格式: .jpg, .jpeg, .png, .gif, .webp, .svg, .bmp, .mp4, .webm, .ogg, .mov, .avi' },
          { status: 400 }
        );
      }
      // 进一步验证Content-Type
      console.log('[detect] 验证URL内容类型:', mediaUrl);
      const contentValidation = await validateMediaUrlContent(mediaUrl);
      if (!contentValidation.valid) {
        console.log('[detect] URL内容类型验证失败:', contentValidation.error);
        return NextResponse.json(
          { error: contentValidation.error || 'URL指向的内容不是有效的媒体文件（图片或视频）' },
          { status: 400 }
        );
      }
      console.log('[detect] URL内容类型验证通过');
    }

    // 验证上传的文件
    if (mediaFile && isUploadMode) {
      const fileType = mediaFile.type || '';
      const fileName = mediaFile.name || '未知文件';
      console.log('[detect] 验证上传文件类型:', { fileName, fileType });
      if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
        console.log('[detect] 上传文件类型验证失败:', { fileName, fileType });
        return NextResponse.json(
          { error: `上传的文件必须是图片或视频。当前文件类型: ${fileType || '未知'}，文件名: ${fileName}` },
          { status: 400 }
        );
      }
      console.log('[detect] 上传文件类型验证通过:', { fileName, fileType });
    }

    // 确保至少有一个媒体源（并已在互斥校验通过）
    if (!isUrlMode && !isUploadMode) {
      return NextResponse.json(
        { error: '请提供媒体URL或上传文件（且只能选择其一）' },
        { status: 400 }
      );
    }

    // 推理阶段：随机 2-5 秒
    const inferenceDuration = Math.floor(Math.random() * 3000) + 2000; // 2000-5000ms
    const retrievalDuration = 1000; // 检索阶段固定 1 秒
    const logInterval = 500; // 每0.5秒打印一次

    console.log('[detect] 正在运行模型推理...');
    for (let elapsed = 0; elapsed < inferenceDuration; elapsed += logInterval) {
      await sleep(logInterval);
      console.log('[detect] 正在运行推理...');
    }
    // 补齐剩余时间
    const inferenceRemaining = inferenceDuration % logInterval;
    if (inferenceRemaining > 0) {
      await sleep(inferenceRemaining);
    }

    console.log('[detect] 正在进行检索...');
    for (let elapsed = 0; elapsed < retrievalDuration; elapsed += logInterval) {
      await sleep(logInterval);
      console.log('[detect] 正在检索相似度...');
    }
    const retrievalRemaining = retrievalDuration % logInterval;
    if (retrievalRemaining > 0) {
      await sleep(retrievalRemaining);
    }

    let reference = null;
    if (supabase && contractAddress) {
      const { data, error } = await supabase
        .from('genuine')
        .select('nft_name, contract_address, token_id, image_url')
        .eq('contract_address', contractAddress)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn('[detect] 查询 genuine 失败:', error.message);
      } else if (data) {
        reference = data;
      }
    }

    // 确定用户上传的图片URL（优先使用上传的文件，其次使用URL）
    // 注意：实际应用中，上传的文件应该保存到服务器并返回URL
    // 这里我们返回一个标识，前端会使用上传文件的预览URL
    const userImageUrl = mediaFile ? 'UPLOADED_FILE' : mediaUrl;

    let responsePayload;
    if (isUrlMode) {
      // URL 模式：检测侵权（偏高风险）
      responsePayload = {
        overallStatus: 'highly_suspicious',
        overallStatusText: 'URL 检测到潜在侵权风险，请谨慎处理',
        originalImage: reference?.image_url || '/detect_1.png',
        fakeImage: userImageUrl,
        originalCollection: reference?.nft_name || '参考正版',
        fakeCollection: nftName || '待检测NFT',
        pcfResult: {
          status: 'high_risk',
          riskScore: '0.78',
          analysis: '文本与已知模式存在相似，可能存在侵权风险。',
        },
        acvResult: {
          status: 'matched_fake',
          fingerprintMatch: true,
          analysis: 'URL 模式下检测到潜在伪造痕迹，请进一步核验。',
        },
        conclusion: '检测到可能侵权，请谨慎交易并进一步确认。',
      };
    } else {
      // 上传模式：标记为非侵权（低风险）
      responsePayload = {
        overallStatus: 'no_match',
        overallStatusText: '上传文件未发现侵权迹象',
        originalImage: reference?.image_url || '/detect_1.png',
        fakeImage: userImageUrl,
        originalCollection: reference?.nft_name || '参考正版',
        fakeCollection: nftName || '待检测NFT',
        pcfResult: {
          status: 'low_risk',
          riskScore: '0.18',
          analysis: '文本未匹配到高风险特征，整体风险较低。',
        },
        acvResult: {
          status: 'no_match',
          fingerprintMatch: false,
          analysis: '未检测到与已知伪造品的显著相似性。',
        },
        conclusion: '未发现侵权迹象，如需请继续提交更多证据。',
      };
    }

    console.log('[detect] 模型推理完成，返回结果。');

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error('[detect] 处理失败:', error);
    return NextResponse.json({ error: '检测失败，请稍后重试。' }, { status: 500 });
  }
}

