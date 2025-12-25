"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, message, Spin } from "antd";
import { api } from "../services/api"; 
interface Summary {
  totalHouseholds: number;
  totalPersons: number;
  totalFees: number;
  totalReceivable: number;
  totalCollected: number;
  collectionRate: number;
}
import { Statistic, Progress } from "antd"; // Import thêm
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fm = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await api.get<Summary>("/reports/summary?periodYm=2025-12");
        setData(res.data);
      } catch (err) {
        message.error("Lỗi tải dữ liệu tổng quan");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <Spin spinning={loading}>
      {/* Row 1: Thống kê cơ bản */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Tổng số hộ" value={data?.totalHouseholds} prefix={<HomeOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
             <Statistic title="Nhân khẩu" value={data?.totalPersons} prefix={<UserOutlined />} />
          </Card>
        </Col>
         <Col span={6}>
          <Card bordered={false}>
             <Statistic title="Khoản thu" value={data?.totalFees} />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Thống kê tài chính */}
      <h3>Tình hình thu phí (Tháng 12/2025)</h3>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Tổng phải thu" bordered={false}>
             <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                {fm(data?.totalReceivable || 0)}
             </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Đã thu" bordered={false}>
             <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {fm(data?.totalCollected || 0)}
             </div>
          </Card>
        </Col>
        <Col span={8}>
           <Card title="Tiến độ thu" bordered={false}>
              <Progress type="circle" percent={data?.collectionRate} width={80} />
           </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default Dashboard;