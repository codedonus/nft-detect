import { NextResponse } from 'next/server';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request) {
  try {
    const formData = await request.formData();
    const collectionName = (formData.get('collectionName') || '').toString().trim();
    const description = (formData.get('description') || '').toString().trim();
    const contractAddress = (formData.get('contractAddress') || '').toString().trim();
    const twitterLink = (formData.get('twitterLink') || '').toString().trim();
    const mediaFiles = formData.getAll('mediaFiles');

    if (!collectionName || !contractAddress) {
      return NextResponse.json(
        { error: '收藏品名称与合约地址为必填项' },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      return NextResponse.json(
        { error: '合约地址格式不正确，应为 0x 开头的 40 位十六进制字符串' },
        { status: 400 }
      );
    }

    // 校验媒体文件数量与类型
    if (!mediaFiles || mediaFiles.length === 0) {
      return NextResponse.json(
        { error: '请至少上传 3 个媒体文件样本' },
        { status: 400 }
      );
    }

    const validMedia = mediaFiles.filter((file) => {
      const type = file?.type || '';
      return type.startsWith('image/') || type.startsWith('video/');
    });

    if (validMedia.length < 3) {
      return NextResponse.json(
        { error: '需要至少 3 个图片/视频文件用于生成指纹' },
        { status: 400 }
      );
    }

    // 模拟耗时：指纹生成 1-2s + 冲突检索 1s，日志按 0.5s
    const fingerprintDuration = Math.floor(Math.random() * 1000) + 1000; // 1000-2000ms
    const retrievalDuration = 1000;
    const logInterval = 500;

    console.log('[register/verify] 开始生成指纹...');
    for (let elapsed = 0; elapsed < fingerprintDuration; elapsed += logInterval) {
      await sleep(logInterval);
      console.log('[register/verify] 生成指纹中...');
    }
    const fingerprintRemain = fingerprintDuration % logInterval;
    if (fingerprintRemain > 0) await sleep(fingerprintRemain);

    console.log('[register/verify] 开始检索冲突...');
    for (let elapsed = 0; elapsed < retrievalDuration; elapsed += logInterval) {
      await sleep(logInterval);
      console.log('[register/verify] 冲突检索中...');
    }
    const retrievalRemain = retrievalDuration % logInterval;
    if (retrievalRemain > 0) await sleep(retrievalRemain);

    // 模拟冲突判定：简单规则 + 随机
    const hasTextRisk =
      description.toLowerCase().includes('ape') ||
      collectionName.toLowerCase().includes('ape');
    const randomFlag = Math.random() < 0.4;
    const hasConflict = hasTextRisk || randomFlag;

    if (hasConflict) {
      const conflicts = [
        {
          type: 'PCF',
          description: '检测到文本与已登记收藏高度相似，存在潜在抄袭风险。',
        },
        {
          type: 'ACV',
          description: '部分媒体样本与正版指纹匹配度偏高，请进一步人工复核。',
        },
      ];

      return NextResponse.json({
        success: false,
        message: '检测到潜在文本/视觉冲突，未通过登记。',
        collectionName,
        originalImage: '/detect_1.png',
        fakeImage: 'UPLOADED_FILE', // 前端将用上传的预览替换
        originalCollection: '已登记正版样本',
        fakeCollection: collectionName,
        conflicts,
        twitterLink,
      });
    }

    // 通过登记
    return NextResponse.json({
      success: true,
      message: '原创性验证通过，已登记至正版数据库。',
      collectionName,
      originalImage: '/detect_1.png',
      fakeImage: 'UPLOADED_FILE', // 通过也返回用户上传的预览
      originalCollection: collectionName,
      fakeCollection: collectionName,
      conflicts: [],
      twitterLink,
    });
  } catch (error) {
    console.error('[register/verify] 处理失败:', error);
    return NextResponse.json(
      { error: `验证失败: ${error.message || '服务器错误'}` },
      { status: 500 }
    );
  }
}

