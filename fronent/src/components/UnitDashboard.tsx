import React from 'react';
import { Typography, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const UnitDashboard = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Unit Dashboard</Title>
            <Menu mode="vertical" theme="light" style={{ width: '100%', marginTop: '24px' }}>
                <Menu.Item key="1">
                    <Link to="/unit/add_employee">新增员工</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/unit/view_employees">查看个人信息</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/unit/handle_taxes">处理税款支付</Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link to="/unit/upload_tax_info">上传员工纳税信息</Link>
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default UnitDashboard;
