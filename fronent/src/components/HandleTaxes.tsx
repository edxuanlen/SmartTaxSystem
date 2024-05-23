import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HandleTaxes: React.FC = () => {
    const [taxDue, setTaxDue] = useState<number>(0);

    const fetchTaxDue = async () => {
        try {
            const response = await axios.get('/api/tax/amount_due/');
            setTaxDue(response.data.amount);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePayTaxes = async () => {
        try {
            await axios.post('/api/tax/pay/');
            alert('税款已支付');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTaxDue();
    }, []);

    return (
        <div>
            <h2>处理税款支付</h2>
            {taxDue > 0 ? (
                <div>
                    <p>当前未缴税款: {taxDue} RMB</p>
                    <button onClick={handlePayTaxes}>支付税款</button>
                </div>
            ) : (
                <p>没有未缴税款</p>
            )}
        </div>
    );
};

export default HandleTaxes;
