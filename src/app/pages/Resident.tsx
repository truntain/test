import React, { useEffect, useState, useRef } from 'react';
import { 
  Button, Modal, Form, message, Table, 
  Card, Typography, Tag, Space, Tooltip, Popconfirm, ConfigProvider, Input 
} from 'antd';
import { 
  UserAddOutlined, EditOutlined, DeleteOutlined, 
  UserOutlined, PhoneOutlined, ManOutlined, 
  WomanOutlined, IdcardOutlined, CalendarOutlined, SearchOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { api } from "../services/api"; 
import ResidentForm from '../components/Household/ResidentForm'; 

const { Title, Text } = Typography;

// Interface giữ nguyên để map với API
interface Resident {
  id: string | number;
  fullName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  identityCard: string;
  phone?: string;
  status: string;
  relationshipToHead?: string;
  isHead?: boolean;
}

const Residents: React.FC = () => {
  // --- State ---
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  
  const [form] = Form.useForm();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- API Fetch ---
  const fetchResidents = async (currentPage: number, searchKeyword: string) => {
    setLoading(true);
    try {
      // 1. Gọi API lấy TOÀN BỘ danh sách (Mock API trả về hết)
      const res = await api.get("/residents", {
        params: { keyword: searchKeyword, page: currentPage, size: 10 },
      });

      let list = Array.isArray(res.data) ? res.data : res.data.content || [];
      
      // === THÊM ĐOẠN NÀY: CLIENT-SIDE FILTERING ===
      // Vì Mock API trả về hết, nên ta tự lọc ở Frontend
      if (searchKeyword) {
          const lowerKeyword = searchKeyword.toLowerCase().trim();
          list = list.filter((item: Resident) => {
              // Tìm theo Tên hoặc CMND hoặc SĐT
              const matchName = item.fullName?.toLowerCase().includes(lowerKeyword);
              const matchId = item.identityCard?.includes(lowerKeyword);
              const matchPhone = item.phone?.includes(lowerKeyword);
              
              return matchName || matchId || matchPhone;
          });
      }
      // ============================================

      const totalElements = list.length; // Tổng số sau khi lọc

      // Nếu muốn làm phân trang giả ở Client luôn (cắt mảng)
      // const startIndex = currentPage * 10;
      // const pagedList = list.slice(startIndex, startIndex + 10);
      // setResidents(pagedList); 
      
      // Hoặc hiển thị hết kết quả tìm được (đơn giản nhất cho Mock)
      setResidents(list);
      setTotal(totalElements);
      
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents(page, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); 

  // --- Logic Tìm kiếm ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
        setPage(0); 
        fetchResidents(0, value);
    }, 50);
  };

  // --- Handlers CRUD ---
  const handleEdit = (record: Resident) => {
    setEditingId(record.id);
    setIsModalOpen(true);
    form.setFieldsValue({
      ...record,
      dateOfBirth: record.dateOfBirth ? dayjs(record.dateOfBirth) : null,
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
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
      };

      setLoading(true);

      if (editingId) {
        // === SỬA ===
        await api.put(`/residents/${editingId}`, payload);
        message.success('Cập nhật thành công!');
        
        setResidents((prevList) => 
          prevList.map((item) => 
            item.id === editingId ? { ...item, ...payload, id: editingId } : item
          )
        );
      } else {
        // === THÊM ===
        await api.post('/residents', payload);
        message.success('Thêm cư dân thành công!');

        setKeyword(''); 
        if (page === 0) {
            fetchResidents(0, ''); 
        } else {
            setPage(0);
        }
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();

    } catch (err: any) {
       console.error(err);
       if (err?.response) {
           message.error(err.response?.data?.message || 'Có lỗi xảy ra');
       } else if (!err?.errorFields) {
           message.error('Lỗi kết nối đến máy chủ');
       }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await api.delete(`/residents/${id}`);
      message.success('Xóa cư dân thành công!');
      setResidents(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      message.error('Lỗi khi xóa cư dân');
    }
  };

  // --- Cấu hình Cột Bảng (Việt hóa hoàn toàn) ---
  const columns: ColumnsType<Resident> = [
    { 
      title: 'Họ và tên', 
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string, record: Resident) => (
        <Space>
           {record.gender === 'MALE' 
             ? <ManOutlined style={{ color: '#1890ff' }} /> 
             : record.gender === 'FEMALE' 
                ? <WomanOutlined style={{ color: '#eb2f96' }} />
                : <UserOutlined />
           }
           <Text strong>{text}</Text>
           {record.isHead && <Tag color="gold" style={{marginLeft: 5}}>Chủ hộ</Tag>}
        </Space>
      )
    },
    { 
      title: 'Ngày sinh', 
      dataIndex: 'dateOfBirth', 
      key: 'dateOfBirth',
      width: 120,
      render: (text: string) => (
        <Space>
          <CalendarOutlined style={{ color: '#8c8c8c' }} />
          <span>{text ? dayjs(text).format('DD/MM/YYYY') : '-'}</span>
        </Space>
      )
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender: string) => {
          if (gender === 'MALE') return <Tag color="blue">Nam</Tag>;
          if (gender === 'FEMALE') return <Tag color="magenta">Nữ</Tag>;
          return <Tag>Khác</Tag>;
      }
    },
    { 
      title: 'CMND/CCCD', 
      dataIndex: 'identityCard',
      key: 'identityCard',
      render: (text: string) => (
         <Tag icon={<IdcardOutlined />} color="default">{text || '---'}</Tag>
      )
    },
    { 
      title: 'Điện thoại', 
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => text ? (
        <Space>
            <PhoneOutlined style={{ color: '#52c41a' }} />
            {text}
        </Space>
      ) : '-'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status: string) => {
        let color = 'default';
        let label = 'Không xác định';
        
        // Map trạng thái tiếng Anh sang tiếng Việt
        switch(status) {
            case 'ACTIVE': color = 'success'; label = 'Thường trú'; break;
            case 'TEMPORARY': color = 'warning'; label = 'Tạm trú'; break;
            case 'ABSENT': color = 'orange'; label = 'Tạm vắng'; break;
            case 'MOVED_OUT': color = 'error'; label = 'Đã đi'; break;
            case 'DECEASED': color = 'default'; label = 'Đã mất'; break;
            default: label = status;
        }
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined style={{ color: '#faad14' }} />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          
          <Popconfirm
            title="Xóa cư dân này?"
            description="Dữ liệu sẽ bị mất vĩnh viễn."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#722ed1', borderRadius: 6 },
      }}
    >
      <div style={{ padding: "24px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
        <Card
          variant="borderless"
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: '#f9f0ff', padding: '8px', borderRadius: '50%', color: '#722ed1' }}>
                <UserOutlined style={{ fontSize: '20px' }} />
              </span>
              <div>
                <Title level={4} style={{ margin: 0 }}>Danh sách Cư dân</Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>Quản lý thông tin nhân khẩu</Text>
              </div>
            </div>
          }
          extra={
            <Button 
              type="primary" 
             icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Thêm cư dân
            </Button>
          }
        >
          {/* Thanh tìm kiếm */}
          <div style={{ marginBottom: 20 }}>
            <Input
              placeholder="🔍 Tìm theo tên / CMND / SĐT..."
              value={keyword}
              onChange={handleSearchChange}
              style={{ width: '100%', maxWidth: 400 }}
              allowClear
              size="large"
            />
          </div>

          {/* Bảng dữ liệu */}
          <Table 
            columns={columns} 
            dataSource={residents} 
            rowKey="id" 
            loading={loading}
            pagination={{
              current: page + 1,
              pageSize: 10,
              total: total,
              onChange: (p) => setPage(p - 1),
              showTotal: (total) => `Tổng ${total} cư dân`,
              placement: ['bottomCenter']
            }}
          />
        </Card>

        {/* Modal Form */}
        <Modal
          title={
            <Space>
                {editingId ? <EditOutlined /> : <UserAddOutlined />}
                {editingId ? 'Cập nhật thông tin' : 'Thêm cư dân mới'}
            </Space>
          }
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingId(null);
            form.resetFields();
          }}
          
          okText={editingId ? "Cập nhật" : "Lưu lại"}
          cancelText="Hủy bỏ"
          width={700}
          confirmLoading={loading} 
        >
          <div style={{ marginTop: 20 }}>
             <ResidentForm form={form} />
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Residents;