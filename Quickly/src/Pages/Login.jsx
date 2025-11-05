import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if user is already logged in
    React.useEffect(() => {
        const loginStatus = localStorage.getItem('loginStatus');
        if (loginStatus === 'true') {
            navigate('/home');
        }
    }, [navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                // Set login status to true
                localStorage.setItem('loginStatus', 'true');
                navigate('/home');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // Inline CSS styles
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
        },
        background: {
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            width: '100%',
            maxWidth: '400px',
        },
        card: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.95)',
            animation: 'slideUp 0.5s ease-out',
        },
        header: {
            textAlign: 'center',
            marginBottom: '32px',
        },
        title: {
            color: '#1890ff',
            marginBottom: '8px !important',
            fontWeight: '600',
        },
        subtitle: {
            fontSize: '14px',
        },
        inputPrefix: {
            color: '#1890ff',
        },
        loginOptions: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '8px',
        },
        forgotPasswordLink: {
            padding: '0',
            height: 'auto',
            fontSize: '14px',
        },
        loginButton: {
            height: '45px',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '16px',
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            border: 'none',
        },
        footer: {
            textAlign: 'center',
            marginTop: '16px',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.background}>
                <div style={styles.content}>
                    <Card
                        style={styles.card}
                        bodyStyle={{ padding: '40px' }}
                    >
                        <div style={styles.header}>
                            <Title level={2} style={styles.title}>
                                Welcome Back
                            </Title>
                            <Text type="secondary" style={styles.subtitle}>
                                Sign in to your account to continue
                            </Text>
                        </div>

                        {error && (
                            <Alert
                                message={error}
                                type="error"
                                showIcon
                                closable
                                style={{
                                    marginBottom: 24,
                                    borderRadius: '8px'
                                }}
                                onClose={() => setError('')}
                            />
                        )}

                        <Form
                            form={form}
                            name="login"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            size="large"
                            layout="vertical"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Username must be less than 50 characters!',
                                    },
                                ]}
                                style={{ marginBottom: '16px' }}
                            >
                                <Input
                                    prefix={<UserOutlined style={styles.inputPrefix} />}
                                    placeholder="Enter your username"
                                    allowClear
                                    style={{ borderRadius: '6px' }}
                                    maxLength={50}
                                    showCount
                                />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Password must be less than 50 characters!',
                                    },
                                ]}
                                style={{ marginBottom: '8px' }}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={styles.inputPrefix} />}
                                    placeholder="Enter your password"
                                    allowClear
                                    style={{ borderRadius: '6px' }}
                                    maxLength={50}
                                    showCount
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: '16px' }}>
                                <div style={styles.loginOptions}>
                                    <Link to="/forgot-password">
                                        <Button
                                            type="link"
                                            style={styles.forgotPasswordLink}
                                        >
                                            Forgot Password?
                                        </Button>
                                    </Link>
                                </div>
                            </Form.Item>

                            <Form.Item style={{ marginBottom: '16px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={styles.loginButton}
                                    loading={loading}
                                    block
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={styles.footer}>
                            <Space direction="vertical" style={{ width: '100%' }} align="center">
                                <Text type="secondary">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/signup"
                                        style={{
                                            fontWeight: '500',
                                            color: '#1890ff',
                                            textDecoration: 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#096dd9';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#1890ff';
                                        }}
                                    >
                                        Sign up now
                                    </Link>
                                </Text>
                            </Space>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Add keyframes for animation */}
            <style>
                {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
            </style>
        </div>
    );
};

export default Login;