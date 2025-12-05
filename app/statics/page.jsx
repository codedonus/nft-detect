'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Statistic, Row, Col, Spin, Button, Modal, List, Avatar, Typography, Select } from 'antd';
import {
  BarChartOutlined,
  FileTextOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import { Chart } from '@antv/g2';

// 伪造品攻击向量 - 简单柱状图
const AttackVectorsChart = ({ data }) => {
  const config = {
    data: data || [],
    xField: 'label',
    yField: 'value',
    height: 360,
    columnWidthRatio: 0.6,
    xAxis: {
      title: {
        text: '伪造策略类型',
      },
      label: {
        autoHide: true,
      },
    },
    yAxis: {
      title: {
        text: '伪造品数量',
      },
    },
    label: {
      position: 'top',
      textBaseline: 'bottom',
      style: {
        fontSize: 12,
      },
      // 兼容不同版本的 Column：有的传整行数据，有的直接传数值
      formatter: (item) => {
        if (item && typeof item === 'object') {
          const v = item.value ?? item.y ?? item.val;
          return v != null ? `${v}` : '';
        }
        return item != null ? `${item}` : '';
      },
    },
    // 使用默认 tooltip 行为：hover 时展示 label + 数值
    tooltip: {},
  };
  return <Column {...config} />;
};

// 用户发现 NFT 的来源 - 分组柱状图（按平台分组）
const DiscoverySourcesChart = ({ data }) => {
  const raw = data || [];
  const transformed = raw.flatMap((d) => [
    { platform: d.platform, type: '直接搜索', key: 'direct', value: d.direct },
    { platform: d.platform, type: '自然搜索', key: 'organic', value: d.organic },
    { platform: d.platform, type: '站外引流', key: 'outside', value: d.outside },
    { platform: d.platform, type: '其他路径', key: 'others', value: d.others },
  ]).filter((d) => d.value != null);

  const config = {
    data: transformed,
    xField: 'platform',
    yField: 'value',
    colorField: 'type',
    group: {
      padding: 0,
    },
    height: 360,
    color: ['#4c6ef5', '#22c55e', '#f97316', '#a855f7'],
    xAxis: {
      title: {
        text: 'NFT 市场',
      },
      label: {
        autoHide: true,
      },
    },
    yAxis: {
      title: {
        text: '访问比例',
      },
      max: 1,
      min: 0,
    },
    legend: {
      position: 'top',
    },
  };

  return <Column {...config} />;
};

// 文本风险评分 β 与受害者数量 - 50%/95% 双层区间 + 平滑中位数曲线（使用 G2 自定义）
const BetaVictimsChart = ({ data }) => {
  const source = data || [];
  if (!source.length) return null;

  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 销毁旧实例，避免重复渲染
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 360,
    });

    chart.options({
      type: 'view',
      data: source,
      axis: {
        x: {
          title: '文本风险评分 β',
          tick: { tickCount: 6 },
        },
        y: {
          title: '受害者数量',
        },
      },
      tooltip: { shared: true },
      children: [
        // 95% 区间带（最浅）
        {
          type: 'area',
          encode: {
            x: 'x',
            y: ['lo95_boot', 'hi95_boot'],
          },
          style: {
            fill: '#9ec5ff',
            fillOpacity: 0.22,
          },
          shapeField: 'smooth',
        },
        // 50% 区间带（更深）
        {
          type: 'area',
          encode: {
            x: 'x',
            y: ['lo50_boot', 'hi50_boot'],
          },
          style: {
            fill: '#5f9be3',
            fillOpacity: 0.32,
          },
          shapeField: 'smooth',
        },
        // 中位数平滑曲线
        {
          type: 'line',
          encode: {
            x: 'x',
            y: 'mu_boot_median',
          },
          style: {
            stroke: '#166534',
            lineWidth: 3,
          },
          shapeField: 'smooth',
        },
        // 中位数上的点
        // {
        //   type: 'point',
        //   encode: {
        //     x: 'x',
        //     y: 'mu_boot_median',
        //   },
        //   style: {
        //     r: 2,
        //     fill: '#166534',
        //     stroke: '#166534',
        //   },
        // },
      ],
    });

    chart.render();
    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [source]);

  return <div ref={containerRef} className="w-full h-[360px]" />;
};

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    registeredCollections: 0,
    indexedFakes: 0,
    processedRequests24h: 0,
    interceptedHighRisk24h: 0,
  });
  const [charts, setCharts] = useState({
    attackVectors: [],
    discoverySources: [],
    betaVictims: [],
  });

  // Modal 相关 state
  const [genuineModalOpen, setGenuineModalOpen] = useState(false);
  const [fakeModalOpen, setFakeModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [interceptModalOpen, setInterceptModalOpen] = useState(false);

  const [genuineData, setGenuineData] = useState([]);
  const [fakeData, setFakeData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [interceptData, setInterceptData] = useState([]);

  const [genuineLoading, setGenuineLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [interceptLoading, setInterceptLoading] = useState(false);

  // 月份选择器相关 state
  const [selectedMonth, setSelectedMonth] = useState('average'); // 默认显示综合平均
  const [monthlyChartsLoading, setMonthlyChartsLoading] = useState(false);
  
  // 生成月份选项（综合平均 + 2024-12 到 2025-11）
  const monthOptions = [
    { value: 'average', label: '综合平均' },
  ];
  for (let year = 2024; year <= 2025; year++) {
    const startMonth = year === 2024 ? 12 : 1;
    const endMonth = year === 2025 ? 11 : 12;
    for (let month = startMonth; month <= endMonth; month++) {
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      const monthLabel = `${year}年${month}月`;
      monthOptions.push({ value: monthStr, label: monthLabel });
    }
  }

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/statistics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStats({
          registeredCollections: data.registeredCollections || 0,
          indexedFakes: data.indexedFakes || 0,
          processedRequests24h: data.processedRequests24h || 0,
          interceptedHighRisk24h: data.interceptedHighRisk24h || 0,
        });
        if (data.charts) {
          setCharts({
            attackVectors: data.charts.attackVectors || [],
            discoverySources: data.charts.discoverySources || [],
            betaVictims: data.charts.betaVictims || [],
          });
        }
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
    // 初始加载时获取综合平均数据
    fetchMonthlyCharts('average');
  }, []);

  // 获取月度图表数据
  const fetchMonthlyCharts = async (month) => {
    setMonthlyChartsLoading(true);
    try {
      const response = await fetch(`/api/charts-monthly?month=${month}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCharts((prev) => ({
        ...prev,
        attackVectors: data.attackVectors || prev.attackVectors,
        discoverySources: data.discoverySources || prev.discoverySources,
      }));
    } catch (err) {
      console.error('Failed to fetch monthly charts:', err);
    } finally {
      setMonthlyChartsLoading(false);
    }
  };

  // 月份选择器变化处理
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    fetchMonthlyCharts(month);
  };

  // 获取各表数据的函数
  const fetchGenuineData = async () => {
    setGenuineLoading(true);
    try {
      const response = await fetch('/api/genuine');
      const data = await response.json();
      setGenuineData(data || []);
    } catch (err) {
      console.error('Failed to fetch genuine data:', err);
    } finally {
      setGenuineLoading(false);
    }
  };

  const fetchFakeData = async () => {
    setFakeLoading(true);
    try {
      const response = await fetch('/api/fake');
      const data = await response.json();
      setFakeData(data || []);
    } catch (err) {
      console.error('Failed to fetch fake data:', err);
    } finally {
      setFakeLoading(false);
    }
  };

  const fetchRequestData = async () => {
    setRequestLoading(true);
    try {
      const response = await fetch('/api/request-24h');
      const data = await response.json();
      setRequestData(data || []);
    } catch (err) {
      console.error('Failed to fetch request data:', err);
    } finally {
      setRequestLoading(false);
    }
  };

  const fetchInterceptData = async () => {
    setInterceptLoading(true);
    try {
      const response = await fetch('/api/intercept-24h');
      const data = await response.json();
      setInterceptData(data || []);
    } catch (err) {
      console.error('Failed to fetch intercept data:', err);
    } finally {
      setInterceptLoading(false);
    }
  };

  // Modal 打开时的处理
  const handleGenuineClick = () => {
    setGenuineModalOpen(true);
    if (genuineData.length === 0) {
      fetchGenuineData();
    }
  };

  const handleFakeClick = () => {
    setFakeModalOpen(true);
    if (fakeData.length === 0) {
      fetchFakeData();
    }
  };

  const handleRequestClick = () => {
    setRequestModalOpen(true);
    if (requestData.length === 0) {
      fetchRequestData();
    }
  };

  const handleInterceptClick = () => {
    setInterceptModalOpen(true);
    if (interceptData.length === 0) {
      fetchInterceptData();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">加载数据失败: {error}</p>
          <Button onClick={() => window.location.reload()}>重试</Button>
        </div>
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
          <Card
            hoverable
            onClick={handleGenuineClick}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="已登记正版收藏"
              value={stats.registeredCollections}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={handleFakeClick}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="已索引伪造品"
              value={stats.indexedFakes}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={handleRequestClick}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="已处理检测请求 (24h)"
              value={stats.processedRequests24h}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={handleInterceptClick}
            style={{ cursor: 'pointer' }}
          >
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
      <Card 
        title="伪造品的主要攻击向量"
        className="mb-6"
        extra={
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            options={monthOptions}
            style={{ width: 150 }}
            loading={monthlyChartsLoading}
          />
        }
      >
        <Spin spinning={monthlyChartsLoading}>
          <div className="flex justify-center items-center mb-4">
            <div className="w-full">
              <AttackVectorsChart data={charts.attackVectors} />
            </div>
          </div>
        </Spin>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>洞察：</strong>实证研究发现，在通过视觉复制(Art Counterfeit)创建的伪造品中，98%同时结合了文本模仿(Str Counterfeit)，
            包括克隆名称、描述或标签结构。这表明文本伪造不仅是普遍的，而且与视觉模仿具有协同效应，是欺诈的重要组成部分。
          </p>
        </div>
      </Card>

      {/* Widget 2: 用户如何发现 NFT? */}
      <Card 
        title="用户如何发现 NFT?"
        className="mb-6"
        extra={
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            options={monthOptions}
            style={{ width: 150 }}
            loading={monthlyChartsLoading}
          />
        }
      >
        <Spin spinning={monthlyChartsLoading}>
          <div className="flex justify-center items-center mb-4">
            <div className="w-full">
              <DiscoverySourcesChart data={charts.discoverySources} />
            </div>
          </div>
        </Spin>
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
          <div className="w-full">
            <BetaVictimsChart data={charts.betaVictims} />
          </div>
        </div>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>洞察：</strong>文本风险评分β与伪造品造成的实际受害者数量呈正相关。评分较高的伪造品(β≈0.5-0.7)对应更严重的受害程度。
            曲线在β≈0.5-0.7附近达到峰值后下降，表明高度相似的伪造品会被平台快速下架，减少后续损害。这证明了PCF风险评分的有效性。
          </p>
        </div>
      </Card>

      {/* Modal: 已登记正版收藏 */}
      <Modal
        title="已登记正版收藏"
        open={genuineModalOpen}
        onCancel={() => setGenuineModalOpen(false)}
        footer={null}
        width={800}
      >
        <Spin spinning={genuineLoading}>
          <List
            itemLayout="horizontal"
            dataSource={genuineData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.image_url} shape="square" size={64} />}
                  title={<Typography.Text strong>{item.nft_name}</Typography.Text>}
                  description={
                    <div>
                      <div style={{ marginBottom: 4 }}>
                        <Typography.Text type="secondary">Token ID: </Typography.Text>
                        <Typography.Text copyable code>
                          {item.token_id}
                        </Typography.Text>
                      </div>
                      <div>
                        <Typography.Text type="secondary">合约地址: </Typography.Text>
                        <Typography.Text copyable code>
                          {item.contract_address}
                        </Typography.Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Spin>
      </Modal>

      {/* Modal: 已索引伪造品 */}
      <Modal
        title="已索引伪造品"
        open={fakeModalOpen}
        onCancel={() => setFakeModalOpen(false)}
        footer={null}
        width={800}
      >
        <Spin spinning={fakeLoading}>
          <List
            itemLayout="horizontal"
            dataSource={fakeData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.image_url} shape="square" size={64} />}
                  title={<Typography.Text strong>{item.nft_name}</Typography.Text>}
                  description={
                    <div>
                      <div style={{ marginBottom: 4 }}>
                        <Typography.Text type="secondary">Token ID: </Typography.Text>
                        <Typography.Text copyable code>
                          {item.token_id}
                        </Typography.Text>
                      </div>
                      <div>
                        <Typography.Text type="secondary">合约地址: </Typography.Text>
                        <Typography.Text copyable code>
                          {item.contract_address}
                        </Typography.Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Spin>
      </Modal>

      {/* Modal: 已处理检测请求 (24h) */}
      <Modal
        title="已处理检测请求 (24h)"
        open={requestModalOpen}
        onCancel={() => setRequestModalOpen(false)}
        footer={null}
        width={800}
      >
        <Spin spinning={requestLoading}>
          <List
            itemLayout="horizontal"
            dataSource={requestData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.image_url} shape="square" size={64} />}
                  title={<Typography.Text strong>{item.nft_name}</Typography.Text>}
                  description={
                    <div>
                      <div style={{ marginBottom: 4 }}>
                        <Typography.Text type="secondary">Token ID: </Typography.Text>
                        <Typography.Text copyable code>
                          {item.token_id}
                        </Typography.Text>
                      </div>
                      <div>
                        <Typography.Text type="secondary">合约地址: </Typography.Text>
                        <Typography.Text copyable code>
                          {item.contract_address}
                        </Typography.Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Spin>
      </Modal>

      {/* Modal: 已拦截高风险 NFT (24h) */}
      <Modal
        title="已拦截高风险 NFT (24h)"
        open={interceptModalOpen}
        onCancel={() => setInterceptModalOpen(false)}
        footer={null}
        width={800}
      >
        <Spin spinning={interceptLoading}>
          <List
            itemLayout="horizontal"
            dataSource={interceptData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.image_url} shape="square" size={64} />}
                  title={<Typography.Text strong>{item.nft_name}</Typography.Text>}
                  description={
                    <div>
                      <div style={{ marginBottom: 4 }}>
                        <Typography.Text type="secondary">Token ID: </Typography.Text>
                        <Typography.Text copyable code>
                          {item.token_id}
                        </Typography.Text>
                      </div>
                      <div>
                        <Typography.Text type="secondary">合约地址: </Typography.Text>
                        <Typography.Text copyable code>
                          {item.contract_address}
                        </Typography.Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Spin>
      </Modal>
    </div>
  );
};

export default DashboardPage;

