import React, { useEffect } from "react";
import { Form, Input, DatePicker, Select, Checkbox, Row, Col, type FormInstance } from "antd";

// Import hỗ trợ tiếng Việt cho lịch (DatePicker)
import "dayjs/locale/vi"; 
import locale from "antd/es/date-picker/locale/vi_VN"; 

interface ResidentFormProps {
  form: FormInstance;
}

const ResidentForm: React.FC<ResidentFormProps> = ({ form }) => {
  
  const isHead = Form.useWatch("isHead", form);

  // Tự động điền khi chọn chủ hộ
  useEffect(() => {
    if (isHead) {
      form.setFieldValue("relationshipToHead", "Chủ hộ");
    }
  }, [isHead, form]);

  return (
    <Form form={form} layout="vertical" name="resident_form">
      <Row gutter={16}>
        {/* === CỘT TRÁI === */}
        <Col span={12}>
          <Form.Item
            label="Họ và tên"
            name="fullName" // GIỮ NGUYÊN (Tên biến gửi về Server)
            rules={[
              { required: true, message: "Vui lòng nhập họ tên" },
              { whitespace: true, message: "Không được để trống tên" }
            ]}
          >
            <Input placeholder="Ví dụ: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth" // GIỮ NGUYÊN
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            {/* Thêm locale={locale} để lịch hiện Thứ Hai, Thứ Ba... thay vì Mon, Tue */}
            <DatePicker 
                format="DD/MM/YYYY" 
                style={{ width: "100%" }} 
                placeholder="Chọn ngày/tháng/năm"
                locale={locale} 
            />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender" // GIỮ NGUYÊN
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select placeholder="-- Chọn giới tính --">
              {/* value="MALE" là gửi về máy chủ, "Nam" là hiển thị cho người dùng */}
              <Select.Option value="MALE">Nam</Select.Option>
              <Select.Option value="FEMALE">Nữ</Select.Option>
              <Select.Option value="OTHER">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Số CMND/CCCD"
            name="identityCard" // GIỮ NGUYÊN
            rules={[
              { required: true, message: "Vui lòng nhập số giấy tờ" },
              { pattern: /^[0-9]+$/, message: "Chỉ được nhập số" },
              { min: 9, max: 12, message: "Độ dài từ 9-12 số" }
            ]}
          >
            <Input placeholder="Ví dụ: 012345678912" maxLength={12} />
          </Form.Item>
        </Col>

        {/* === CỘT PHẢI === */}
        <Col span={12}>
          <Form.Item
            label="Số điện thoại"
            name="phone" // GIỮ NGUYÊN
            rules={[
               { pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: "Số điện thoại không đúng định dạng VN" }
            ]}
          >
             <Input placeholder="Ví dụ: 0912345678" maxLength={10} />
          </Form.Item>
          
          <Form.Item
            label="Quan hệ với chủ hộ"
            name="relationshipToHead" // GIỮ NGUYÊN
            rules={[{ required: !isHead, message: "Vui lòng nhập quan hệ (Vợ, Con...)" }]}
          >
            <Input placeholder={isHead ? "Là chủ hộ" : "Ví dụ: Con ruột, Vợ, Chồng..."} disabled={isHead} />
          </Form.Item>

          <Form.Item
            label="Trạng thái cư trú"
            name="status" // GIỮ NGUYÊN
            initialValue="ACTIVE" // GIỮ NGUYÊN (Giá trị mặc định gửi đi)
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="-- Chọn trạng thái --">
              <Select.Option value="ACTIVE">Thường trú (Đang sinh sống)</Select.Option>
              <Select.Option value="TEMPORARY">Tạm trú</Select.Option>
              <Select.Option value="ABSENT">Tạm vắng</Select.Option>
              <Select.Option value="MOVED_OUT">Đã chuyển đi</Select.Option>
              <Select.Option value="DECEASED">Đã qua đời</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="isHead" valuePropName="checked" style={{ marginTop: 24 }}>
            <Checkbox style={{ fontWeight: 500 }}>Đây là Chủ hộ</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ResidentForm;