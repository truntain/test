"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, message, Spin } from "antd";
import { api } from "../services/api"; 
interface Summary {
  totalHouseholds: number;
  totalPersons: number;
  totalFees: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Tổng số hộ" bordered={false}>
            {data?.totalHouseholds ?? 0}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tổng số nhân khẩu" bordered={false}>
            {data?.totalPersons ?? 0}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Số khoản thu" bordered={false}>
            {data?.totalFees ?? 0}
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default Dashboard;
