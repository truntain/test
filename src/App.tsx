import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './app/pages/Login';
import Register from './app/pages/Register';
import Dashboard from './app/pages/Dashboard';
import Users from './app/pages/Users';
import Households from './app/pages/Households';
import Persons from './app/pages/Persons';
import HouseholdDetail from './app/pages/HouseholdDetail';
import MainLayout from './app/layouts/MainLayout';
import PrivateRoute from './routes/PrivateRoute';

// --- IMPORT MỚI ---
import Apartments from './app/pages/Apartments';
import FeeItems from './app/pages/FeeItems';
import FeePeriods from './app/pages/FeePeriods';
import FeeObligations from './app/pages/FeeObligations';
import Residents from './app/pages/Resident';
import Vehicles from './app/pages/Vehicles';

export default function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            
            {/* --- SỬA LẠI KHÚC NÀY CHO KHỚP VỚI MENU --- */}
            {/* MainLayout đang gọi /fee-items nên ở đây path phải là "fee-items" */}
            <Route path="fee-items" element={<PrivateRoute><FeeItems /></PrivateRoute>} />
            <Route path="fee-periods" element={<PrivateRoute><FeePeriods /></PrivateRoute>} />
            <Route path="fee-obligations" element={<PrivateRoute><FeeObligations /></PrivateRoute>} />
            {/* 1. Danh sách Hộ dân */}
            <Route path="households" element={<PrivateRoute><Households /></PrivateRoute>} />
            
            {/* 2. Chi tiết 1 Hộ dân */}
            <Route path="households/:id" element={<PrivateRoute><HouseholdDetail /></PrivateRoute>} />

            {/* 3. Thông tin Cư dân (Toàn bộ) - Khớp với menu /residents */}
            <Route path="residents" element={<PrivateRoute><Residents /></PrivateRoute>} />

            {/* 4. Quản lý Phương tiện (Toàn bộ) - Khớp với menu /vehicles */}
            <Route path="vehicles" element={<PrivateRoute><Vehicles /></PrivateRoute>} />
            {/* ------------------------------------------- */}

            {/* Các route khác (nếu MainLayout gọi /apartments thì giữ nguyên) */}
            <Route path="apartments" element={<PrivateRoute><Apartments /></PrivateRoute>} />

            <Route path="households" element={<PrivateRoute><Households /></PrivateRoute>} />
            <Route path="households/:id" element={<PrivateRoute><HouseholdDetail /></PrivateRoute>} />
            <Route path="users" element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="persons/:householdId" element={<PrivateRoute><Persons /></PrivateRoute>} />

            
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}