import React from 'react';
import { Typography, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const AdminDashboard = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Admin Dashboard</Title>
            <Menu mode="vertical" theme="light" style={{ width: '100%', marginTop: '24px' }}>
                <Menu.Item key="1">
                    <Link to="/admin/add_unit">新增单位</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/admin/taxpayer">纳税信息管理</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/admin/unit_records">税务系统</Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link to="/admin/backend">后台管理</Link>
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default AdminDashboard;
