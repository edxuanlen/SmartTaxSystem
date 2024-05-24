// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import UnitDashboard from './components/UnitDashboard';
import AddEmployee from './components/AddEmployee';
import ViewEmployees from './components/ViewEmployees';
import HandleTaxes from './components/HandleTaxes';
import UploadTaxInfo from './components/SubmitTaxInfo';
import GalaryDetails from './components/GalaryDetails';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Row, Col, Button } from 'antd';
import AdminDashboard from './components/AdminDashboard';
import AddUnit from './components/AddUnit';
import TaxRecords from './components/TaxRecords';
import Backend from './components/Backend';
import { getCookieByKey, getCookies } from './utils/cookie';


const ProtectedRoute: React.FC<{ children: JSX.Element; roles: string[] }> = ({ children, roles }) => {
  const cookies = getCookies();

  if (!(cookies?.user_type)) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(cookies?.user_type)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};




const App: React.FC = () => {


  const onLogout = () => {

    // 获取当前的 cookie
    const cookies = document.cookie.split('; ');

    // 遍历每个 cookie,并设置过期时间为过去的时间
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }

    window.location.href = '/login';
  }

  useEffect(() => {
    const path = window.location.pathname;
    const lastDotIndex = path.lastIndexOf('/');
    if (lastDotIndex !== -1) {
      const extractedSuffix = path.slice(lastDotIndex + 1);
      if (extractedSuffix === 'logout') {
        onLogout();
      }

    }
  }, []);

  return (
    <AuthProvider>
      <Button type="primary" onClick={onLogout}>Logout</Button>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <AdminDashboard />
                  </Col>
                  <Col span={18}>
                    <h1> Welcome to Admin Dashboard! </h1>
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/backend"
            element={
              <ProtectedRoute roles={['admin']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <AdminDashboard />
                  </Col>
                  <Col span={18}>
                    <Backend />
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add_unit"
            element={
              <ProtectedRoute roles={['admin']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <AdminDashboard />
                  </Col>
                  <Col span={18}>
                    <AddUnit />
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/unit_records"
            element={
              <ProtectedRoute roles={['admin']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <AdminDashboard />
                  </Col>
                  <Col span={18}>
                    <TaxRecords />
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/unit"
            element={
              <ProtectedRoute roles={['unit']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <UnitDashboard />
                  </Col>
                  <Col span={18}>
                    <h1> Welcome to Unit Dashboard! </h1>
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/unit/galary_details"
            element={
              <ProtectedRoute roles={['employee']}>
                <Row gutter={24}>
                  <Col span={4} />
                  <Col span={16}>
                    <GalaryDetails />
                  </Col>
                  <Col span={4} />
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/unit/add_employee"
            element={
              <ProtectedRoute roles={['unit']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <UnitDashboard />
                  </Col>
                  <Col span={18}>
                    <AddEmployee />
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/unit/view_employees"
            element={
              <ProtectedRoute roles={['unit']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <UnitDashboard />
                  </Col>
                  <Col span={18}>
                    <ViewEmployees />
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/unit/handle_taxes"
            element={
              <ProtectedRoute roles={['unit']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <UnitDashboard />
                  </Col>
                  <Col span={18}>
                    <HandleTaxes />
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/unit/upload_tax_info"
            element={
              <ProtectedRoute roles={['unit']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <UnitDashboard />
                  </Col>
                  <Col span={18}>
                    <UploadTaxInfo />
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
