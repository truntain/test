import React from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, BankOutlined } from '@ant-design/icons'; // Thêm icon
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

 
  /* // Code gọi API thật (bỏ comment khi backend sẵn sàng)
  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      const res = await axios.post('http://localhost:8080/api/auth/login', values);
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        message.success('Đăng nhập thành công!');
        navigate('/dashboard');
      } else {
        message.error('Phản hồi không hợp lệ từ server');
      }
    } catch (err: any) {
      console.error(err); // log lỗi để không crash
      message.error('Sai tài khoản hoặc mật khẩu');
    }
  };
  */

  // Code giả lập (Fake login) hiện tại đang dùng
  const handleLogin = async () => {
    try {
      await form.validateFields();
      // Giả lập gọi API thành công
      const fakeToken = "demo-token-123"; 
      localStorage.setItem('token', fakeToken);
      message.success('Chào mừng quay trở lại Blue Moon!');
      navigate('/dashboard');
    } catch (err: any) {
      message.error('Vui lòng kiểm tra lại thông tin nhập');
    }
  };

  // --- KẾT THÚC PHẦN LOGIC ---

  return (
    <div style={styles.container}>
      {/* Đây là lớp phủ màu đen làm tối ảnh nền */}
      <div style={styles.overlay}></div>

      <Card style={styles.card} bordered={false}>
        {/* Phần Header chứa tên chung cư */}
        <div style={styles.headerContainer}>
           {/* Icon tòa nhà (tùy chọn) */}
          <BankOutlined style={{ fontSize: 36, color: '#1890ff', marginBottom: 10 }} />
          <Title level={2} style={{ margin: '0 0 5px 0', color: '#1f1f1f' }}>
            Blue Moon
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Hệ thống quản lý chung cư
          </Text>
        </div>

        {/* Form đăng nhập */}
        <Form
          form={form}
          layout="vertical"
          size="large"
          onFinish={handleLogin} // Sự kiện submit form
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" style={{ color: '#bfbfbf' }} />} 
              placeholder="Tên tài khoản / Email" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" style={{ color: '#bfbfbf' }} />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button type="primary" htmlType="submit" block style={styles.btnSubmit}>
              Đăng nhập
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
             <Text type="secondary">Cư dân mới? </Text>
            <Button type="link" onClick={() => navigate('/register')} style={{ padding: 0, fontWeight: 500 }}>
              Đăng ký tài khoản
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

// --- PHẦN CSS STYLES ---
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', // Chiều cao full màn hình
    // THAY LINK ẢNH NỀN CỦA BẠN VÀO ĐÂY
    backgroundImage: 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative' as const, // Quan trọng để đặt lớp phủ
  },
  // Lớp phủ làm tối ảnh nền
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Màu đen mờ (0.5 là độ đậm 50%), tăng lên nếu muốn tối hơn (VD: 0.7)
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    zIndex: 0, // Nằm dưới Card
    backdropFilter: 'blur(2px)', // (Tùy chọn) Làm mờ ảnh nền đi một chút nhìn sẽ ảo hơn
  },
  card: {
    width: '100%',
    maxWidth: 420, // Độ rộng tối đa của khung đăng nhập
    zIndex: 1, // Nằm trên lớp phủ
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)', // Đổ bóng đẹp
    borderRadius: 16, // Bo góc mềm mại
    padding: '30px 25px 15px',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  headerContainer: {
    textAlign: 'center' as const,
    marginBottom: 35,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  btnSubmit: {
    fontWeight: 600,
    height: 45, // Nút cao hơn
    fontSize: 16,
    borderRadius: 8,
    marginTop: 10,
  }
};

export default Login;