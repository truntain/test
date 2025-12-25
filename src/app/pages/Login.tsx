import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  /*const handleLogin = async () => {
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
  };*/
  const handleLogin = async () => {
  try {
    const values = await form.validateFields();
    // Giả lập gọi API thành công
    const fakeToken = "demo-token-123"; 
    localStorage.setItem('token', fakeToken);
    message.success('Đăng nhập thành công (fake)!');
    navigate('/dashboard');
  } catch (err: any) {
    message.error('Sai tài khoản hoặc mật khẩu');
  }
};


  return (
    <div style={{ maxWidth: 400, margin: '60px auto' }}>
      <h2>Đăng nhập</h2>
      <Form form={form} layout="vertical">
        <Form.Item name="username" label="Tên tài khoản" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" onClick={handleLogin} block>
          Đăng nhập
        </Button>
        <Button type="link" onClick={() => navigate('/register')}>
          Đăng ký
        </Button>

      </Form>
    </div>
  );
};

export default Login;
