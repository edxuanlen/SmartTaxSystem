import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getTokenFromCookie } from '../utils/cookie';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

// 定义表格列的配置
const columns: ColumnsType<any> = [
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '月薪',
        dataIndex: 'monthly_salary',
        key: 'monthly_salary',
    },
    {
        title: '加入日期',
        dataIndex: 'date_joined',
        key: 'date_joined',
    },
];

const ViewEmployees: React.FC = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/api/employees/', {
                    headers: {
                        'Authorization': `Token ${getTokenFromCookie()}`,
                    },
                });

                await setEmployees(response.data.employees);
            } catch (error) {
                console.error(error);
            }
        };
        fetchEmployees();
    }, []);

    return (
        <div>
            <h2>查看个人信息</h2>
            <Table
                rowKey="private_key"
                columns={columns}
                dataSource={employees}
                pagination={false}
            />
        </div>
    );
};

export default ViewEmployees;
