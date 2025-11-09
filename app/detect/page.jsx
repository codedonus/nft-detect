'use client';

import React, { useState } from 'react';
import { Card, Input, Button, Upload, Spin, Modal, Tag, Divider, Alert, Row, Col, Image } from 'antd';
import { SearchOutlined, UploadOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const DetectPage = () => {
  const [loading, setLoading] = useState(false);
  const [nftName, setNftName] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [fileList, setFileList] = useState([]);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);

  const handleUpload = (info) => {
    setFileList(info.fileList);
  };

  const simulateDetection = async () => {
    setLoading(true);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 模拟检测结果
    const mockResult = {
      overallStatus: 'confirmed_fake', // 'confirmed_fake' | 'highly_suspicious' | 'no_match'
      overallStatusText: '已确认伪造品',
      originalImage: '/detect_1.png',
      fakeImage: '/detect_2.png',
      originalCollection: 'Bored Ape Yacht Club',
      fakeCollection: 'Bored Ape 3D',
      pcfResult: {
        status: 'high_risk',
        statusText: '高风险',
        riskScore: 0.85,
        analysis: '输入的文本 "Bored Ape 3D" 与正版库中的 "Bored Ape Yacht Club" (来自 https://opensea.io/collection/boredapeyachtclub) 存在 "部分词语重叠"。',
      },
      acvResult: {
        status: 'matched_fake',
        statusText: '匹配伪造品',
        fingerprintMatch: true,
        analysis: '提供的媒体文件与 "Bored Ape Yacht Club" (来自 https://opensea.io/collection/boredapeyachtclub) 。',
      },
      conclusion: '此 NFT 在文本和视觉上均与已知的正版收藏高度一致，极有可能是伪造品。',
    };

    setDetectionResult(mockResult);
    setLoading(false);
    setResultModalVisible(true);
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
              1. 粘贴NFT的名称或描述 (用于PCF文本风险评估):
            </label>
            <TextArea
              rows={4}
              placeholder="例如: Bored Ape 3D"
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. 粘贴媒体 URL (图片/视频) 或上传文件 (用于ACV视觉指纹验证):
            </label>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="https://example.com/nft-image.png"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
              <Upload
                fileList={fileList}
                onChange={handleUpload}
                beforeUpload={() => false}
                maxCount={1}
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
              disabled={!nftName && !mediaUrl && fileList.length === 0}
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

