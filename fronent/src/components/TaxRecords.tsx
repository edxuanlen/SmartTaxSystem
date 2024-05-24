import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getTokenFromCookie } from '../utils/cookie';
import { Button, Space, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface TaxRecord {
    record_id: number;
    unit_name: string;
    total_tax_due: bigint;
    payment_amount: bigint;
    payment_date: Date;
    submit_time: Date;
    audit_status: number;
    approve_status: number;
}

const TaxRecords: React.FC = () => {
    const [records, setRecords] = useState<TaxRecord[]>([]);

    const fetchRecords = async () => {
        try {
            const response = await axios.get('/api/tax/unit_records/', {
                headers: {
                    'Authorization': `Token ${getTokenFromCookie()}`,
                },
            });

            if (response.data.success) {
                message.success('获取成功');
                await setRecords(response.data.records);
            } else {
                message.error('获取失败');
            }

        } catch (error) {
            console.error(error);
            message.error('获取失败');
        }
    };
    useEffect(() => {
        fetchRecords();
    }, []);

    const handleAudit = async (record: any) => {
        console.log('智能稽核记录:', record);

        // 调用智能稽核接口进行税务系统信息的审核
        try {
            const response = await axios.post('/api/tax/audit/',
                { "record_id": record.record_id },
                {
                    headers: {
                        'Authorization': `Token ${getTokenFromCookie()}`
                    }
                });
            if (response.data.success) {
                message.info('审核成功');
            } else {
                message.error('审核失败');
            }
        } catch (error) {
            console.error(error);
        } finally {
            fetchRecords();
        }

    };

    const handleApproval = async (record: any) => {
        // 处理驳回/通过逻辑
        const is_pass = record.audit_status === 1;

        // 调用智能稽核接口进行税务系统信息的审核
        try {
            const api = is_pass ? 'approve' : 'reject';
            const response = await axios.post('/api/tax/' + api + '/',
                { "record_id": record.record_id },
                {
                    headers: {
                        'Authorization': `Token ${getTokenFromCookie()}`
                    }
                });
            if (response.data.success) {
                message.info('审核成功');
            } else {
                message.error('审核失败');
            }
        } catch (error) {
            console.error(error);
        } finally {
            fetchRecords();
        }
    };

    // 定义表格列的配置
    const columns: ColumnsType<any> = [
        {
            title: '单位名',
            dataIndex: 'unit_name',
            key: 'unit_name',
        },
        {
            title: '未清结税额',
            dataIndex: 'total_tax_due',
            key: 'total_tax_due',
        },
        {
            title: '支付税额',
            dataIndex: 'payment_amount',
            key: 'payment_amount',
        },
        {
            title: '税款生成时间',
            dataIndex: 'payment_date',
            key: 'payment_date',
        },
        {
            title: '税款提交时间',
            dataIndex: 'submit_time',
            key: 'submit_time',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleAudit(record)}>
                        {record.audit_status === 0 ? '智能稽核' :
                            (record.audit_status === 1 ? '已通过审核' : '不通过')}
                    </Button>
                    <Button onClick={() => handleApproval(record)}>
                        {record.approve_status === 1 ? '已通过' :
                            (record.approve_status === -1 ? '已驳回' : (
                                record.audit_status === -1 ? '驳回' : '通过'
                            ))}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ width: '100%' }}>
            <h2>税务系统信息</h2>
            <Table
                rowKey="private_key"
                columns={columns}
                dataSource={records}
                pagination={false}
            />
        </div>
    );
};

export default TaxRecords;
