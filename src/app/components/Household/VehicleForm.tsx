import React from "react";
import { Form, Input, Select, Row, Col, type FormInstance } from "antd";

interface VehicleFormProps {
  form: FormInstance;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical" name="vehicle_form">
      <Row gutter={16}>
        {/* Cột Trái */}
        <Col span={12}>
          <Form.Item
            label="Biển số xe"
            name="plate" // Sửa từ licensePlate -> plate
            rules={[{ required: true, message: "Vui lòng nhập biển số" }]}
          >
            <Input placeholder="Ví dụ: 30A-123.45" />
          </Form.Item>

          <Form.Item
            label="Loại xe"
            name="type"
            rules={[{ required: true, message: "Chọn loại xe" }]}
          >
            <Select placeholder="Chọn loại xe">
              <Select.Option value="MOTORBIKE">Xe máy</Select.Option>
              <Select.Option value="CAR">Ô tô</Select.Option>
              <Select.Option value="ELECTRIC_BIKE">Xe đạp điện</Select.Option>
              <Select.Option value="BICYCLE">Xe đạp</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Mã hộ sở hữu"
            name="householdId"
            rules={[{ required: true, message: "Nhập mã hộ gia đình" }]}
          >
            <Input placeholder="Ví dụ: HK001" />
          </Form.Item>
        </Col>

        {/* Cột Phải */}
        <Col span={12}>
          <Form.Item
            label="Hãng sản xuất"
            name="brand"
            rules={[{ required: true, message: "Nhập hãng xe" }]}
          >
            <Input placeholder="Ví dụ: Honda, Toyota..." />
          </Form.Item>

          <Form.Item
            label="Màu sắc"
            name="color"
            rules={[{ required: true, message: "Nhập màu xe" }]}
          >
            <Input placeholder="Ví dụ: Đỏ, Đen..." />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            initialValue="ACTIVE"
            rules={[{ required: true, message: "Chọn trạng thái" }]}
          >
            <Select placeholder="Trạng thái">
              <Select.Option value="ACTIVE">Đang hoạt động</Select.Option>
              <Select.Option value="INACTIVE">Ngừng hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default VehicleForm;