import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, Alert, Divider, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const SignUp = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Check if user is already logged in
    useEffect(() => {
        const loginStatus = localStorage.getItem('loginStatus');
        if (loginStatus === 'true') {
            navigate('/home');
        }
    }, [navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:8081/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                    first_name: values.firstName,
                    last_name: values.lastName,
                    phone: values.phone,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Account created successfully! Redirecting to login...');
                form.resetFields();

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
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
            maxWidth: '500px',
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
        signupButton: {
            height: '45px',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '16px',
            background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
            border: 'none',
        },
        footer: {
            textAlign: 'center',
        },
        loginLink: {
            fontWeight: '500',
            color: '#1890ff',
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
                                Create Account
                            </Title>
                            <Text type="secondary" style={styles.subtitle}>
                                Sign up to get started with our platform
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

                        {success && (
                            <Alert
                                message={success}
                                type="success"
                                showIcon
                                style={{
                                    marginBottom: 24,
                                    borderRadius: '8px'
                                }}
                            />
                        )}

                        <Form
                            form={form}
                            name="signup"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            size="large"
                            layout="vertical"
                            scrollToFirstError
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="First Name"
                                        name="firstName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your first name!',
                                            },
                                            {
                                                max: 25,
                                                message: 'First name must be less than 25 characters!',
                                            },
                                        ]}
                                        style={{ marginBottom: '16px' }}
                                    >
                                        <Input
                                            prefix={<IdcardOutlined style={styles.inputPrefix} />}
                                            placeholder="Enter your first name"
                                            allowClear
                                            maxLength={25}
                                            style={{ borderRadius: '6px' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Last Name"
                                        name="lastName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your last name!',
                                            },
                                            {
                                                max: 25,
                                                message: 'Last name must be less than 25 characters!',
                                            },
                                        ]}
                                        style={{ marginBottom: '16px' }}
                                    >
                                        <Input
                                            prefix={<IdcardOutlined style={styles.inputPrefix} />}
                                            placeholder="Enter your last name"
                                            maxLength={25}
                                            allowClear
                                            style={{ borderRadius: '6px' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                    {
                                        min: 3,
                                        message: 'Username must be at least 3 characters!',
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
                                    placeholder="Choose a username"
                                    allowClear
                                    maxLength={50}
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Please enter a valid email address!',
                                    },
                                ]}
                                style={{ marginBottom: '16px' }}
                            >
                                <Input
                                    prefix={<MailOutlined style={styles.inputPrefix} />}
                                    placeholder="Enter your email"
                                    allowClear
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Phone Number"
                                name="phone"
                                rules={[
                                    {
                                        pattern: /^[0-9+\-\s()]*$/,
                                        message: 'Please enter a valid phone number!',
                                    },
                                    {
                                        max: 10,
                                        message: 'Phone number must be 10 digits!',
                                    },
                                ]}
                                style={{ marginBottom: '16px' }}
                            >
                                <Input
                                    prefix={<PhoneOutlined style={styles.inputPrefix} />}
                                    placeholder="Enter your phone number"
                                    allowClear
                                    style={{ borderRadius: '6px' }}
                                    maxLength={10}
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
                                        min: 6,
                                        message: 'Password must be at least 6 characters!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Password must be less than 50 characters!',
                                    },
                                ]}
                                style={{ marginBottom: '16px' }}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={styles.inputPrefix} />}
                                    placeholder="Create a password"
                                    allowClear
                                    style={{ borderRadius: '6px' }}
                                    maxLength={50}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Confirm Password"
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The two passwords do not match!'));
                                        },
                                    }),
                                ]}
                                style={{ marginBottom: '24px' }}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={styles.inputPrefix} />}
                                    placeholder="Confirm your password"
                                    allowClear
                                    maxLength={50}
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: '16px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={styles.signupButton}
                                    loading={loading}
                                    block
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(82, 196, 26, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </Form.Item>
                        </Form>

                        <Divider plain style={{ margin: '20px 0' }}>
                            or
                        </Divider>

                        <div style={styles.footer}>
                            <Space direction="vertical" style={{ width: '100%' }} align="center">
                                <Text type="secondary">
                                    Already have an account?{' '}
                                    <Link
                                        to="/"
                                        style={styles.loginLink}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#096dd9';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#1890ff';
                                        }}
                                    >
                                        Sign in here
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

export default SignUp;