import React, { useEffect, useState, useRef } from 'react';
import { 
  Button, Modal, Form, message, Table, 
  Card, Typography, Tag, Space, Tooltip, Popconfirm, ConfigProvider, Input 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  CarOutlined, RocketOutlined, ThunderboltOutlined, HomeOutlined 
} from '@ant-design/icons';
import { api } from "../services/api"; 
import VehicleForm from '../components/Household/VehicleForm'; 

const { Title } = Typography;

// Map hiển thị tiếng Việt
const TYPE_MAP: Record<string, string> = {
  'MOTORBIKE': 'Xe máy',
  'CAR': 'Ô tô',
  'ELECTRIC_BIKE': 'Xe đạp điện',
  'BICYCLE': 'Xe đạp'
};

const STATUS_MAP: Record<string, string> = {
  'ACTIVE': 'Đang hoạt động',
  'INACTIVE': 'Ngừng hoạt động'
};

// Định nghĩa đúng theo yêu cầu của bạn
interface Vehicle {
  id: string;
  type: string;
  plate: string;  // Đã sửa từ licensePlate thành plate
  brand: string;
  color: string;
  status: string;
  householdId: string; // Thêm trường này
}

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0); 
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form] = Form.useForm(); 
  
  // Ref cho tìm kiếm
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- API Functions ---
  const fetchVehicles = async (currentPage: number, searchKeyword: string) => {
    setLoading(true);
    try {
      const res = await api.get("/vehicles", {
        params: { keyword: searchKeyword, page: currentPage, size: 10 },
      });
      
      let list = Array.isArray(res.data) ? res.data : res.data.content || [];

      // === CLIENT-SIDE FILTER (Tìm kiếm ngay tại trình duyệt) ===
      if (searchKeyword) {
          const lowerKey = searchKeyword.toLowerCase().trim();
          list = list.filter((v: Vehicle) => 
              v.plate?.toLowerCase().includes(lowerKey) || 
              v.householdId?.toLowerCase().includes(lowerKey) ||
              v.brand?.toLowerCase().includes(lowerKey)
          );
      }
      // ========================================================

      setVehicles(list);
      setTotal(list.length);
    } catch (err: any) {
      console.error(err);
      message.error("Lỗi tải danh sách phương tiện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(page, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Xử lý tìm kiếm (Debounce)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
        setPage(0);
        fetchVehicles(0, value);
    },50);
  };

  // --- Submit Form ---
  const handleSubmit = async () => { 
    try {
      const values = await form.validateFields();
      
      // Chuẩn hóa dữ liệu
      const payload = {
        ...values,
        type: values.type?.toUpperCase(),
        status: values.status?.toUpperCase()
      };

      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, payload);
        message.success('Cập nhật thành công!');
      } else {
        await api.post('/vehicles', payload);
        message.success('Thêm mới thành công!');
      }
      
      setIsModalOpen(false);
      setEditingVehicle(null);
      form.resetFields();
      
      // Reload dữ liệu
      setPage(0);
      fetchVehicles(0, keyword);

    } catch (err: any) {
        if (err.errorFields) return;
        message.error('Có lỗi xảy ra khi lưu');
    }
  };

  const handleEdit = (record: Vehicle) => {
    setEditingVehicle(record);
    setIsModalOpen(true);
    form.setFieldsValue({
        ...record,
        type: record.type?.toUpperCase(),
        status: record.status?.toUpperCase()
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/vehicles/${id}`);
      message.success('Đã xóa phương tiện');
      fetchVehicles(page, keyword);
    } catch (err: any) {
      message.error('Lỗi khi xóa');
    }
  };

  // --- Cấu hình cột ---
  const columns = [
    { 
      title: 'Biển số', 
      dataIndex: 'plate', // Đã sửa thành plate
      width: 150,
      render: (text: string) => <Tag color="blue" style={{ fontSize: 13 }}>{text || 'Không biển'}</Tag>
    },
    { 
      title: 'Mã Hộ', 
      dataIndex: 'householdId', // Thêm cột Mã hộ
      width: 120,
      render: (text: string) => (
         <Space>
            <HomeOutlined style={{ color: '#fa8c16'}} />
            <strong>{text}</strong>
         </Space>
      )
    },
    { 
      title: 'Loại xe', 
      dataIndex: 'type', 
      render: (type: string) => {
        const safeType = (type || '').toUpperCase();
        let icon = <CarOutlined />;
        let text = TYPE_MAP[safeType] || safeType;

        if (safeType === 'MOTORBIKE') icon = <RocketOutlined />;
        else if (safeType === 'ELECTRIC_BIKE') icon = <ThunderboltOutlined />;
        
        return <Space>{icon} {text}</Space>;
      }
    },
    { title: 'Hãng xe', dataIndex: 'brand' },
    { title: 'Màu', dataIndex: 'color' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center' as const,
      render: (status: string) => {
      // Logic chọn màu
      const color = status === 'INACTIVE' ? 'error' : 'success';
      
      // Lấy chữ tiếng Việt từ map cũ
      const text = STATUS_MAP[status] || status; 

      return <Tag color={color}>{text}</Tag>;
    }
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center' as const,
      width: 100,
      render: (_: any, record: Vehicle) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)} okButtonProps={{ danger: true }}>
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#fa8c16' } }}>
      <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
        <Card
          variant="borderless"
         title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Phần Icon có nền tròn màu cam nhạt */}
            <span style={{ backgroundColor: '#fff7e6', padding: '8px', borderRadius: '50%', color: '#fa8c16' }}>
              <CarOutlined style={{ fontSize: '20px' }} />
            </span>
            <div>
              <Title level={4} style={{ margin: 0 }}>Quản lý Phương tiện</Title>
            </div>
          </div>
        }
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setEditingVehicle(null);
                form.resetFields();
                setIsModalOpen(true);
            }}>Thêm xe mới</Button>
          }
        >
          <Input 
            placeholder="🔍 Tìm theo Biển số / Hãng xe / Mã hộ..." 
            value={keyword}
            onChange={handleSearchChange}
            allowClear
            size="large"
            style={{ marginBottom: 20, maxWidth: 400 }} 
          />
          
          <Table 
            columns={columns} 
            dataSource={vehicles} 
            rowKey="id" 
            loading={loading}
            pagination={{
              current: page + 1,
              pageSize: 10,
              total: total,
              onChange: (p) => setPage(p - 1),
              showTotal: (total) => `Tổng ${total} phương tiện`,
              placement: ['bottomCenter']
            }}
          />
        </Card>

        <Modal
          title={editingVehicle ? 'Cập nhật xe' : 'Đăng ký xe mới'}
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          destroyOnHidden
          okText="Lưu dữ liệu"
          cancelText="Hủy"
        >
           <VehicleForm form={form} />
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Vehicles;