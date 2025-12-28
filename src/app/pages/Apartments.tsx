import React, { useEffect, useState, useMemo } from "react";
import { 
  Table, Card, Button, Modal, Form, Input, 
  Select, InputNumber, message, Tag, Space, Typography, 
  Tooltip, Popconfirm, ConfigProvider 
} from "antd";
import { 
  PlusOutlined, SearchOutlined, ReloadOutlined, 
  HomeOutlined, EditOutlined, DeleteOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined, SyncOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { api } from "../services/api";

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
  const [searchText, setSearchText] = useState<string>("");
  const [form] = Form.useForm();

  // --- API Functions ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/apartments");
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      // Fallback data demo cho bạn thấy giao diện nếu API lỗi
      setData([
        { id: 1, block: "A1", floor: 12, unit: "A1-1205", area: 75.5, status: "OCCUPIED" },
        { id: 2, block: "B2", floor: 5, unit: "B2-0501", area: 90, status: "EMPTY" },
        { id: 3, block: "C1", floor: 2, unit: "C1-0202", area: 110, status: "MAINTENANCE" },
      ]);
      // message.error("Không tải được dữ liệu, đang dùng dữ liệu mẫu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await api.post("/apartments", values);
      message.success("🎉 Thêm căn hộ thành công!");
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
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
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} />
          </Tooltip>
          <Popconfirm title="Bạn chắc chắn muốn xóa?" okText="Xóa" cancelText="Hủy">
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
    // ConfigProvider giúp đổi màu chủ đạo toàn bộ component con bên trong
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b', // Màu xanh lá/ngọc thân thiện
          borderRadius: 8,
        },
      }}
    >
      <div style={{ padding: "24px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
        <Card
          bordered={false}
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} // Đổ bóng nhẹ cho đẹp
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: '#e6fffb', padding: '8px', borderRadius: '50%', color: '#00b96b' }}>
                <HomeOutlined style={{ fontSize: '20px' }} />
              </span>
              <div>
                <Title level={4} style={{ margin: 0 }}>Quản lý Căn hộ</Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>Danh sách toàn bộ căn hộ trong hệ thống</Text>
              </div>
            </div>
          }
          extra={
            <Space>
               <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                Thêm mới
              </Button>
            </Space>
          }
        >
          {/* Thanh tìm kiếm */}
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
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
            // Cấu hình Pagination (Phân trang) chuẩn tiếng Việt
            pagination={{ 
              pageSize: 5, 
              showSizeChanger: true, 
              pageSizeOptions: ['5', '10', '20'],
              locale: { items_per_page: " / trang" }, // Sửa chữ "/page" thành "/ trang"
              showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng ${total} căn`, // Dòng tổng số
              position: ['bottomCenter'] // Căn giữa cho đẹp
            }}
          />
        </Card>

        {/* Modal Form */}
        <Modal
          title={<Space><PlusOutlined style={{ color: '#00b96b'}} /> Thêm căn hộ mới</Space>}
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          destroyOnClose
          okText="Lưu lại"
          cancelText="Hủy bỏ"
        >
          <Form form={form} layout="vertical" initialValues={{ status: "EMPTY" }}>
             {/* Giữ nguyên logic form cũ nhưng layout gọn hơn */}
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Form.Item name="block" label="Block" rules={[{ required: true }]}>
                   <Input prefix={<HomeOutlined />} placeholder="VD: A1" />
                </Form.Item>
                <Form.Item name="floor" label="Tầng" rules={[{ required: true }]}>
                   <InputNumber style={{ width: "100%" }} min={1} placeholder="VD: 5" />
                </Form.Item>
             </div>
             <Form.Item name="unit" label="Mã căn" rules={[{ required: true }]}>
                <Input placeholder="VD: A1-502" />
             </Form.Item>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Form.Item name="area" label="Diện tích (m²)" rules={[{ required: true }]}>
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