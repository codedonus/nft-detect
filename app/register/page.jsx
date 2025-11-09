'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Button, Upload, Steps, Modal, Alert, Tag, Spin, Row, Col, Image, Divider } from 'antd';
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const steps = [
    {
      title: '提交收藏元数据',
      description: '填写基本信息',
    },
    {
      title: '提交媒体样本',
      description: '上传媒体文件',
    },
    {
      title: '运行原创性判别',
      description: '验证原创性',
    },
  ];

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields(['collectionName', 'contractAddress']);
        setCurrentStep(1);
      } catch (error) {
        console.error('Validation failed:', error);
      }
    } else if (currentStep === 1) {
      if (fileList.length >= 3) {
        setCurrentStep(2);
      } else {
        Modal.warning({
          title: '提示',
          content: '请至少上传3个媒体文件样本',
        });
      }
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleUpload = (info) => {
    setFileList(info.fileList);
  };

  const simulateVerification = async () => {
    setVerificationLoading(true);
    
    try {
      // 准备表单数据
      const formData = new FormData();
      formData.append('collectionName', form.getFieldValue('collectionName'));
      formData.append('description', form.getFieldValue('description') || '');
      formData.append('contractAddress', form.getFieldValue('contractAddress'));
      formData.append('twitterLink', form.getFieldValue('twitterLink') || '');

      // 添加上传的文件
      fileList.forEach((file, index) => {
        if (file.originFileObj) {
          formData.append(`mediaFiles`, file.originFileObj);
        }
      });

      const response = await fetch('/api/register/verify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setVerificationResult({
        success: data.success,
        message: data.message,
        collectionName: data.collectionName || form.getFieldValue('collectionName'),
        originalImage: data.originalImage,
        fakeImage: data.fakeImage,
        originalCollection: data.originalCollection,
        fakeCollection: data.fakeCollection || form.getFieldValue('collectionName'),
        conflicts: data.conflicts || [],
      });
    } catch (error) {
      console.error('Verification failed:', error);
      Modal.error({
        title: '验证失败',
        content: `无法完成验证: ${error.message}`,
      });
    } finally {
      setVerificationLoading(false);
      setResultModalVisible(true);
    }
  };

  const handleFinish = () => {
    setResultModalVisible(false);
    // 重置表单
    form.resetFields();
    setFileList([]);
    setCurrentStep(0);
    setVerificationResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">正版收藏登记</h1>
        <p className="text-gray-600 mt-2 max-w-3xl mx-auto">
          创作者或项目方可提交正版收藏进行登记。系统将提取文本印记(Textual Imprint)和定制化指纹(Tailored Fingerprint)，
          与已登记的正版数据库进行比对，验证原创性。通过验证后，将文本指纹、图片指纹和网络地址录入正版数据库，供未来检测使用
        </p>
      </div>

      <Card className="mx-auto">
        <div className="mb-8">
          <Steps current={currentStep} items={steps} />
        </div>

        <div className="mt-8">
          {/* 步骤 1: 提交收藏元数据 */}
          {currentStep === 0 && (
            <div className="max-w-2xl mx-auto">
              <Form form={form} layout="vertical">
              <Form.Item
                label="收藏品名称"
                name="collectionName"
                rules={[{ required: true, message: '请输入收藏品名称' }]}
              >
                <Input placeholder="例如: Bored Ape Yacht Club" size="large" />
              </Form.Item>

              <Form.Item
                label="收藏品描述/Slogan"
                name="description"
              >
                <TextArea rows={4} placeholder="输入收藏品的描述或标语" />
              </Form.Item>

              <Form.Item
                label="合约地址 (必填)"
                name="contractAddress"
                rules={[
                  { required: true, message: '请输入合约地址' },
                  { pattern: /^0x[a-fA-F0-9]{40}$/, message: '请输入有效的以太坊地址' },
                ]}
              >
                <Input placeholder="0x..." size="large" />
              </Form.Item>

              <Form.Item
                label="官方 X (Twitter) 链接"
                name="twitterLink"
                rules={[
                  { type: 'url', message: '请输入有效的URL' },
                ]}
                extra="用于提取推广文本，生成文本印记(Textual Imprint)"
              >
                <Input placeholder="https://twitter.com/..." size="large" />
              </Form.Item>

              <div className="flex justify-end">
                <Button type="primary" size="large" onClick={handleNext}>
                  下一步
                </Button>
              </div>
              </Form>
            </div>
          )}

          {/* 步骤 2: 提交媒体样本 */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">请上传您收藏中的媒体文件样本 (3-5个)</h3>
                <p className="text-gray-600 text-sm">
                  我们将使用这些样本来创建您收藏的定制化指纹(Tailored Fingerprint)，包括颜色、纹理、构图和内容四个维度的特征。
                  基于NFT收藏内部风格高度一致性的特点，通过提取代表性指纹实现高效的跨收藏比对
                </p>
              </div>

              <Upload
                fileList={fileList}
                onChange={handleUpload}
                beforeUpload={() => false}
                multiple
                maxCount={5}
                listType="picture-card"
              >
                {fileList.length < 5 && (
                  <div>
                    <UploadOutlined />
                    <div className="mt-2">上传</div>
                  </div>
                )}
              </Upload>

              <div className="flex justify-between mt-6">
                <Button onClick={handlePrev}>上一步</Button>
                <Button type="primary" size="large" onClick={handleNext}>
                  下一步
                </Button>
              </div>
            </div>
          )}

          {/* 步骤 3: 运行原创性判别 */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-4">开始验证原创性</h3>
                <p className="text-gray-600 mb-6">
                  系统将提取您收藏的文本印记(Textual Imprint)和定制化指纹(Tailored Fingerprint)，
                  与已登记的正版数据库进行比对，检测是否存在文本冲突(PCF)或视觉冲突(ACV)
                </p>

                {verificationLoading ? (
                  <div className="space-y-4">
                    <Spin size="large" />
                    <p className="text-gray-600">
                      正在将您的收藏与 102 个已登记的正版收藏进行比对...
                    </p>
                  </div>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={simulateVerification}
                    icon={<CheckCircleOutlined />}
                  >
                    开始验证原创性
                  </Button>
                )}
              </div>

              <div className="flex justify-start mt-6">
                <Button onClick={handlePrev}>上一步</Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 结果 Modal */}
      <Modal
        title={verificationResult?.success ? '验证成功' : '验证失败'}
        open={resultModalVisible}
        onCancel={handleFinish}
        footer={[
          <Button key="close" type="primary" onClick={handleFinish}>
            {verificationResult?.success ? '完成' : '我知道了'}
          </Button>,
        ]}
        width={verificationResult?.success ? 600 : 900}
      >
        {verificationResult && (
          <div className="space-y-4">
            {verificationResult.success ? (
              <>
                <Alert
                  message={verificationResult.message}
                  type="success"
                  showIcon
                  icon={<CheckCircleOutlined />}
                />
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-gray-700">
                    您的收藏 <strong>{verificationResult.collectionName}</strong> 已成功登记并受到保护！
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    系统已将该收藏的文本指纹、图片指纹和网络地址正式写入"正版数据库"。
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* 图片对比 */}
                {verificationResult.originalImage && verificationResult.fakeImage && (
                  <>
                    <div className="mb-4">
                      <h4 className="text-base font-semibold mb-4 text-center">对比分析</h4>
                      <Row gutter={24}>
                        <Col span={12}>
                          <div className="text-center">
                            <div className="bg-gray-50 rounded-lg p-2 mb-2">
                              <Image
                                src={verificationResult.originalImage}
                                alt="已登记正版"
                                className="rounded"
                                style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                                preview={false}
                              />
                            </div>
                            <Tag color="green" className="text-sm mb-1">已登记正版</Tag>
                            <p className="text-xs text-gray-600 mt-1">{verificationResult.originalCollection || '正版收藏'}</p>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="text-center">
                            <div className="bg-gray-50 rounded-lg p-2 mb-2">
                              <Image
                                src={verificationResult.fakeImage}
                                alt="您提交的NFT"
                                className="rounded"
                                style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                                preview={false}
                              />
                            </div>
                            <Tag color="red" className="text-sm mb-1">您提交的</Tag>
                            <p className="text-xs text-gray-600 mt-1">{verificationResult.fakeCollection || '检测的NFT'}</p>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <Divider />
                  </>
                )}

                <Alert
                  message={verificationResult.message}
                  type="error"
                  showIcon
                  icon={<CloseCircleOutlined />}
                />
                <div className="space-y-3">
                  {verificationResult.conflicts?.map((conflict, index) => (
                    <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag color="red">{conflict.type} {conflict.type === 'PCF' ? '文本冲突' : '视觉冲突'}</Tag>
                      </div>
                      <p className="text-gray-700 text-sm">{conflict.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RegisterPage;

