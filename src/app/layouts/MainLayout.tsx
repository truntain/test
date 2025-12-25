import React from 'react';
import { Layout, Menu, theme, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  PieChartOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      localStorage.removeItem('token'); // Xóa token khi logout
      navigate('/login');
    } else {
      navigate(key);
    }
  };

  const items = [
    { key: '/dashboard', icon: <PieChartOutlined />, label: 'Dashboard' },
    { key: '/households', icon: <HomeOutlined />, label: 'Quản lý Hộ dân' },
    { key: '/users', icon: <UserOutlined />, label: 'Quản lý Tài khoản' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} collapsedWidth={80} collapsible>
        <div
          style={{
            height: 48,
            margin: 16,
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          Quản Lý Dân Cư
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 500 }}>Xin chào, Admin</span>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
          >
            Đăng xuất
          </Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Quản lý dân cư ©2025</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
