import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal, Form, Input, Select, InputNumber, message, Space } from "antd";
import { api } from "../services/api";

const FeeItems = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const fetchItems = async () => {
    const res = await api.get("/fee-items");
    setItems(res.data);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    const values = await form.validateFields();
    await api.post("/fee-items", values);
    message.success("Đã thêm khoản thu");
    setIsModalOpen(false);
    fetchItems();
  };

  const filteredItems = items.filter((item: any) => 
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Tên khoản thu", dataIndex: "name" },
    { title: "Loại", dataIndex: "type" },
    { title: "Đơn vị tính", dataIndex: "unit" },
    { title: "Đơn giá (VNĐ)", dataIndex: "cost", render: (val: number) => val.toLocaleString() },
    { title: "Trạng thái", dataIndex: "status" },
  ];

  return (
    <Card title="Danh mục Khoản thu" extra={<Button type="primary" onClick={() => setIsModalOpen(true)}>Tạo mới</Button>}>
      <div style={{ marginBottom: 16 }}>
             <Input.Search 
                placeholder="Tìm tên khoản thu" 
                allowClear
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 300 }}
             />
        </div>
      <Table rowKey="id" dataSource={items} columns={columns} />
      <Modal title="Thêm khoản thu" open={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
            <Form.Item name="name" label="Tên khoản phí" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="type" label="Loại phí"><Select options={[{ value: 'SERVICE', label: 'Dịch vụ' }, { value: 'VEHICLE', label: 'Phương tiện' }]} /></Form.Item>
            <Form.Item name="unit" label="Đơn vị tính"><Select options={[{ value: 'M2', label: 'Theo m2' }, { value: 'SLOT', label: 'Theo chiếc' }, { value: 'FIXED', label: 'Cố định' }]} /></Form.Item>
            <Form.Item name="cost" label="Đơn giá" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item>
            <Form.Item name="status" label="Trạng thái" initialValue="ACTIVE"><Select options={[{ value: 'ACTIVE', label: 'Hoạt động' }, { value: 'INACTIVE', label: 'Ngưng' }]} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default FeeItems;