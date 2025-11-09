'use client';

import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Spin } from 'antd';
import { BarChartOutlined, FileTextOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Image from 'next/image';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    registeredCollections: 102,
    indexedFakes: 12221,
    processedRequests24h: 0,
    interceptedHighRisk24h: 0,
  });

  useEffect(() => {
    // 模拟加载数据
    const timer = setTimeout(() => {
      setStats({
        registeredCollections: 102,
        indexedFakes: 12221,
        processedRequests24h: 1847,
        interceptedHighRisk24h: 342,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">全局数据分析</h1>
        <p className="text-gray-600 mt-2">
          基于大规模实证研究，展示NFT伪造品市场的威胁情报。数据来源于102个正版收藏和12,221个伪造品收藏的分析，
          涵盖701,858张图片和23,682个视频，以及超过540万笔交易记录
        </p>
      </div>

      {/* Widget 4: 实时数据 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已登记正版收藏"
              value={stats.registeredCollections}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已索引伪造品"
              value={stats.indexedFakes}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已处理检测请求 (24h)"
              value={stats.processedRequests24h}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已拦截高风险 NFT (24h)"
              value={stats.interceptedHighRisk24h}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Widget 1: 伪造品的主要攻击向量 */}
      <Card title="伪造品的主要攻击向量" className="mb-6">
        <div className="flex justify-center items-center mb-4">
          <Image
            src="/copy_paradigm.png"
            alt="伪造品的主要攻击向量"
            width={800}
            height={400}
            className="object-contain"
          />
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>洞察：</strong>实证研究发现，在通过视觉复制(Art Counterfeit)创建的伪造品中，98%同时结合了文本模仿(Str Counterfeit)，
            包括克隆名称、描述或标签结构。这表明文本伪造不仅是普遍的，而且与视觉模仿具有协同效应，是欺诈的重要组成部分。
          </p>
        </div>
      </Card>

      {/* Widget 2: 用户如何发现 NFT? */}
      <Card title="用户如何发现 NFT?" className="mb-6">
        <div className="flex justify-center items-center mb-4">
          <Image
            src="/source.png"
            alt="用户如何发现 NFT"
            width={800}
            height={400}
            className="object-contain"
          />
        </div>
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>洞察：</strong>根据Similarweb数据，超过86%的用户通过直接访问平台域名来访问NFT市场，而只有约11%通过外部链接访问特定NFT页面。
            这表明用户主要通过内部搜索和推荐系统导航NFT市场，强调了文本信息在资产发现和消费者欺诈中的核心作用。
          </p>
        </div>
      </Card>

      {/* Widget 3: 文本风险评分与受害者数量关系 */}
      <Card title="文本风险评分 (β) 与受害者数量的关系" className="mb-6">
        <div className="flex justify-center items-center mb-4">
          <Image
            src="/victim.png"
            alt="文本风险评分与受害者数量关系"
            width={800}
            height={400}
            className="object-contain"
          />
        </div>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>洞察：</strong>文本风险评分β与伪造品造成的实际受害者数量呈正相关。评分较高的伪造品(β≈0.5-0.7)对应更严重的受害程度。
            曲线在β≈0.5-0.7附近达到峰值后下降，表明高度相似的伪造品会被平台快速下架，减少后续损害。这证明了PCF风险评分的有效性。
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;

