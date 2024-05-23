import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getTokenFromCookie } from '../utils/cookie';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

// 定义表格列的配置
const columns: ColumnsType<any> = [
    {
        title: '发薪日期',
        dataIndex: 'date_joined',
        key: 'date_joined',
    },
    {
        title: '工资明细',
        dataIndex: 'username',
        key: 'username',
        children: [
            {
                title: '税前',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '税后',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '扣税',
                dataIndex: 'name',
                key: 'name',
            },
        ]
    },

];

const ViewEmployees: React.FC = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/api/salary_info/', {
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
            <h2>个人薪酬信息</h2>
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
