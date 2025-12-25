import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Modal, Form, Input, Select, message, Card } from 'antd';
import { PlusOutlined, SendOutlined } from '@ant-design/icons';
import { api } from '../services/api';

const Notifications: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Hàm tải dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setData(res.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Xử lý tạo thông báo mới
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await api.post('/notifications', values);
      message.success("Tạo thông báo thành công");
      setIsModalOpen(false);
      form.resetFields();
      fetchData(); // Tải lại dữ liệu sau khi tạo
    } catch (e) { 
      // Validate failed hoặc API lỗi
    }
  };

  // Xử lý phát hành thông báo (Status: DRAFT -> PUBLISHED)
  const handlePublish = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/publish`);
      message.success("Đã phát hành thông báo");
      fetchData();
    } catch (error) {
      message.error("Lỗi khi phát hành thông báo");
    }
  };

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { 
      title: 'Loại', 
      dataIndex: 'type', 
      key: 'type', 
      render: (t: string) => {
        let color = 'default';
        let text = t;
        if (t === 'FEE') { color = 'blue'; text = 'Thông báo phí'; }
        else if (t === 'ALERT') { color = 'red'; text = 'Cảnh báo'; }
        else if (t === 'INFO') { color = 'green'; text = 'Tin tức'; }
        
        return <Tag color={color}>{text}</Tag>;
      } 
    },
    { title: 'Ngày tạo', dataIndex: 'createdDate', key: 'createdDate' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'PUBLISHED' ? 'green' : 'orange'}>
          {s === 'PUBLISHED' ? 'Đã đăng' : 'Nháp'}
        </Tag> 
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'DRAFT' && (
            <Button 
              type="primary" 
              size="small" 
              icon={<SendOutlined />} 
              onClick={() => handlePublish(record.id)}
            >
              Đăng
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Quản lý Thông báo" 
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Tạo thông báo
        </Button>
      }
    >
      <Table 
        dataSource={data} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 5 }} 
      />

      <Modal 
        title="Tạo thông báo mới" 
        open={isModalOpen} 
        onOk={handleCreate} 
        onCancel={() => setIsModalOpen(false)}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input placeholder="Ví dụ: Thông báo đóng tiền điện..." />
          </Form.Item>
          
          <Form.Item name="type" label="Loại tin" initialValue="INFO">
            <Select options={[
                { value: 'INFO', label: 'Tin tức chung' }, 
                { value: 'FEE', label: 'Thông báo phí' },
                { value: 'ALERT', label: 'Cảnh báo / Khẩn cấp' }
            ]} />
          </Form.Item>
          
          <Form.Item name="targetType" label="Gửi tới" initialValue="ALL">
             <Select options={[
                { value: 'ALL', label: 'Toàn bộ cư dân' },
                { value: 'SPECIFIC', label: 'Hộ cụ thể (Tính năng đang phát triển)' }
             ]} />
          </Form.Item>
          
          <Form.Item name="content" label="Nội dung">
            <Input.TextArea rows={4} placeholder="Nhập nội dung chi tiết..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Notifications;