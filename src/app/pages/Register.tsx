import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
    setLoading(true);
    try {
      if (values.password !== values.confirmPassword) {
        message.error('Mật khẩu xác nhận không khớp!');
        return;
      }

      // Giả lập đăng ký thành công
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      message.error('Lỗi đăng ký!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={3}>Đăng ký tài khoản</Title>
          <p>Tạo tài khoản mới để sử dụng hệ thống</p>
        </div>

        <Form name="register" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên tài khoản" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Đã có tài khoản?{' '}
            <a onClick={() => navigate('/login')} style={{ color: '#1677ff' }}>
              Đăng nhập ngay
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;

/*import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const values = await form.validateFields();
      // Giả lập tạo tài khoản thành công
      console.log('Tài khoản mới:', values);
      message.success('Đăng ký thành công (fake)!');
      // Sau khi đăng ký, điều hướng về login
      navigate('/login');
    } catch (err: any) {
      message.error('Vui lòng nhập đầy đủ thông tin');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto' }}>
      <h2>Đăng ký tài khoản</h2>
      <Form form={form} layout="vertical">
        <Form.Item name="username" label="Tên tài khoản" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="confirmPassword" label="Xác nhận mật khẩu" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" onClick={handleRegister} block>
          Đăng ký
        </Button>
      </Form>
    </div>
  );
};

export default Register;*/

