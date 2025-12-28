import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal, Form, Input, DatePicker, message, Space, Popconfirm } from "antd";
import { api } from "../services/api";

const FeePeriods = () => {
  const [periods, setPeriods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const fetchPeriods = async () => {
    const res = await api.get("/fee-periods");
    setPeriods(res.data);
  };

  useEffect(() => { fetchPeriods(); }, []);

  const handleCreate = async () => {
    const values = await form.validateFields();
    // Format date string đơn giản cho mock
    const payload = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
    };
    await api.post("/fee-periods", payload);
    message.success("Tạo kỳ thu thành công");
    setIsModalOpen(false);
    fetchPeriods();
  };

  const handleGenerate = async (id: string) => {
      try {
        await api.post(`/fee-periods/${id}/generate`);
        message.success("Đã tạo công nợ cho toàn bộ cư dân!");
      } catch (e) {
          message.error("Lỗi khi tạo công nợ");
      }
  };

  const filteredPeriods = periods.filter((p: any) => 
    p.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Tên kỳ", dataIndex: "name" },
    { title: "Bắt đầu", dataIndex: "startDate" },
    { title: "Kết thúc", dataIndex: "endDate" },
    { title: "Trạng thái", dataIndex: "status" },
    {
        title: "Hành động",
        render: (_: any, record: any) => (
            <Space>
                {record.status === 'DRAFT' && (
                    <Button type="primary" size="small" onClick={() => handleGenerate(record.id)}>
                        Tạo công nợ
                    </Button>
                )}
                {record.status === 'OPEN' && <Button danger size="small">Chốt sổ</Button>}
            </Space>
        )
    }
  ];

  return (
    <Card title="Quản lý Kỳ thu" extra={<Button type="primary" onClick={() => setIsModalOpen(true)}>Kỳ mới</Button>}>
      <div style={{ marginBottom: 16 }}>
         <Input.Search 
            placeholder="Tìm tên kỳ thu" 
            allowClear 
            onChange={e => setSearchText(e.target.value)} 
            style={{ width: 300 }}
         />
      </div>
      <Table rowKey="id" dataSource={periods} columns={columns} />
      <Modal title="Tạo kỳ thu mới" open={isModalOpen} onOk={handleCreate} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
            <Form.Item name="name" label="Tên kỳ (VD: 10/2023)" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="startDate" label="Ngày bắt đầu"><DatePicker style={{width: '100%'}} /></Form.Item>
            <Form.Item name="endDate" label="Ngày kết thúc"><DatePicker style={{width: '100%'}} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default FeePeriods;