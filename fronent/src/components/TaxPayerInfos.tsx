import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { getTokenFromCookie } from '../utils/cookie';

const columns: ColumnsType<any> = [
    {
        title: '企业名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '加入日期',
        dataIndex: 'date_joined',
        key: 'date_joined',
    },
];

const EmployeeTable: React.FC<{ employees: any[] }> = ({ employees }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [salaryHistory, setSalaryHistory] = useState([]);
    const handleSalaryClick = async (record: any) => {
        try {
            const response = await axios.get(`/api/salary-history?employee_id=${record.id}`, {
                headers: {
                    'Authorization': `Token ${getTokenFromCookie()}`,
                },
            });
            setSalaryHistory(response.data.salaries);
            setModalVisible(true);
        } catch (error) {
            console.error(error);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const employeeColumns: ColumnsType<any> = [
        {
            title: '员工名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '工资',
            dataIndex: 'monthly_salary',
            key: 'monthly_salary',
            render: (text, record) => (
                <span style={{ cursor: 'pointer' }} onClick={() => handleSalaryClick(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: '加入日期',
            dataIndex: 'date_joined',
            key: 'date_joined',
        },
    ];

    const salaryHistoryColumns = [
        {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '工资',
            dataIndex: 'monthly_salary',
            key: 'monthly_salary',
        },
    ];

    return (
        <div>
            <Table
                rowKey="id"
                columns={employeeColumns}
                dataSource={employees}
                pagination={false}
            />
            <Modal
                title="历史月薪列表"
                visible={modalVisible}
                onCancel={closeModal}
                footer={null}
            >
                <Table
                    rowKey="id"
                    columns={salaryHistoryColumns}
                    dataSource={salaryHistory}
                    pagination={false}
                />
            </Modal>
        </div>
    );
};

const TaxPayerInfos: React.FC = () => {
    const [units, setUnits] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [employeesData, setEmployeesData] = useState<{ [key: string]: any[] }>({});

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await axios.get('/api/employees/', {
                    headers: {
                        'Authorization': `Token ${getTokenFromCookie()}`,
                    },
                });
                setUnits(response.data.employees);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUnits();
    }, []);

    const handleExpand = async (expanded: boolean, record: any) => {
        if (expanded) {
            setLoading(true);
            try {
                const response = await axios.get(`/api/employees?unit_id=${record.id}`, {
                    headers: {
                        'Authorization': `Token ${getTokenFromCookie()}`,
                    },
                });
                await setEmployeesData((prevData) => ({
                    ...prevData,
                    [record.id]: response.data.employees,
                }));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
            setExpandedRowKeys([record.id]);
        } else {
            setExpandedRowKeys([]);
        }
    };

    return (
        <div>
            <h2>查看企业信息</h2>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={units}
                expandable={{
                    expandedRowRender: record => (
                        <EmployeeTable employees={employeesData[record.id] || []} />
                    ),
                    expandRowByClick: true,
                    expandedRowKeys: expandedRowKeys,
                    onExpand: handleExpand,
                }}
                loading={loading}
                pagination={false}
            />
        </div>
    );
};

export default TaxPayerInfos;
