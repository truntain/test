import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal, Form, Input, Select, InputNumber, message, Tag } from "antd";
import { api } from "../services/api";

const Apartments = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const res = await api.get("/apartments");
      setData(res.data);
    } catch (err) {
      message.error("Lỗi tải danh sách căn hộ");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await api.post("/apartments", values);
      message.success("Thêm căn hộ thành công");
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error("Lỗi khi lưu");
    }
  };

  const columns = [
    { title: "Block", dataIndex: "block", key: "block" },
    { title: "Tầng", dataIndex: "floor", key: "floor" },
    { title: "Căn số", dataIndex: "unit", key: "unit" },
    { title: "Diện tích (m2)", dataIndex: "area", key: "area" },
    { 
      title: "Trạng thái", dataIndex: "status", 
      render: (status: string) => (
        <Tag color={status === "OCCUPIED" ? "green" : "red"}>{status}</Tag>
      )
    },
  ];

  return (
    <Card title="Danh sách Căn hộ" extra={<Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm mới</Button>}>
      <Table rowKey="id" dataSource={data} columns={columns} />
      
      <Modal title="Thêm căn hộ" open={isModalOpen} onOk={handleSubmit} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="block" label="Block" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="floor" label="Tầng" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="unit" label="Mã căn" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="area" label="Diện tích" rules={[{ required: true }]}><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="EMPTY">
             <Select options={[{ value: "EMPTY", label: "Trống" }, { value: "OCCUPIED", label: "Đã ở" }]} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Apartments;