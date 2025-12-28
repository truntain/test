import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, message, Input, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { mockApi, type Vehicle } from '../services/mockApi';

const Vehicles: React.FC = () => {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await mockApi.get<Vehicle[]>('/vehicles');
      if (res.data) {
        setData(res.data);
      }
    } catch (error) {
      message.error('Lỗi tải dữ liệu phương tiện');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) => 
    item.plate?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.householdId?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Vehicle> = [
    { title: 'Biển số', dataIndex: 'plate', key: 'plate', render: (text) => <b>{text}</b> },
    { title: 'Loại xe', dataIndex: 'type', key: 'type' },
    { title: 'Hãng', dataIndex: 'brand', key: 'brand' },
    { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'blue' : 'red'}>{status}</Tag>
      )
    },
    { title: 'Mã Hộ', dataIndex: 'householdId', key: 'householdId' },
  ];

  return (
    <Card title="Quản lý Phương tiện" bordered={false}>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm theo biển số"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </Space>
      <Table 
        columns={columns} 
       dataSource={filteredData}
        rowKey="id" 
        loading={loading} 
      />
    </Card>
  );
};

export default Vehicles;