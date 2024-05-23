import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getTokenFromCookie } from '../utils/cookie';
import { Card, Button } from 'antd';

const HandleTaxes: React.FC = () => {
    const [taxDue, setTaxDue] = useState<number>(0);

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
            await axios.post('/api/tax/pay/', { "tax_amount_due": taxDue }, {
                headers: {
                    'Authorization': `Token ${getTokenFromCookie()}`
                }
            });
            alert('税款已支付');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTaxDue();
    }, []);

    return (
        <Card title="处理税款支付">
            <div style={{ marginTop: '10%', display: 'flex', flexDirection: 'row' }}>
                {taxDue > 0 ? (
                    <div>
                        <p style={{ fontSize: '20px' }}>当前未缴税款: {taxDue} RMB</p>
                        <Button type="primary" onClick={handlePayTaxes}>
                            支付税款
                        </Button>
                    </div>
                ) : (
                    <p style={{ fontSize: '20px' }}>没有未缴税款</p>
                )}
            </div>
        </Card>
    );
};

export default HandleTaxes;
