import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getTokenFromCookie } from '../utils/cookie';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

// 定义表格列的配置
const columns: ColumnsType<any> = [
    {
        title: '发薪日期',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: '工资明细',
        children: [
            {
                title: '税前',
                dataIndex: 'monthly_salary',
                key: 'monthly_salary',
            },
            {
                title: '税后',
                dataIndex: 'net_salary',
                key: 'net_salary',
            },
            {
                title: '扣税',
                dataIndex: 'tax_amount',
                key: 'tax_amount',
            },
        ]
    },

];

const ViewEmployees: React.FC = () => {
    const [records, setRecords] = useState([]);

    const fetchSalaryRecords = async () => {
        try {
            const response = await axios.get('/api/salary_info/', {
                headers: {
                    'Authorization': `Token ${getTokenFromCookie()}`,
                },
            });

            await setRecords(response.data.salary_infos);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchSalaryRecords();
    }, []);

    return (
        <div>
            <h2>个人薪酬信息</h2>
            <Table
                rowKey="private_key"
                columns={columns}
                dataSource={records}
                pagination={false}
            />
        </div>
    );
};

export default ViewEmployees;
