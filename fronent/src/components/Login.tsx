// src/components/Login.tsx
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getCookies, getTokenFromCookie, setCookie, setTokenCookie } from '../utils/cookie';
import { flushSync } from 'react-dom';

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const cookies = getCookies();
        const token = cookies?.token;
        if (token !== undefined) {
            switch (cookies?.user_type) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'unit':
                    navigate('/unit');
                    break;
                case 'employee':
                    navigate('/unit/salary_details');
                    break;
                case undefined:
                    navigate('/');
                    break;
            };
        }
    }, []);

    const onFinish = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            let response = await axios.post('/api/login/', values);
            if (response.data.token) {
                setTokenCookie(response.data.token);
                // setCookie('user_type', response.data.user_type);

                response = await axios.get('/api/current_user/', {
                    headers: { Authorization: `Token ${response.data.token}` }
                });
                message.info('User fetched successfully');
                setUser(response.data.user);
                setCookie('user_type', response.data.user.user_type);

                console.log(response.data.user);
                switch (response.data.user.user_type) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'unit':
                        navigate('/unit');
                        break;
                    case 'employee':
                        navigate('/unit/salary_details');
                        break;
                };
                window.location.reload();
            } else {
                message.error('Login failed: ' + response.data.message);
            }
        } catch (error) {
            message.error('Login failed: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '300px', margin: 'auto', paddingTop: '100px' }}>
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <a style={{ float: 'right' }} href="">
                        Forgot password
                    </a>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
