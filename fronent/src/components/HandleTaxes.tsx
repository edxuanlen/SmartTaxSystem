import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getTokenFromCookie } from '../utils/cookie';
import { Card, Button, message } from 'antd';

const HandleTaxes: React.FC = () => {
    const [taxDue, setTaxDue] = useState<number>(0);
    const [fetch, setFetch] = useState<boolean>(false);

    const fetchTaxDue = async () => {
        try {
            const response = await axios.get('/api/tax/amount_due/', {
                headers: {
                    'Authorization': `Token ${getTokenFromCookie()}`
                }
            });
            setTaxDue(response.data.tax_amount_due);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePayTaxes = async () => {
        try {
            const response = await axios.post('/api/tax/pay/', { "tax_amount_due": taxDue }, {
                headers: {
                    'Authorization': `Token ${getTokenFromCookie()}`
                }
            });
            if (response.data.success) {
                message.success('已支付税款');
            } else {
                message.error('支付失败');
            }

        } catch (error) {
            message.error('支付失败');
            console.error(error);
        } finally {
            setFetch(!fetch);
        }
    };

    const handleSettleTaxes = async () => {
        try {
            const response = await axios.get('/api/tax/settle/', {
                headers: {
                    'Authorization': `Token ${getTokenFromCookie()}`
                }
            });
            if (response.data.success) {
                message.success('已结算本期税款');
            } else {
                message.error('结算失败');
            }
        } catch (error) {
            console.error(error);
            message.error('提交结算失败');
        } finally {
            setFetch(!fetch);
        }
    };

    useEffect(() => {
        fetchTaxDue();
    }, [fetch]);

    return (
        <Card title="处理税款支付">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {taxDue > 0 ? (
                    <div>
                        <p style={{ fontSize: '20px' }}>当前未缴税款: {taxDue} RMB</p>
                        <Button type="primary" onClick={handlePayTaxes}>
                            支付税款
                        </Button>
                    </div>
                ) : (
                    <div>
                        <p style={{ fontSize: '20px' }}> 当前没有待缴税额 </p>
                        <Button type="primary" onClick={handleSettleTaxes}>
                            结算本期税款
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default HandleTaxes;
