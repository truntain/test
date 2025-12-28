import React, { useEffect, useState } from "react";
import { Table, Card, Tag, Input, Button, Modal, Form, Select, message } from "antd";
import { api } from "../services/api";

const FeeObligations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // State thu tiền
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedOb, setSelectedOb] = useState<any>(null);
  const [payForm] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    const res = await api.get("/fee-obligations");
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handlePay = async () => {
      const values = await payForm.validateFields();
      await api.patch(`/fee-obligations/${selectedOb.id}/pay`, values);
      message.success("Đã thu tiền thành công!");
      setIsPayModalOpen(false);
      fetchData();
  };

  const filteredData = data.filter((item: any) => 
     item.householdId?.toLowerCase().includes(searchText.toLowerCase()) ||
     item.feeItemName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Mã hộ", dataIndex: "householdId", key: "hh" }, // Trong thực tế cần join lấy tên chủ hộ
    { title: "Khoản thu", dataIndex: "feeItemName", key: "item" },
    { title: "Kỳ", dataIndex: "periodYm", key: "period" },
    { title: "Phải thu", dataIndex: "expected", render: (v: number) => v.toLocaleString() },
    { title: "Đã thu", dataIndex: "paid", render: (v: number) => v.toLocaleString() },
    { 
        title: "Trạng thái", dataIndex: "status",
        render: (s: string) => <Tag color={s === 'PAID' ? 'green' : 'red'}>{s}</Tag>
    },
    {
        title: "Thao tác",
        render: (_: any, r: any) => (
            r.status !== 'PAID' && 
            <Button type="primary" size="small" onClick={() => {
                setSelectedOb(r);
                setIsPayModalOpen(true);
                payForm.setFieldsValue({ amount: r.expected - r.paid });
            }}>Thu tiền</Button>
        )
    }
  ];

  return (
    <Card title="Danh sách Công nợ toàn tòa nhà">
      <div style={{ marginBottom: 16 }}>
        <Input.Search 
           placeholder="Tìm theo Mã hộ hoặc Tên khoản thu"
           allowClear
           onChange={e => setSearchText(e.target.value)}
           style={{ width: 350 }}
        />
      </div>
      <Table loading={loading} rowKey="id" dataSource={data} columns={columns} />
      
      <Modal title="Xác nhận thu tiền" open={isPayModalOpen} onOk={handlePay} onCancel={() => setIsPayModalOpen(false)}>
          <Form form={payForm} layout="vertical">
              <Form.Item label="Khoản thu">{selectedOb?.feeItemName} - {selectedOb?.periodYm}</Form.Item>
              <Form.Item name="amount" label="Số tiền thực thu" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="method" label="Hình thức" initialValue="CASH">
                  <Select options={[{ value: 'CASH', label: 'Tiền mặt' }, { value: 'TRANSFER', label: 'Chuyển khoản' }]} />
              </Form.Item>
          </Form>
      </Modal>
    </Card>
  );
};
export default FeeObligations;