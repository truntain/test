import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, type FormInstance } from "antd";
import { api } from "../../services/api";

interface HouseholdFormProps {
  form: FormInstance; 
}

interface Apartment {
  id: string | number;
  block: string;
  floor: number | string;
  unit: string;
}

const HouseholdForm: React.FC<HouseholdFormProps> = ({ form }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loadingApt, setLoadingApt] = useState(false);

  useEffect(() => {
    const fetchApartments = async () => {
      setLoadingApt(true);
      try {
        const res = await api.get("/apartments"); 
        const list = Array.isArray(res.data) ? res.data : res.data.content || [];
        setApartments(list);
      } catch (err) {
        console.error("Lỗi tải list căn hộ");
      } finally {
        setLoadingApt(false);
      }
    };
    fetchApartments();
  }, []);

  return (
    <Form form={form} layout="vertical" name="household_form">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Cột Trái */}
        <div>
            <Form.Item
                label="Mã hộ dân (Số sổ hộ khẩu)"
                name="householdId"
                rules={[{ required: true, message: "Vui lòng nhập mã hộ" }]}
            >
                <Input placeholder="VD: HK-2023-01" />
            </Form.Item>

            <Form.Item
                label="Tên chủ hộ"
                name="ownerName"
                rules={[{ required: true, message: "Vui lòng nhập tên chủ hộ" }]}
            >
                <Input placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
                label="Số điện thoại liên hệ"
                name="phone"
                rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                { pattern: /^[0-9]{9,11}$/, message: "SĐT không hợp lệ" },
                ]}
            >
                <Input placeholder="09xxxxxxxxx" />
            </Form.Item>
        </div>

        {/* Cột Phải */}
        <div>
            <Form.Item
                label="Thuộc căn hộ"
                name="apartmentId"
                rules={[{ required: true, message: "Vui lòng chọn căn hộ" }]}
            >
                <Select 
                    placeholder="Chọn căn hộ sở hữu" 
                    loading={loadingApt}
                    showSearch
                    optionFilterProp="children"
                >
                {apartments.map((apt) => (
                    <Select.Option key={apt.id} value={apt.id}>
                        {`${apt.block} - ${apt.unit}`}
                    </Select.Option>
                ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Ngày chuyển đến"
                name="moveInDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
            >
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} placeholder="Chọn ngày" />
            </Form.Item>

            <Form.Item
                label="Trạng thái cư trú"
                name="status"
                initialValue="ACTIVE"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
                <Select placeholder="Chọn trạng thái">
                <Select.Option value="ACTIVE">Thường trú</Select.Option>
                <Select.Option value="TEMPORARY">Tạm trú</Select.Option>
                <Select.Option value="MOVED_OUT">Đã chuyển đi</Select.Option>
                </Select>
            </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default HouseholdForm;