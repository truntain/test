import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message, Pagination } from 'antd';
import { api } from "../services/api"; 
import TableCustom from '../components/TableCustom';
import HouseholdForm from '../components/Household/HouseholdForm';
import { useNavigate } from 'react-router-dom'; 
import dayjs from 'dayjs';

interface Household {
  id: string;
  householdId: string;
  ownerName: string;
  address: string;
  phone?: string;
  moveInDate?: string;
  status?: string;
  apartmentId?: string;
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
      const payload = {
        ...values,
        moveInDate: values.moveInDate ? values.moveInDate.format('YYYY-MM-DD') : null,
      };
      if (editingHousehold) {
        await api.put(`/households/${editingHousehold.id}`, payload);
        message.success('Cập nhật hộ dân thành công!');
      } else {
        await api.post('/households', payload);
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
    form.setFieldsValue({
      ...household,
      moveInDate: household.moveInDate ? dayjs(household.moveInDate) : null,
    });
  };

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
  // Trong danh sách columns của bạn ở file Households.tsx
{
  header: "Hành động",
  accessor: "id", // hoặc field định danh của bạn
  // Phần quan trọng là hàm render bên dưới:
  render: (row: any) => (
    <div className="flex items-center gap-2">
      {/* Nút Sửa - Màu xanh, icon bút chì */}
      <button
        onClick={() => handleEdit(row)} // Thay handleEdit bằng hàm xử lý của bạn
        className="group relative p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 ease-in-out"
        title="Chỉnh sửa"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>

      {/* Nút Xóa - Màu đỏ, icon thùng rác */}
      <button
        onClick={() => handleDelete(row.id)} // Thay handleDelete bằng hàm xử lý của bạn
        className="group relative p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 ease-in-out"
        title="Xóa"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  ),
  className: "w-24 text-center" // Căn chỉnh cột
}
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

      <TableCustom 
        columns={columns} 
        dataSource={households} 
        rowKey="id" 
        loading={loading} 
        pagination={false}
      />

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

