import React from "react";
import { Form, Input, DatePicker, Select, Checkbox } from "antd";

interface ResidentFormProps {
  form: any; // FormInstance từ antd
}

const ResidentForm: React.FC<ResidentFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Họ và tên"
        name="fullName"
        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
      >
        <Input placeholder="Nhập họ tên" />
      </Form.Item>

      <Form.Item
        label="Ngày sinh"
        name="dob"
        rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Giới tính"
        name="gender"
        rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
      >
        <Select placeholder="Chọn giới tính">
          <Select.Option value="MALE">Nam</Select.Option>
          <Select.Option value="FEMALE">Nữ</Select.Option>
          <Select.Option value="OTHER">Khác</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Số CMND/CCCD"
        name="idNumber"
        rules={[{ required: true, message: "Vui lòng nhập số CMND/CCCD" }]}
      >
        <Input placeholder="Nhập số CMND/CCCD" />
      </Form.Item>

      <Form.Item
        label="Quan hệ với chủ hộ"
        name="relationshipToHead"
        rules={[{ required: true, message: "Vui lòng nhập quan hệ với chủ hộ" }]}
      >
        <Input placeholder="Ví dụ: Vợ, Con, Anh, Em..." />
      </Form.Item>

      <Form.Item name="isHead" valuePropName="checked">
        <Checkbox>Đặt làm chủ hộ</Checkbox>
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
      >
        <Select placeholder="Chọn trạng thái">
          <Select.Option value="ACTIVE">Đang ở</Select.Option>
          <Select.Option value="TAM_VANG">Tạm vắng</Select.Option>
          <Select.Option value="MOVED_OUT">Đã chuyển đi</Select.Option>
          <Select.Option value="DECEASED">Đã mất</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default ResidentForm;
