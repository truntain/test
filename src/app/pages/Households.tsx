import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message, Pagination } from 'antd';
import { api } from "../services/api"; 
import TableCustom from '../components/TableCustom';
import HouseholdForm from '../components/Household/HouseholdForm';
import { useNavigate } from 'react-router-dom'; 

interface Household {
  id: string;
  householdId: string;
  ownerName: string;
  address: string;
}

const Households: React.FC = () => {
  const navigate = useNavigate();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0); // backend thường 0-based
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [form] = Form.useForm();

  const fetchHouseholds = async () => {
    setLoading(true);
    try {
      const res = await api.get("/households", {
        params: { keyword, page, size: 10 },
      });

      const list = Array.isArray(res.data)
        ? res.data
        : res.data.content || [];

      const total =
        Array.isArray(res.data)
          ? res.data.length
          : res.data.totalElements ?? res.data.total ?? 0;

      setHouseholds(list);
      setTotal(total);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi tải danh sách hộ dân");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchHouseholds();
  }, [page]); // lúc đầu gọi theo page

  const handleSearch = async () => {
    setPage(0);
    fetchHouseholds();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingHousehold) {
        await api.put(`/households/${editingHousehold.id}`, values);
        message.success('Cập nhật hộ dân thành công!');
      } else {
        await api.post('/households', values);
        message.success('Thêm hộ dân thành công!');
      }
      setIsModalOpen(false);
      setEditingHousehold(null);
      form.resetFields();
      fetchHouseholds();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi khi lưu hộ dân');
    }
  };

  const handleEdit = (household: Household) => {
    setEditingHousehold(household);
    setIsModalOpen(true);
    form.setFieldsValue(household);
  };

   /*  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingHousehold) {
        await api.put(`/households/${editingHousehold.id}`, values);
        message.success('Cập nhật hộ dân thành công!');
      } else {
        await api.post('/households', values);
        message.success('Thêm hộ dân thành công!');
      }
      setIsModalOpen(false);
      setEditingHousehold(null);
      form.resetFields();
      fetchHouseholds();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi khi lưu hộ dân');
    }
  };*/

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/households/${id}`);
      message.success('Xóa hộ dân thành công!');
      fetchHouseholds();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi khi xóa hộ dân');
    }
  };


const columns = [
  { title: 'Mã hộ', dataIndex: 'householdId' },
  { title: 'Tên chủ hộ', dataIndex: 'ownerName' },
  { title: 'Địa chỉ', dataIndex: 'address' },
  {
    title: 'Hành động',
    render: (_: any, record: Household) => (
      <>
        <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
          Sửa
        </Button>
        <Button danger onClick={() => handleDelete(record.id)} style={{ marginRight: 8 }}>
          Xóa
        </Button>
        <Button type="default" onClick={() => navigate(`/households/${record.householdId}`)}>
          Chi tiết hộ
        </Button>
      </>
    ),
  },
];


  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Input
          placeholder="Tìm theo mã hộ / tên chủ hộ / địa chỉ"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{ maxWidth: 360 }}
        />
        <Button type="primary" onClick={handleSearch}>Tìm kiếm</Button>
        <Button
          onClick={() => {
            setKeyword('');
            setPage(0);
            fetchHouseholds();
          }}
        >
          Xóa lọc
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 'auto' }}
          onClick={() => {
            setEditingHousehold(null);
            setIsModalOpen(true);
            form.resetFields();
          }}
        >
          Thêm hộ dân
        </Button>
      </div>

      <TableCustom columns={columns} dataSource={households} rowKey="id" loading={loading} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <Pagination
          current={page + 1}
          pageSize={10}
          total={total}
          onChange={(p) => setPage(p - 1)}
          showSizeChanger={false}
        />
      </div>

      <Modal
        title={editingHousehold ? 'Sửa hộ dân' : 'Thêm hộ dân'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingHousehold(null);
          form.resetFields();
        }}
      >
        <HouseholdForm form={form} />
      </Modal>
    </div>
  );
};

export default Households;

