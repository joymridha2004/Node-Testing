import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, Alert, Steps, message } from 'antd';
import { MailOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Step } = Steps;

const ForgetPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');

    // Check if user is already logged in
    useEffect(() => {
        const loginStatus = localStorage.getItem('loginStatus');
        if (loginStatus === 'true') {
            navigate('/home');
        }
    }, [navigate]);

    const onFinishEmail = async (values) => {
        setLoading(true);
        setError('');

        try {
            // Simulate API call to send reset code
            setTimeout(() => {
                setEmail(values.email);
                setCurrentStep(1);
                setLoading(false);
                message.success('Reset code sent to your email!');
            }, 1500);
        } catch (error) {
            setError('Failed to send reset code. Please try again.');
            setLoading(false);
        }
    };

    const onFinishReset = async (values) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8081/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: values.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password reset successfully! Redirecting to login...');
                setCurrentStep(2);

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                setError(data.message || 'Password reset failed');
            }
        } catch (error) {
            console.error('Reset error:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
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
            maxWidth: '450px',
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
        resetButton: {
            height: '45px',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '16px',
            background: 'linear-gradient(135deg, #fa541c 0%, #d4380d 100%)',
            border: 'none',
            marginTop: '16px',
        },
        backButton: {
            height: '45px',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '16px',
            marginRight: '12px',
        },
        footer: {
            textAlign: 'center',
            marginTop: '24px',
        },
        steps: {
            marginBottom: '32px',
        },
        successIcon: {
            fontSize: '64px',
            color: '#52c41a',
            marginBottom: '24px',
        },
    };

    const steps = [
        {
            title: 'Enter Email',
            content: (
                <Form
                    form={form}
                    name="forgotPassword"
                    onFinish={onFinishEmail}
                    autoComplete="off"
                    size="large"
                    layout="vertical"
                >
                    <Form.Item
                        label="Email Address"
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
                            placeholder="Enter your registered email"
                            allowClear
                            style={{ borderRadius: '6px' }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '0' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={styles.resetButton}
                            loading={loading}
                            block
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(250, 84, 28, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            {loading ? 'Verifying Email...' : 'Verify Email'}
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: 'Reset Password',
            content: (
                <Form
                    name="resetPassword"
                    onFinish={onFinishReset}
                    autoComplete="off"
                    size="large"
                    layout="vertical"
                >
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your new password!',
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
                            placeholder="Enter new password"
                            allowClear
                            style={{ borderRadius: '6px' }}
                            maxLength={50}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your new password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
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
                            placeholder="Confirm new password"
                            allowClear
                            style={{ borderRadius: '6px' }}
                            maxLength={50}
                        />
                    </Form.Item>

                    <Space style={{ width: '100%' }}>
                        <Button
                            style={styles.backButton}
                            block
                            onClick={() => setCurrentStep(0)}
                        >
                            Back
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                ...styles.resetButton,
                                flex: 1,
                            }}
                            loading={loading}
                            block
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(250, 84, 28, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </Space>
                </Form>
            ),
        },
        {
            title: 'Success',
            content: (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <CheckCircleOutlined style={styles.successIcon} />
                    <Title level={3} style={{ color: '#52c41a', marginBottom: '8px' }}>
                        Password Reset Successful!
                    </Title>
                    <Text type="secondary">
                        Your password has been reset successfully. Redirecting to login page...
                    </Text>
                </div>
            ),
        },
    ];

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
                                Reset Your Password
                            </Title>
                            <Text type="secondary" style={styles.subtitle}>
                                Follow the steps to reset your password
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

                        <Steps current={currentStep} style={styles.steps} size="small">
                            <Step title="Verify Email" />
                            <Step title="New Password" />
                            <Step title="Complete" />
                        </Steps>

                        <div>{steps[currentStep].content}</div>

                        {currentStep !== 2 && (
                            <div style={styles.footer}>
                                <Space direction="vertical" style={{ width: '100%' }} align="center">
                                    <Text type="secondary">
                                        Remember your password?{' '}
                                        <Link
                                            to="/"
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
                                            Back to Login
                                        </Link>
                                    </Text>
                                </Space>
                            </div>
                        )}
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

export default ForgetPassword;