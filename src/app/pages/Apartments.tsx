import React, { useEffect, useState, useMemo } from "react";
import { 
  Table, Card, Button, Modal, Form, Input, 
  Select, InputNumber, message, Tag, Space, Typography, 
  Tooltip, Popconfirm, ConfigProvider 
} from "antd";
import { 
  PlusOutlined, HomeOutlined, EditOutlined, DeleteOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { api } from "../services/api"; // Giả định bạn đã có file này

const { Title, Text } = Typography;

// --- Định nghĩa Interface & Constant ---
interface Apartment {
  id: string | number;
  block: string;
  floor: number;
  unit: string;
  area: number;
  status: "EMPTY" | "OCCUPIED" | "MAINTENANCE";
}

const STATUS_OPTS = {
  EMPTY: { label: "Còn trống", color: "success", icon: <CheckCircleOutlined /> },
  OCCUPIED: { label: "Đang ở", color: "processing", icon: <HomeOutlined /> },
  MAINTENANCE: { label: "Bảo trì", color: "warning", icon: <ExclamationCircleOutlined /> },
};

const Apartments: React.FC = () => {
  const [data, setData] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [total] = useState(0);
  const [page, setPage] = useState(0);
  // State mới: Lưu ID đang sửa (nếu null => đang thêm mới)
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [searchText, setSearchText] = useState<string>("");
  const [form] = Form.useForm();

  // --- 1. Fetch Data ---
  // --- 1. Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
     const res = await api.get("/apartments");
      // Nếu API trả về mảng thì lấy, không thì gán mảng rỗng để tránh lỗi map()
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      // Đã xóa dữ liệu mẫu fallback tại đây.
      // Bạn có thể thêm message.error("Lỗi tải trang") của Antd nếu muốn.
      setData([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- 2. Logic XÓA (Delete) ---
  const handleDelete = async (id: string | number) => {
    try {
      // Gọi API Xóa (Giả lập)
      await api.delete(`/apartments/${id}`);
      
      message.success("Đã xóa căn hộ thành công");
      
      // Cập nhật giao diện ngay lập tức (Client-side)
      setData((prev) => prev.filter((item) => item.id !== id));
      
    } catch (err) {
      message.error("Xóa thất bại, vui lòng thử lại.");
      console.error(err);
    }
  };

  // --- 3. Logic Chuẩn bị SỬA (Prepare Edit) ---
  const handleOpenEdit = (record: Apartment) => {
    setEditingId(record.id);       // Lưu ID đang sửa
    form.setFieldsValue(record);   // Đổ dữ liệu cũ vào form
    setIsModalOpen(true);          // Mở Modal
  };

  // --- 4. Logic Chuẩn bị THÊM MỚI (Prepare Add) ---
  const handleOpenAdd = () => {
    setEditingId(null);            // Reset ID về null
    form.resetFields();            // Xóa trắng form cũ
    setIsModalOpen(true);          // Mở Modal
  };

  // --- 5. Logic SUBMIT (Xử lý chung cho Thêm & Sửa) ---
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingId) {
        // === TRƯỜNG HỢP SỬA (UPDATE) ===
        await api.put(`/apartments/${editingId}`, values);
        
        message.success("Cập nhật thành công!");
        
        // Cập nhật State Data (Tìm dòng có ID đó và thay thế data mới)
        setData((prev) => prev.map((item) => 
          item.id === editingId ? { ...item, ...values } : item
        ));

      } else {
        // === TRƯỜNG HỢP THÊM MỚI (CREATE) ===
        const res = await api.post("/apartments", values);
        
        message.success("Thêm mới thành công!");
        
        // Cách 1: Fetch lại toàn bộ (An toàn nhất để lấy ID mới từ server)
        fetchData(); 
        
        // Cách 2 (Nếu API trả về item vừa tạo): 
        // setData([...data, res.data]); 
      }

      // Đóng modal và dọn dẹp
      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();

    } catch (err) {
      message.error("Có lỗi xảy ra khi lưu dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // --- Columns Config ---
  const columns: ColumnsType<Apartment> = [
    {
      title: "Block",
      dataIndex: "block",
      key: "block",
      width: 80,
      align: "center",
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Mã căn hộ",
      dataIndex: "unit",
      key: "unit",
      width: 120,
      render: (text) => (
        <Text strong style={{ color: '#13c2c2' }}>
           <HomeOutlined style={{ marginRight: 5 }} />{text}
        </Text>
      ),
    },
    {
      title: "Tầng",
      dataIndex: "floor",
      key: "floor",
      width: 80,
      align: "center",
    },
    {
      title: "Diện tích",
      dataIndex: "area",
      key: "area",
      align: "right",
      render: (val) => <span>{val} m²</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: keyof typeof STATUS_OPTS) => {
        const config = STATUS_OPTS[status] || { label: status, color: "default", icon: null };
        return (
          <Tag icon={config.icon} color={config.color} style={{ borderRadius: '10px' }}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          {/* NÚT SỬA */}
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined style={{ color: '#faad14' }} />} 
              onClick={() => handleOpenEdit(record)} // Gọi hàm sửa
            />
          </Tooltip>

          {/* NÚT XÓA */}
          <Popconfirm 
            title="Xác nhận xóa?" 
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)} // Gọi hàm xóa
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
    },
  ];

  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const lower = searchText.toLowerCase();
    return data.filter(item => item.unit?.toLowerCase().includes(lower) || item.block?.toLowerCase().includes(lower));
  }, [data, searchText]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
          borderRadius: 8,
        },
      }}
    >
      <div style={{ padding: "24px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
        <Card
          variant="borderless"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: '#e6fffb', padding: '8px', borderRadius: '50%', color: '#00b96b' }}>
                <HomeOutlined style={{ fontSize: '20px' }} />
              </span>
              <div>
                <Title level={4} style={{ margin: 0 }}>Quản lý Căn hộ</Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>Hệ thống quản lý tòa nhà</Text>
              </div>
            </div>
          }
          extra={
            <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleOpenAdd} // Gọi hàm mở form thêm mới
            >
              Thêm căn hộ mới
            </Button>
          }
        >
          {/* Thanh tìm kiếm */}
          <div style={{ marginBottom: 20 }}>
            <Input 
              placeholder="🔍 Tìm theo Mã căn / Block..." 
              allowClear
              size="large"
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 350 }}
            />
          </div>

          {/* Bảng dữ liệu */}
          <Table 
            rowKey="id" 
            loading={loading}
            dataSource={filteredData} 
            columns={columns} 
            pagination={{
              current: page + 1,               
              pageSize: 10,                    // Số dòng mỗi trang
              total: total,                 
              onChange: (p) => setPage(p - 1), 
              showTotal: (total) => `Tổng ${total} căn hộ`,
              placement: ['bottomCenter']
            }}
          />
        </Card>

        {/* Modal Form */}
        <Modal
          // Thay đổi tiêu đề Modal tùy theo trạng thái
          title={
             <Space>
                {editingId ? <EditOutlined style={{ color: '#faad14'}} /> : <PlusOutlined style={{ color: '#00b96b'}} />} 
                {editingId ? "Cập nhật thông tin" : "Thêm căn hộ mới"}
             </Space>
          }
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => {
              setIsModalOpen(false);
              setEditingId(null);
              form.resetFields();
          }}
          
          okText={editingId ? "Cập nhật" : "Thêm mới"}
          cancelText="Hủy bỏ"
          confirmLoading={loading} // Hiệu ứng xoay khi đang submit
        >
          <Form form={form} layout="vertical" initialValues={{ status: "EMPTY" }}>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Form.Item name="block" label="Block" rules={[{ required: true, message: 'Vui lòng nhập Block' }]}>
                   <Input prefix={<HomeOutlined />} placeholder="VD: A1" />
                </Form.Item>
                <Form.Item name="floor" label="Tầng" rules={[{ required: true, message: 'Nhập số tầng' }]}>
                   <InputNumber style={{ width: "100%" }} min={1} placeholder="VD: 5" />
                </Form.Item>
             </div>
             <Form.Item name="unit" label="Mã căn" rules={[{ required: true, message: 'Vui lòng nhập mã căn' }]}>
                <Input placeholder="VD: A1-502" />
             </Form.Item>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Form.Item name="area" label="Diện tích (m²)" rules={[{ required: true, message: 'Nhập diện tích' }]}>
                   <InputNumber style={{ width: "100%" }} min={1} />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                  <Select>
                    {Object.entries(STATUS_OPTS).map(([key, val]) => (
                      <Select.Option key={key} value={key}>{val.label}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
             </div>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Apartments;