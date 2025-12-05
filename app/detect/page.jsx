'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Upload, Spin, Modal, Tag, Divider, Alert, Row, Col, Image, message } from 'antd';
import { SearchOutlined, UploadOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const DetectPage = () => {
  const [loading, setLoading] = useState(false);
  const [nftName, setNftName] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [fileList, setFileList] = useState([]);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [mediaUrlError, setMediaUrlError] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [contractAddressError, setContractAddressError] = useState('');

  // 以太坊地址正则：0x + 40个十六进制字符
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;

  // 纯函数：检查地址格式是否正确
  const isValidContractAddress = (address) => {
    if (!address) return false;
    return ethereumAddressRegex.test(address);
  };

  const validateContractAddress = (address) => {
    if (!address) {
      setContractAddressError('');
      return false;
    }
    if (!ethereumAddressRegex.test(address)) {
      setContractAddressError('请输入有效的以太坊合约地址（0x + 40个十六进制字符）');
      return false;
    }
    setContractAddressError('');
    return true;
  };

  const handleContractAddressChange = (e) => {
    const value = e.target.value;
    setContractAddress(value);
    validateContractAddress(value);
  };

  // 检查是否可以开始检测：名称、合约地址（且格式正确）、媒体URL（格式正确）或上传文件（二选一）
  const canStartDetection = () => {
    const hasValidUrl = mediaUrl.trim() && isValidMediaUrl(mediaUrl);
    const hasFile = fileList.length > 0 && fileList[0].originFileObj;
    // 互斥：URL 与 文件不可同时存在
    const hasMedia = (hasValidUrl && !hasFile) || (hasFile && !mediaUrl.trim());
    return nftName.trim() && contractAddress.trim() && isValidContractAddress(contractAddress) && hasMedia && !mediaUrlError;
  };

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

  const handleMediaUrlChange = (e) => {
    const value = e.target.value;
    setMediaUrl(value);
    // URL 模式：清空上传
    if (value) {
      if (uploadedImageUrl && uploadedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedImageUrl);
      }
      setUploadedImageUrl('');
      setFileList([]);
    }
    if (value && !isValidMediaUrl(value)) {
      setMediaUrlError('请输入有效的媒体URL（图片或视频）');
    } else {
      setMediaUrlError('');
    }
  };

  // 清理ObjectURL，避免内存泄漏
  useEffect(() => {
    return () => {
      if (uploadedImageUrl && uploadedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedImageUrl);
      }
    };
  }, [uploadedImageUrl]);

  const handleUpload = (info) => {
    // 上传模式：清空 URL
    setMediaUrl('');
    setMediaUrlError('');

    // 清理之前的URL
    if (uploadedImageUrl && uploadedImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedImageUrl);
    }

    setFileList(info.fileList);
    // 如果有上传的文件，创建预览URL
    if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
      const file = info.fileList[0].originFileObj;
      // 检查文件类型
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setUploadedImageUrl(url);
      } else {
        setUploadedImageUrl('');
        messageApi.warning('请上传图片或视频文件');
      }
    } else {
      setUploadedImageUrl('');
    }
  };

  const simulateDetection = async () => {
    // 再次验证合约地址格式
    if (!validateContractAddress(contractAddress)) {
      messageApi.error('请检查合约地址格式');
      return;
    }

    // 验证媒体URL
    if (mediaUrl && !isValidMediaUrl(mediaUrl)) {
      messageApi.error('请输入有效的媒体URL（图片或视频）');
      return;
    }

    setLoading(true);
    const hideMessage = messageApi.loading('正在运行检测模型，请稍候...', 0);
    
    try {
      // 准备表单数据
      const formData = new FormData();
      formData.append('nftName', nftName);
      formData.append('contractAddress', contractAddress);
      formData.append('mediaUrl', mediaUrl);
      const detectionMode = fileList.length > 0 ? 'upload' : 'url';
      formData.append('detectionMode', detectionMode);

      // 添加上传的文件
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('mediaFile', fileList[0].originFileObj);
      }

      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `HTTP错误! 状态码: ${response.status}`;
        try {
          const cloned = response.clone();
          const errorData = await cloned.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (eJson) {
          try {
            const text = await response.text();
            if (text) {
              errorMessage = text;
            }
          } catch (eText) {
            console.error('无法解析错误响应:', eJson, eText);
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // 确定使用的图片：如果后端返回 'UPLOADED_FILE'，使用上传文件的预览URL
      // 否则使用后端返回的URL或默认图片
      const userImage = data.fakeImage === 'UPLOADED_FILE' 
        ? (uploadedImageUrl || mediaUrl || '/detect_2.png')
        : (data.fakeImage || uploadedImageUrl || mediaUrl || '/detect_2.png');
      
      setDetectionResult({
        overallStatus: data.overallStatus,
        overallStatusText: data.overallStatusText,
        originalImage: data.originalImage,
        fakeImage: userImage, // 使用用户上传的图片
        originalCollection: data.originalCollection,
        fakeCollection: data.fakeCollection || nftName,
        pcfResult: data.pcfResult,
        acvResult: data.acvResult,
        conclusion: data.conclusion,
      });
      
      setResultModalVisible(true);
    } catch (error) {
      console.error('Detection failed:', error);
      hideMessage();
      messageApi.error(error.message || '检测失败，请稍后重试');
    } finally {
      hideMessage();
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'confirmed_fake':
        return <Tag color="red" icon={<CloseCircleOutlined />}>❌ 已确认伪造品</Tag>;
      case 'highly_suspicious':
        return <Tag color="orange" icon={<WarningOutlined />}>⚠️ 高度可疑</Tag>;
      case 'no_match':
        return <Tag color="green" icon={<CheckCircleOutlined />}>✅ 未发现匹配</Tag>;
      default:
        return null;
    }
  };

  const getPCFStatusTag = (status) => {
    switch (status) {
      case 'high_risk':
        return <Tag color="orange" icon={<WarningOutlined />}>⚠️ 高风险</Tag>;
      case 'low_risk':
        return <Tag color="green">✅ 低风险</Tag>;
      default:
        return null;
    }
  };

  const getACVStatusTag = (status) => {
    switch (status) {
      case 'matched_fake':
        return <Tag color="red" icon={<CloseCircleOutlined />}>❌ 匹配伪造品</Tag>;
      case 'no_match':
        return <Tag color="green" icon={<CheckCircleOutlined />}>✅ 未匹配</Tag>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {contextHolder}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">单个 NFT 检测</h1>
        <p className="text-gray-600 mt-2">
          采用两阶段检测框架：首先通过被动文本过滤器(PCF)评估文本风险评分β，识别可能误导消费者的文本特征；
          然后通过主动视觉验证器(ACV)生成定制化指纹进行视觉验证，实现92%文本检测准确率和88%视觉验证准确率
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. 粘贴NFT的名称 (用于PCF文本风险评估):
            </label>
            <Input
              rows={4}
              placeholder="例如: Bored Ape"
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. 粘贴NFT的合约地址:
            </label>
            <Input
              placeholder="例如: 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
              value={contractAddress}
              onChange={handleContractAddressChange}
              status={contractAddressError ? 'error' : ''}
            />
            {contractAddressError && (
              <div className="text-red-500 text-sm mt-1">{contractAddressError}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. 粘贴媒体 URL (图片/视频) 或上传文件 (用于ACV视觉指纹验证):
            </label>
            <div className="flex flex-col gap-3">
              <div>
                <Input
                  placeholder="https://example.com/nft-image.png"
                  value={mediaUrl}
              onChange={handleMediaUrlChange}
                  status={mediaUrlError ? 'error' : ''}
              disabled={fileList.length > 0}
                />
                {mediaUrlError && (
                  <div className="text-red-500 text-sm mt-1">{mediaUrlError}</div>
                )}
              </div>
              <Upload
                fileList={fileList}
                onChange={handleUpload}
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*,video/*"
            disabled={!!mediaUrl.trim()}
              >
                <Button icon={<UploadOutlined />}>上传文件</Button>
              </Upload>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={simulateDetection}
              loading={loading}
              disabled={!canStartDetection()}
            >
              开始检测
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        title="检测结果报告"
        open={resultModalVisible}
        onCancel={() => setResultModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setResultModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={900}
      >
        {detectionResult && (
          <div className="space-y-6">
            {/* 图片对比 - 仅在确认伪造品或高度可疑时显示 */}
            {(detectionResult.overallStatus === 'confirmed_fake' || detectionResult.overallStatus === 'highly_suspicious') && 
             detectionResult.originalImage && detectionResult.fakeImage && (
              <>
                <div className="mb-4">
                  <h4 className="text-base font-semibold mb-4 text-center">对比分析</h4>
                  <Row gutter={24}>
                    <Col span={12}>
                      <div className="text-center">
                        <div className="bg-gray-50 rounded-lg p-2 mb-2">
                          <Image
                            src={detectionResult.originalImage}
                            alt="正版NFT"
                            className="rounded"
                            style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                            preview={false}
                          />
                        </div>
                        <Tag color="green" className="text-sm mb-1">正版</Tag>
                        <p className="text-xs text-gray-600 mt-1">{detectionResult.originalCollection || '正版收藏'}</p>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="text-center">
                        <div className="bg-gray-50 rounded-lg p-2 mb-2">
                          <Image
                            src={detectionResult.fakeImage}
                            alt="伪造品NFT"
                            className="rounded"
                            style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                            preview={false}
                          />
                        </div>
                        <Tag color="red" className="text-sm mb-1">伪造品</Tag>
                        <p className="text-xs text-gray-600 mt-1">{detectionResult.fakeCollection || '检测的NFT'}</p>
                      </div>
                    </Col>
                  </Row>
                </div>
                <Divider />
              </>
            )}

            {/* 总览状态 */}
            <div className="text-center py-4">
              <div className="text-2xl font-bold mb-2">
                {getStatusTag(detectionResult.overallStatus)}
              </div>
              <p className="text-gray-600">{detectionResult.overallStatusText}</p>
            </div>

            <Divider />

            {/* PCF 结果 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">模块 1: 被动文本过滤器 (PCF) 结果</h3>
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium">状态:</span>
                  {getPCFStatusTag(detectionResult.pcfResult.status)}
                </div>
                <div>
                  <span className="font-medium">文本风险评分 (β):</span>
                  <span className="ml-2 text-lg font-bold text-orange-600">
                    {detectionResult.pcfResult.riskScore}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    (阈值: β≥0.65 为高风险)
                  </span>
                </div>
                <div>
                  <span className="font-medium">分析:</span>
                  <p className="mt-1 text-gray-700">{detectionResult.pcfResult.analysis}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    PCF通过分析文本印记(Textual Imprint)，基于独特性、熟悉度和要点痕迹保留等认知心理学原理，
                    计算文本风险评分β。系统准确率达到92%。
                  </p>
                </div>
              </div>
            </div>

            {/* ACV 结果 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">模块 2: 主动视觉验证器 (ACV) 结果</h3>
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium">状态:</span>
                  {getACVStatusTag(detectionResult.acvResult.status)}
                </div>
                <div>
                  <span className="font-medium">定制化指纹匹配:</span>
                  <span className="ml-2">
                    {detectionResult.acvResult.fingerprintMatch ? '匹配' : '不匹配'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">分析:</span>
                  <p className="mt-1 text-gray-700">{detectionResult.acvResult.analysis}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    ACV通过提取定制化指纹(Tailored Fingerprint)，包括颜色、纹理、构图和内容四个维度特征，
                    利用NFT收藏内部风格高度一致性的特点进行比对。系统准确率达到88%，查询时间约38ms。
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            {/* 最终结论 */}
            <Alert
              message="最终结论"
              description={detectionResult.conclusion}
              type={detectionResult.overallStatus === 'confirmed_fake' ? 'error' : 'warning'}
              showIcon
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DetectPage;

