// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddEmployee from './components/AddEmployee';
import ViewEmployees from './components/ViewEmployees';
import HandleTaxes from './components/HandleTaxes';
import UploadTaxInfo from './components/UploadTaxInfo';
import GalaryDetails from './components/GalaryDetails';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Row, Col, Button } from 'antd';
import { time } from 'console';
import { getCookieByKey, getCookies, getTokenFromCookie } from './utils/cookie';


const ProtectedRoute: React.FC<{ children: JSX.Element; roles: string[] }> = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.user_type)) {
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

      console.log("extractedSuffix: ", extractedSuffix);
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
                {(() => {
                  const cookies = getCookies();
                  console.log(cookies);
                  if (cookies?.token !== undefined &&
                    cookies?.user_type == 'admin') {
                    window.location.href = 'http://127.0.0.1:8000/admin';
                  }
                  return <div />;
                })()}
              </ProtectedRoute>
            }
          />
          <Route
            path="/unit"
            element={
              <ProtectedRoute roles={['unit']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <Dashboard />
                  </Col>
                  <Col span={18}>
                    <h1> Welcome to Unit Dashboard! </h1>
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/galary_details"
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
            path="/add-employee"
            element={
              <ProtectedRoute roles={['unit']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <Dashboard />
                  </Col>
                  <Col span={18}>
                    <AddEmployee />
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-employees"
            element={
              <ProtectedRoute roles={['unit']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <Dashboard />
                  </Col>
                  <Col span={18}>
                    <ViewEmployees />
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/handle-taxes"
            element={
              <ProtectedRoute roles={['unit']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <Dashboard />
                  </Col>
                  <Col span={18}>
                    <HandleTaxes />
                  </Col>
                </Row>
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-tax-info"
            element={
              <ProtectedRoute roles={['unit']}>
                <Row gutter={24}>
                  <Col span={6}>
                    <Dashboard />
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
