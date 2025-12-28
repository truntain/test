import React, { useEffect, useState, useRef } from 'react';
import { 
  Button, Modal, Form, message, Table, 
  Card, Typography, Tag, Space, Tooltip, Popconfirm, ConfigProvider, Input 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  UserOutlined, SolutionOutlined, HomeOutlined, PhoneOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

import HouseholdForm from '../components/Household/HouseholdForm';
import { api } from "../services/api"; 

const { Title, Text } = Typography;

interface Household {
  id: string | number;
  householdId: string;
  ownerName: string;
  phone: string;
  apartmentId: string | number;
  apartmentUnit?: string;
  moveInDate: string;
  status: 'ACTIVE' | 'MOVED_OUT' | 'TEMPORARY';
}

const Households: React.FC = () => {
  // --- State ---
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  
  // State tìm kiếm (Input value)
  const [keyword, setKeyword] = useState('');

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  
  const [form] = Form.useForm();
  
  // --- SỬA LỖI DÒNG 46 ---
  // Sử dụng ReturnType<typeof setTimeout> để lấy đúng kiểu dữ liệu của trình duyệt (thường là number)
  // thay vì dùng NodeJS.Timeout
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- API Fetch ---
  // --- API Fetch ---
  const fetchHouseholds = async (currentPage: number, searchKeyword: string) => {
    setLoading(true);
    try {
      // 1. Lấy toàn bộ dữ liệu từ Mock API
      const res = await api.get("/households", {
        params: { keyword: searchKeyword, page: currentPage, size: 10 },
      });
      
      let list = Array.isArray(res.data) ? res.data : res.data.content || [];

      // === THÊM ĐOẠN LỌC DỮ LIỆU TẠI ĐÂY ===
      if (searchKeyword) {
          const lowerKeyword = searchKeyword.toLowerCase().trim();
          list = list.filter((item: Household) => {
              // Tìm kiếm theo: Mã hộ, Tên chủ hộ, Số điện thoại
              const matchCode = item.householdId?.toLowerCase().includes(lowerKeyword);
              const matchName = item.ownerName?.toLowerCase().includes(lowerKeyword);
              const matchPhone = item.phone?.includes(lowerKeyword);
              
              // (Tùy chọn) Tìm theo tên căn hộ nếu có
              const matchApt = item.apartmentUnit?.toLowerCase().includes(lowerKeyword);

              return matchCode || matchName || matchPhone || matchApt;
          });
      }
      // ======================================
      
      const totalEl = list.length; // Cập nhật tổng số sau khi lọc
      
      setHouseholds(list);
      setTotal(totalEl);
    } catch (err) {
      console.error(err);
      message.error("Lỗi tải danh sách hộ dân");
    } finally {
      setLoading(false);
    }
  };

  // --- Effect 1: Gọi API khi Page thay đổi (Pagination) ---
  // Lưu ý: Chỉ gọi khi page đổi, còn keyword đổi sẽ xử lý ở hàm onChange bên dưới
  useEffect(() => {
    fetchHouseholds(page, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); 

  // --- Xử lý Tìm kiếm (Real-time Debounce) ---
  // Nhập tới đâu tìm tới đó, delay 500ms
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    // Xóa timeout cũ nếu người dùng đang gõ liên tục
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Đặt timeout mới
    searchTimeoutRef.current = setTimeout(() => {
      setPage(0); // Reset về trang 1
      fetchHouseholds(0, value); // Gọi API tìm kiếm
    }, );
  };

  // --- Handlers ---
  const handleEdit = (record: Household) => {
    setEditingId(record.id);
    setIsModalOpen(true);
    form.setFieldsValue({
      ...record,
      moveInDate: record.moveInDate ? dayjs(record.moveInDate) : null,
      apartmentId: record.apartmentId 
    });
  };

  const handleCreate = () => {
    setEditingId(null);
    form.resetFields(); 
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        moveInDate: values.moveInDate ? values.moveInDate.format('YYYY-MM-DD') : null,
      };

      setLoading(true);

      if (editingId) {
        await api.put(`/households/${editingId}`, payload);
        message.success('Cập nhật hộ dân thành công!');
        fetchHouseholds(page, keyword); // Reload lại dữ liệu
      } else {
        await api.post('/households', payload);
        message.success('Thêm hộ dân mới thành công!');
        setPage(0);
        fetchHouseholds(0, keyword); // Reload về trang đầu
      }

      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
    } catch (err: any) {
       console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await api.delete(`/households/${id}`);
      message.success('Đã xóa hộ dân.');
      fetchHouseholds(page, keyword);
    } catch (err) {
      message.error('Lỗi khi xóa.');
    }
  };

  // --- Table Columns ---
  const columns: ColumnsType<Household> = [
    { 
      title: 'Mã hộ dân', 
      dataIndex: 'householdId',
      width: 120,
      render: (text) => <Tag color="blue" style={{ fontWeight: 'bold' }}>{text}</Tag>
    },
    { 
      title: 'Chủ hộ', 
      dataIndex: 'ownerName',
      render: (_, record) => (
        <Space orientation="vertical" size={0}>
          <Text strong><UserOutlined style={{ marginRight: 5}} />{record.ownerName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
             <PhoneOutlined /> {record.phone || '---'}
          </Text>
        </Space>
      )
    },
    { 
        title: 'Căn hộ', 
        dataIndex: 'apartmentId', 
        width: 120,
        render: (text, record) => (
            <Tag icon={<HomeOutlined />} color="cyan">
                {record.apartmentUnit || text} 
            </Tag>
        )
    },
    {
        title: 'Ngày chuyển đến',
        dataIndex: 'moveInDate',
        width: 140,
        align: 'center',
        render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      align: 'center',
      render: (status) => {
        let color = 'default';
        let label = status;
        if (status === 'ACTIVE') { color = 'success'; label = 'Thường trú'; }
        else if (status === 'INACTIVE') { color = 'error'; label = 'Đã rời đi'; }
        else if (status === 'TEMPORARY') { color = 'warning'; label = 'Tạm trú'; }
        return <Tag color={color}>{label}</Tag>
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa thông tin">
            <Button type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm title="Xóa hộ dân này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1890ff', borderRadius: 6 } }}>
      <div style={{ padding: "24px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
        <Card
          variant="borderless"
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: '#e6f7ff', padding: '8px', borderRadius: '50%', color: '#1890ff' }}>
                <SolutionOutlined style={{ fontSize: '20px' }} />
              </span>
              <div>
                <Title level={4} style={{ margin: 0 }}>Quản lý Hộ dân</Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>Danh sách các hộ gia đình</Text>
              </div>
            </div>
          }
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              Thêm hộ dân
            </Button>
          }
        >
          {/* Thanh tìm kiếm: CHỈ CÒN INPUT */}
          <div style={{ marginBottom: 20 }}>
            <Input
              placeholder="🔍 Tìm theo Mã hộ / Tên chủ hộ..."
              value={keyword}
              onChange={handleSearchChange} // Gọi hàm nhập tới đâu tìm tới đó
              style={{ width: '100%', maxWidth: 400 }}
              allowClear
              size="large"
            />
          </div>

          {/* Table */}
          <Table 
            columns={columns} 
            dataSource={households} 
            rowKey="id" 
            loading={loading}
            pagination={{
              current: page + 1,
              pageSize: 10,
              total: total,
              onChange: (p) => setPage(p - 1),
              showTotal: (total) => `Tổng ${total} hộ dân`,
              placement: ['bottomCenter']
            }}
          />
        </Card>

        {/* Modal Form */}
        <Modal
          title={editingId ? "Cập nhật thông tin hộ dân" : "Thêm hộ dân mới"}
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => { setIsModalOpen(false); setEditingId(null); form.resetFields(); }}
          
          okText="Lưu lại"
          cancelText="Hủy bỏ"
          width={700}
        >
          <HouseholdForm form={form} />
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Households;