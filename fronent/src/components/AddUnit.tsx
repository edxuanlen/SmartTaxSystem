import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message } from 'antd';
import { getTokenFromCookie } from '../utils/cookie';

const { Title } = Typography;

const AddUnit: React.FC = () => {
    const [form] = Form.useForm();

    const getPrivateKey = async () => {
        try {
            let response = await axios.get('/api/private_key/', {
                headers: { 'Authorization': `Token ${getTokenFromCookie()}` }
            });
            if (response.data.pk) {
                form.setFieldsValue({ private_key: response.data.pk }); // Update the form value
                message.success('获取私钥成功');
            } else {
                message.error('获取私钥失败，请补充私钥');
            }
        } catch (error) {
            message.error('获取私钥失败，请补充私钥');
        } finally {
        }
    };

    useEffect(() => {
        getPrivateKey();
    }, []);

    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);
        try {
            let response = await axios.post('/api/create_unit/', values, {
                headers: { 'Authorization': `Token ${getTokenFromCookie()}` }
            });
            if (response.data.user) {
                message.success('新增单位成功');
                getPrivateKey();
            } else {
                message.error('Login failed: ' + response.data.message);
            }
        } catch (error) {
            message.error('Login failed: ' + (error as Error).message);
        } finally {
        }
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical" style={{ width: '50%' }}>
            <Title level={2}>新增单位</Title>
            <Form.Item
                name="username"
                label="单位名"
                rules={[{ required: true, message: '请输入单位名' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="private_key"
                label="私钥"
                rules={[{ required: true, message: '请输入私钥' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddUnit;
