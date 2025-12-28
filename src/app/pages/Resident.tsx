import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, message, Input, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { mockApi, type Resident } from '../services/mockApi'; // Đảm bảo đường dẫn đúng tới mockApi

const Residents: React.FC = () => {
  const [data, setData] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi API lấy toàn bộ cư dân (bạn đã có logic này trong mockApi mới nhất)
      const res = await mockApi.get<Resident[]>('/residents');
      if (res.data) {
        setData(res.data);
      }
    } catch (error) {
      message.error('Lỗi tải dữ liệu cư dân');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    const value = searchText.toLowerCase();
    return (
      item.fullName?.toLowerCase().includes(value) ||
      item.idNumber?.toLowerCase().includes(value) ||
      item.householdId?.toLowerCase().includes(value)
    );
  });

  const columns: ColumnsType<Resident> = [
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Ngày sinh', dataIndex: 'dob', key: 'dob' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'CMND/CCCD', dataIndex: 'idNumber', key: 'idNumber' },
    { title: 'Quan hệ với chủ hộ', dataIndex: 'relationshipToHead', key: 'relationshipToHead' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Present' ? 'green' : 'orange'}>{status}</Tag>
      )
    },
    // Hiển thị thuộc hộ nào (nếu cần)
    { title: 'Mã Hộ', dataIndex: 'householdId', key: 'householdId' },
  ];

  return (
    <Card title="Danh sách Cư dân toàn khu" bordered={false}>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm theo tên, CMND"
          allowClear
          onSearch={(val) => setSearchText(val)}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </Space>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        loading={loading} 
      />
    </Card>
  );
};

export default Residents;