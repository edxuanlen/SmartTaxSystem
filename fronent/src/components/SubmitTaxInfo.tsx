import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getTokenFromCookie } from '../utils/cookie';
import { ColumnsType } from 'antd/es/table';

interface TaxRecord {
    unit_address: string;
    total_tax_due: bigint;
    tax_amount: number;
    date: Date;
}

const columns: ColumnsType<any> = [
    {
        title: '纳税时间',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: '纳税金额',
        dataIndex: 'tax_amount',
        key: 'tax_amount',
    },
    {
        title: '留存未缴税款',
        dataIndex: 'total_tax_due',
        key: 'total_tax_due',
    },
];


const SubmitTaxInfoPage: React.FC = () => {
    const [form] = Form.useForm();
    const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);
    const [fetch, setFetch] = useState<boolean>(false);


    const fetchTaxRecords = async () => {
        try {
            const response = await axios.get('/api/tax/records/', {
                headers: {
                    'Authorization': `Token ${getTokenFromCookie()}`
                }
            });
            // console.log("response", response.data.data);
            setTaxRecords(response?.data?.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTaxRecords();
    }, [fetch]);


    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/tax/upload_records/', taxRecords, {
                headers: {
                    'Authorization': `Token ${getTokenFromCookie()}`
                }
            });
            if (response.data.success) {
                message.success('纳税记录同步成功');
            } else {
                message.error('纳税记录同步失败');
            }
        } catch (error) {
            console.error(error);
            message.error('纳税记录同步失败');
        }
    };

    return (
        <div>
            <h2>纳税记录</h2>
            <Table
                rowKey="private_key"
                columns={columns}
                dataSource={taxRecords}
                pagination={false}
            />

            <Button type="primary" onClick={handleSubmit} style={{
                marginLeft: '5%', marginTop: '5%', marginBottom: 16
            }}>
                同步纳税信息
            </Button>
        </div>
    );
};

export default SubmitTaxInfoPage;
